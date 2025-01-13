// -- // @ts-nocheck

import { Environment } from "@/config";
import { abi } from "@/constants/abi";
import { SUI_OpenSwap, SUI_Swap, SUI_SwapToken, SUT_SwapTokenContractType } from "@/types/swap-market.types";
import { ethers, JsonRpcProvider } from 'ethers';
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { Account, privateKeyToAccount, smartWallet } from "thirdweb/wallets";
import { ErrorDecoder } from 'ethers-decode-error';
import type { DecodedError } from "ethers-decode-error";
import { thirdWebClient, currentChain } from "./thirdWebClient.ts";
import { SUI_CreateAndUpdateSwapFunctionProps, SUI_SwapAsset, SUT_CancelSwapType } from "@/types/wallet-proxy.types.js";
import { SUE_SWAP_ASSET_TYPE, SUE_SWAP_MODE } from "@/constants/enums.ts";
import { getContract, prepareContractCall, sendTransaction, toWei, ZERO_ADDRESS } from "thirdweb";
import { SUT_Address } from "@/types/global.types.js";
import { showUnderConstructionToast } from "./helpers.tsx";

let walletInstance: ReturnType<typeof walletProxy> | null = null;

export const getWalletProxy = (): ReturnType<typeof walletProxy> => {
  if (!walletInstance) {
    walletInstance = walletProxy();
  }
  return walletInstance;
};

export const walletProxy = () => {
  let connectedWalletAccount: Account | null = null;

  const setConnectedWalletAccount = (connectedAccount: Account) => {
    connectedWalletAccount = connectedAccount;
  };

  const getConnectedWalletAccount = () => {
    return connectedWalletAccount;
  };

  const getEthersProviderAndSigner = async (smartAccount?: Account) => {
    // convert a thirdweb account to ethers signer
    let provider: JsonRpcProvider = await ethers6Adapter.provider.toEthers({ client: thirdWebClient, chain: currentChain });
    let signer = await ethers6Adapter.signer.toEthers({
      client: thirdWebClient,
      chain: currentChain,
      account: smartAccount ? smartAccount : connectedWalletAccount!,
    });
    return { provider, signer };
  };

  const getEnsInformationByWalletAddress = async (walletAddress: string) => {
    let avatar = null;

    const { provider } = await getEthersProviderAndSigner();
    const ensName = await provider.lookupAddress(walletAddress);

    if (ensName) {
      const resolver = await provider.getResolver(ensName);
      if (resolver) {
        avatar = await resolver.getAvatar();
      }
    }

    return { ensName, avatar };
  };

  const getSwapupContractInstance = async (smartAccount?: Account) => {
    const { signer } = await getEthersProviderAndSigner(smartAccount);
    const contract = new ethers.Contract(
      Environment.SWAPUP_CONTRACT,
      abi.swapUp,
      signer
    );
    return contract;
  };

  const getNamespaceContractInstance = async () => {
    const { signer } = await getEthersProviderAndSigner();
    const contract = new ethers.Contract(
      "0x2674e4fae872780f01b99e109e67749b765703fb",
      abi.namespace,
      signer
    );
    return contract;
  };

  const getUserApproval = async (swap: SUI_Swap, init = true) => {
    //if there are multiple NFT's in different smart contracts then we will have to call approve for all
    //get unique contracts from swap.metadata.init.tokens
    let tokens =
      (init === true)
        ? swap.metadata.init.tokens
        : swap.metadata.accept.tokens;

    let transactions = [];

    //initiate all the approves at once and then wait
    for (const currentToken of tokens) {
      try {
        let tx = await setApprovalForAll(currentToken);
        if (tx) transactions.push(tx);
      } catch (err) {
        //errors like user rejecting the transaction in metamask
        console.log(err);
        return false;
      }
    }

    for (const tx of transactions) {
      if ((await getTransactionReceipt(tx)).status === 0) return false;
    }

    return true;
  };

  const getAmountInWeiForErc20Token = async (currentToken: SUI_SwapToken) => {
    const { signer } = await getEthersProviderAndSigner();
    const contract = new ethers.Contract(
      currentToken.address,
      abi.erc20,
      signer
    );

    const decimals = await contract.decimals();
    const amountInWei = await ethers.parseUnits(String(currentToken.value?.amount), decimals);
    console.log("amountInWei: ", amountInWei);
    console.log("type of amountInWei: ", typeof amountInWei);
    return amountInWei;
  };

  //This function checks if our swap contract is given approval to move NFT minted from a contract 
  const setApprovalForAll = async (currentToken: SUI_SwapToken) => {
    const { signer } = await getEthersProviderAndSigner();
    const contract = new ethers.Contract(
      currentToken.address,
      (currentToken.type as SUT_SwapTokenContractType) === "ERC20" ? abi.erc20 : abi.nft,
      signer
    );

    const currentSmartContract = Environment.SWAPUP_CONTRACT;

    let approved4all;

    if ((currentToken.type as SUT_SwapTokenContractType) === 'ERC20') {
      // const decimals = await contract.decimals();
      // const amountInWei = await ethers.parseUnits(String(currentToken.value?.amount), decimals);
      const amountInWei = toWei(String(currentToken.value?.amount));
      approved4all = await contract.approve(currentSmartContract, amountInWei);
    } else {
      approved4all = await contract.isApprovedForAll(signer, currentSmartContract);
    }


    console.log('ApprovedForAll : ' + approved4all);
    if (approved4all) return null;

    const tx = await contract.setApprovalForAll(currentSmartContract, true);
    console.log(tx.hash);

    return tx;
  };

  const getUserSignature = async (swap: SUI_Swap | SUI_OpenSwap, userSignMessage: string) => {
    const { signer } = await getEthersProviderAndSigner();
    const domain = {
      name: "SwapUp",
      version: "2",
      chainId: Environment.CHAIN_ID,
      verifyingContract: Environment.SWAPUP_CONTRACT
    };

    const types = {
      set: [
        { name: "sender", type: "address" },
        { name: "msg", type: "string" }
      ]
    };

    const signerAddress = await signer.getAddress();

    try {

      let sign = await signer.signTypedData(domain, types, {
        sender: signerAddress,
        msg: await generateSignString(swap, userSignMessage, signerAddress)
      });

      console.log("signature collected --->", sign);
      return sign;

    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // const generateSignString = async (swap: SUI_Swap | SUI_OpenSwap, userSignMessage: string) => {
  //   const initNfts = swap.metadata.init.tokens.map((tkn) => {
  //     return `{amountOrID: ${tkn.id}, assetType: ${tkn.type}, contractAddress: ${tkn.address}}`;
  //   }).join(", ");

  //   let acceptAssets = null;

  //   //  as only original open create swap doest not have receiver assets and address
  //   if (swap.metadata.accept && swap.metadata.accept.tokens.length > 0) {
  //     acceptAssets = swap.metadata.accept.tokens.map((tkn) => {
  //       return `{amountOrID: ${tkn.id}, assetType: ${tkn.type}, contractAddress: ${tkn.address}}`;
  //     }).join(", ");
  //   }

  //   let signStr = `${swap.init_address.toLowerCase()} is signing to ${userSignMessage} from: ${swap.init_address.toLowerCase()} with the Assets, [${initNfts}]`;

  //   if (acceptAssets) {
  //     signStr = signStr + ` to: ${swap.accept_address.toLowerCase()} with the Assets, [${acceptAssets}]`;
  //   }

  //   console.log("Signature string: ", signStr);

  //   return signStr;
  // };

  // const getFormattedAssetsBySwap = async (swap: SUI_Swap | SUI_OpenSwap) => {
  //   try {
  //     let initAssets: SUI_SwapAsset[] = [];
  //     let acceptAssets: SUI_SwapAsset[] = [];

  //     if (swap.metadata.init.tokens.length > 0) {
  //       for (const token of swap.metadata.init.tokens) {
  //         const newInitToken: SUI_SwapAsset = {
  //           assetAddress: token.address,
  //           amountOrID: (token.type as SUT_SwapTokenContractType) === "ERC20" ? await getAmountInWeiForErc20Token(token) : Number(token.id),
  //           // assetType: SUE_SWAP_ASSET_TYPE[token.type as keyof typeof SUE_SWAP_ASSET_TYPE]
  //           assetType: token.type
  //         };
  //         initAssets.push(newInitToken);
  //       }
  //     }

  //     if (swap.metadata.accept && swap.metadata.accept.tokens.length > 0) {
  //       for (const token of swap.metadata.accept.tokens) {
  //         const newAcceptToken: SUI_SwapAsset = {
  //           assetAddress: token.address,
  //           amountOrID: (token.type as SUT_SwapTokenContractType) === "ERC20" ? await getAmountInWeiForErc20Token(token) : Number(token.id),
  //           // assetType: SUE_SWAP_ASSET_TYPE[token.type as keyof typeof SUE_SWAP_ASSET_TYPE]
  //           assetType: token.type
  //         };

  //         acceptAssets.push(newAcceptToken);
  //       }
  //     }

  //     return { initAssets, acceptAssets };
  //   } catch (err) {
  //     throw err;
  //   }

  // };

  const generateSignString = async (swap: SUI_Swap | SUI_OpenSwap, userSignMessage: string, signerAddress: string) => {

    const { initAssets, acceptAssets } = await getFormattedAssetsBySwap(swap, true);

    const iniFormattedAssets = initAssets.map((tkn) => {
      return `{amountOrID: ${tkn.amountOrID}, assetType: ${tkn.assetType}, contractAddress: ${tkn.assetAddress.toLowerCase()}}`;
    }).join(", ");

    const acceptFormattedAssets = acceptAssets.map((tkn) => {
      return `{amountOrID: ${tkn.amountOrID}, assetType: ${tkn.assetType}, contractAddress: ${tkn.assetAddress.toLowerCase()}}`;
    }).join(", ");

    let signStr = `${signerAddress.toLowerCase()} is signing to ${userSignMessage} from: ${swap.init_address.toLowerCase()} with the Assets, [${iniFormattedAssets}]`;

    if (acceptAssets.length > 0) {
      signStr = signStr + ` to: ${swap.accept_address.toLowerCase()} with the Assets, [${acceptFormattedAssets}]`;
    }

    console.log("Signature string: ", signStr);

    return signStr;
  };

  const getFormattedAssetsBySwap = async (swap: SUI_Swap | SUI_OpenSwap, getAmountInWei: boolean = false) => {
    try {
      let initAssets: SUI_SwapAsset[] = [];
      let acceptAssets: SUI_SwapAsset[] = [];

      // getAmountInWei ? await getAmountInWeiForErc20Token(token) : token.value?.amount!

      if (swap.metadata.init.tokens.length > 0) {
        for (const token of swap.metadata.init.tokens) {
          const newInitToken: SUI_SwapAsset = {
            amountOrID: (token.type as SUT_SwapTokenContractType) === "ERC20" ?
              getAmountInWei ? String(toWei(String(token.value?.amount!))) : String(token.value?.amount!)
              : token.id,
            assetType: token.type,
            assetAddress: token.address
          };
          initAssets.push(newInitToken);
        }
      }

      if (swap.metadata.accept && swap.metadata.accept.tokens.length > 0) {
        for (const token of swap.metadata.accept.tokens) {
          const newAcceptToken: SUI_SwapAsset = {
            amountOrID: (token.type as SUT_SwapTokenContractType) === "ERC20" ?
              getAmountInWei ? String(toWei(String(token.value?.amount!))) : String(token.value?.amount!)
              : token.id,
            assetType: token.type,
            assetAddress: token.address
          };

          acceptAssets.push(newAcceptToken);
        }
      }

      return { initAssets, acceptAssets };
    } catch (err) {
      throw err;
    }

  };

  const createAndUpdateSwap = async (props: SUI_CreateAndUpdateSwapFunctionProps) => {
    try {
      const { swap, swapAction, signature, messageSignerAddress, userSignMessage } = props;

      showUnderConstructionToast();
      return null;

      let initAssets: SUI_SwapAsset[] = [];
      let acceptAssets: SUI_SwapAsset[] = [];

      let contract = await getSwapupContractInstance(connectedWalletAccount!);

      // Step - 3: Convert swap tokens to assets
      // 3.1: conversion for initiator tokens
      // if (swap.metadata.init.tokens.length > 0) {
      //   for (const token of swap.metadata.init.tokens) {
      //     const newInitToken: SUI_SwapAsset = {
      //       assetAddress: token.address,
      //       amountOrID: (token.type as SUT_SwapTokenContractType) === "ERC20" ? await getAmountInWeiForErc20Token(token) : Number(token.id),
      //       // assetType: SUE_SWAP_ASSET_TYPE[token.type as keyof typeof SUE_SWAP_ASSET_TYPE]
      //       assetType: token.type
      //     };
      //     initAssets.push(newInitToken);
      //   }
      // }

      // // 3.2: conversion for acceptor tokens
      // if (swap.metadata.accept && swap.metadata.accept.tokens.length > 0) {
      //   for (const token of swap.metadata.accept.tokens) {
      //     const newAcceptToken: SUI_SwapAsset = {
      //       assetAddress: token.address,
      //       amountOrID: (token.type as SUT_SwapTokenContractType) === "ERC20" ? await getAmountInWeiForErc20Token(token) : Number(token.id),
      //       // assetType: SUE_SWAP_ASSET_TYPE[token.type as keyof typeof SUE_SWAP_ASSET_TYPE]
      //       assetType: token.type
      //     };

      //     acceptAssets.push(newAcceptToken);
      //   }
      // }

      const formattedInitAssets = initAssets.map(asset => [
        asset.assetAddress,
        BigInt(asset.amountOrID),
        asset.assetType,
      ]) as [string, bigint, string][];

      const formattedAcceptAssets = acceptAssets.map(asset => [
        asset.assetAddress,
        BigInt(asset.amountOrID),
        asset.assetType,
      ]) as [string, bigint, string][];

      // let feeInETH = await contract.getFeeInETH();
      // console.log(feeInETH);

      let swapType = swap.swap_mode === 1 ? 'PRIVATE' : 'OPEN';
      // if (swapType === 'OPEN' && swapAction !== 'COUNTER') return null; //prevent open market swaps for now.

      let gasLimit = 900000;
      let tx = null;
      let prepareTransaction;

      const swapupContract = getContract({
        address: Environment.SWAPUP_CONTRACT,
        client: thirdWebClient,
        chain: currentChain,
      });

      // Step - 4: Execute smart contract call based on Action type
      switch (swapAction) {
        case 'CREATE':
          // tx = await contract["createSwap(string, address, tuple(address, uint256)[], tuple(address, uint256)[], string)"](
          //   swap.swap_mode === SUE_SWAP_MODE.OPEN ? (swap as SUI_OpenSwap).open_trade_id : swap.trade_id,
          //   swap.swap_mode === SUE_SWAP_MODE.OPEN ? "0x0000000000000000000000000000000000000000" : swap.accept_address,
          //   initAssets,
          //   acceptAssets,
          //   swapType,
          //   {
          //     gasLimit: gasLimit,
          //     value: feeInETH, //add a bit more to 
          //   }
          // );

          // tx = await contract["createSwap(address, address, address, (address,uint256,string)[], (address,uint256,string)[], string, string, bytes, string)"](
          //   messageSignerAddress,
          //   swap.init_address,
          //   swap.swap_mode === SUE_SWAP_MODE.OPEN ? ZERO_ADDRESS : swap.accept_address,
          //   initAssets,
          //   acceptAssets,
          //   swap.swap_mode === SUE_SWAP_MODE.OPEN ? (swap as SUI_OpenSwap).open_trade_id : swap.trade_id,
          //   swapType,
          //   signature,
          //   userSignMessage,
          //   {
          //     gasLimit: gasLimit,
          //     // value: feeInETH, //add a bit more to 
          //   }
          // );

          prepareTransaction = prepareContractCall({
            contract: swapupContract,
            method: "function createSwap(address signerAddress, address initiatorAddress, address responderAddress, (address,uint256,string)[] initiatorAssets, (address,uint256,string)[] responderAssets,bytes signature, string signerStartingMessage, string swapId, string swapType)",
            params: [
              messageSignerAddress,
              swap.init_address,
              swap.swap_mode === SUE_SWAP_MODE.OPEN ? ZERO_ADDRESS : swap.accept_address,
              formattedInitAssets,
              formattedAcceptAssets,
              signature as SUT_Address,
              userSignMessage,
              swap.swap_mode === SUE_SWAP_MODE.OPEN ? (swap as SUI_OpenSwap).open_trade_id : swap.trade_id,
              swapType,
            ],
          });

          // Send the transfer transaction from the smart account
          tx = await sendTransaction({
            transaction: prepareTransaction,
            account: connectedWalletAccount!
          });

          console.log("Transaction: ", tx);
          break;
        case 'PROPOSE':
          tx = await contract["proposeToOpenSwap(string, string, tuple(address, uint256)[])"](
            (swap as SUI_OpenSwap).open_trade_id,
            swap.trade_id,
            initAssets,
            // {
            //   gasLimit: gasLimit,
            //   value: feeInETH, //add a bit more to 
            // }
          );
          console.log(tx);
          break;
        case 'COUNTER':
          tx = await contract["counterSwap(string, string, tuple(address, uint256)[], tuple(address, uint256)[])"](
            swap.trade_id,
            swapType,
            initAssets,
            acceptAssets,
            {
              gasLimit: gasLimit,
              // value: feeInETH, //add a bit more to 
            }
          );
          console.log(tx);
          break;
        case 'ACCEPT':
        case 'REJECT':
          // tx = await contract["completeSwap(string, string, string)"](
          //   swap.trade_id,
          //   swapAction === 'ACCEPT' ? 'COMPLETED' : 'REJECTED',
          //   swapType,
          //   {
          //     gasLimit: gasLimit,
          //     // value: feeInETH, //add a bit more to 
          //   }
          // );
          // tx = await contract["completeSwap(address, address, address, (address,uint256,string)[], (address,uint256,string)[], string, string, string, bytes, string)"](
          //   messageSignerAddress,
          //   swap.init_address,
          //   swap.swap_mode === SUE_SWAP_MODE.OPEN ? ZERO_ADDRESS : swap.accept_address,
          //   initAssets,
          //   acceptAssets,
          //   swap.trade_id,
          //   swapAction === 'ACCEPT' ? 'COMPLETED' : 'REJECTED',
          //   swapType,
          //   signature,
          //   userSignMessage,
          //   {
          //     gasLimit: gasLimit,
          //     // value: feeInETH, //add a bit more to 
          //   }
          // );

          prepareTransaction = prepareContractCall({
            contract: swapupContract,
            method: "function completeSwap(address signerAddress, address initiatorAddress, address responderAddress, (address,uint256,string)[] initiatorAssets, (address,uint256,string)[] responderAssets, bytes signature, string signerStartingMessage, string tradeId, string swapStatus, string swapType)",
            params: [
              messageSignerAddress,
              swap.init_address,
              swap.swap_mode === SUE_SWAP_MODE.OPEN ? ZERO_ADDRESS : swap.accept_address,
              formattedInitAssets,
              formattedAcceptAssets,
              signature as SUT_Address,
              userSignMessage,
              swap.trade_id,
              swapAction === 'ACCEPT' ? 'COMPLETED' : 'REJECTED',
              swapType
            ],
          });

          // Send the transfer transaction from the smart account
          tx = await sendTransaction({
            transaction: prepareTransaction,
            account: connectedWalletAccount!
          });

          console.log(tx);
          break;
        case 'CANCEL':
          tx = await contract["cancelSwap(string, string)"](
            swap.trade_id,
            (swap.swap_mode === SUE_SWAP_MODE.OPEN ? 'PROPOSAL' : 'SWAP') as SUT_CancelSwapType
          );
          console.log(tx);
          break;
        case 'CANCEL-ORIGINAL-OPEN-SWAP':
          tx = await contract["cancelSwap(string, string)"](
            (swap as SUI_OpenSwap).open_trade_id,
            'SWAP'
          );
          console.log(tx);
          break;
      }

      // Step - 5: Get transaction receipt
      // let res = await getTransactionReceipt(tx);
      // console.log("rec", res);
      return tx;
    } catch (err) {
      console.log("txErr", err);
      return null; //transaction rejected or other issues
    }

  };

  const getFeeInETH = async () => {
    let contract = await getSwapupContractInstance();

    try {
      const tx = await contract.getFeeInETH();
      console.log(tx);
    } catch (err) {
      const errorDecoder = ErrorDecoder.create();
      const decodedError: DecodedError = await errorDecoder.decode(err);
      console.log(`TX Error: ${decodedError.type}, ${decodedError.reason}`);
      return null; //transaction rejected or other issues
    }
  };

  //get the current state of an existing swap from BC
  const getSwap = async (swapId: string) => {
    let contract = await getSwapupContractInstance();
    try {
      const tx = await contract.swaps(swapId);
      console.log(tx);
    } catch (err) {
      const errorDecoder = ErrorDecoder.create();
      const decodedError: DecodedError = await errorDecoder.decode(err);
      console.log(`TX Error: ${decodedError.type}, ${decodedError.reason}`);
      return null; //transaction rejected or other issues
    }
  };

  const getTransactionReceipt = async (tx: any) => {
    try {
      // Wait for the transaction to be mined
      let rcpt = await tx.wait();
      console.log(rcpt);
      return rcpt;
    } catch (error: any) {
      const errorDecoder = ErrorDecoder.create();
      const decodedError: DecodedError = await errorDecoder.decode(error);

      console.log(`BC Error: ${decodedError.type}, ${decodedError.reason}`);
    }
    return null;
  };

  const getTimestamp = async (tx: any) => {
    const provider = tx.provider;
    const receipt = await provider.getTransactionReceipt(tx.hash);
    const block = await provider.getBlock(receipt.blockNumber);
    return block.timestamp;
  };

  return {
    setConnectedWalletAccount,
    getConnectedWalletAccount,
    getEthersProviderAndSigner,
    getEnsInformationByWalletAddress,
    getNamespaceContractInstance,
    getTransactionReceipt,
    getUserApproval,
    getUserSignature,
    createAndUpdateSwap,
    getFeeInETH,
    getSwap,
    getFormattedAssetsBySwap
  };
};