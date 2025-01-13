// import { Environment } from "@/config";
// import { abi } from "@/constants/abi";
// import { SUI_Swap } from "@/types/swap-market.types";
// import { ethers, JsonRpcSigner } from 'ethers';

// export const getUserSignature = async (
//   swap: SUI_Swap,
//   swapEncodedMsg: string
// ) => {


//   //return "cancel" or "error" in case user does not sign OR there is an error
//   let swapEncodedBytes = await getSwapEncodedBytes(swap);

//   const sign = await getMetamaskSignature(swap, signer);
//   if (swapEncodedBytes !== swapEncodedMsg) {
//     // console.log("bytes---->\n", swapEncodedBytes);
//     if (sign) {
//       return { sign, swapEncodedBytes };
//     }
//   }

//   return { sign, swapEncodedBytes };

// };

// export const getSwapEncodedBytes = async (swap: SUI_Swap) => {
//   // console.log("meta", swap);

//   const abiEncoder = new ethers.AbiCoder();
//   const encodedInitNftBytesArray = swap.metadata.init.tokens.map(
//     (nft) => {
//       let type = nft.type === "ERC721" ? 721 : 1155;
//       return abiEncoder.encode(
//         ["string", "address", "uint", "uint"],
//         [nft.address, nft.address, nft.id, type]
//       );
//     }
//   );
//   const encodedAcceptNftBytesArray = swap.metadata.accept.tokens.map(
//     (nft) => {
//       let type = nft.type === "ERC721" ? 721 : 1155;
//       return abiEncoder.encode(
//         ["string", "address", "uint", "uint"],
//         [nft.address, nft.address, nft.id, type]
//       );
//     }
//   );
//   const encodedInitBytes = abiEncoder.encode(
//     ["bytes[]", "string", "address", "uint"],
//     [
//       encodedInitNftBytesArray,
//       swap.init_address,
//       swap.init_address,
//       swap.metadata.init.tokens.length
//     ]
//   );
//   const encodedAcceptBytes = abiEncoder.encode(
//     ["bytes[]", "string", "address", "uint"],
//     [
//       encodedAcceptNftBytesArray,
//       swap.accept_address,
//       swap.accept_address,
//       swap.metadata.accept.tokens.length
//     ]
//   );

//   let finalBytes = abiEncoder.encode(
//     ["bytes[]"],
//     [[encodedInitBytes, encodedAcceptBytes]]
//   );
//   return finalBytes;
// };

// export const getMetamaskSignature = async (
//   swap: SUI_Swap,
//   signer: JsonRpcSigner,
// ) => {

//   const domain = {
//     name: "swap up",
//     version: "1.0",
//     chainId: Environment.CHAIN_ID,
//     verifyingContract: Environment.SWAPUP_CONTRACT
//   };

//   const types = {
//     set: [
//       { name: "sender", type: "address" },
//       { name: "msg", type: "string" }
//     ]
//   };

//   try {

//     let sign = await signer.signTypedData(domain, types, {
//       sender: swap.init_address,
//       msg: await generateSignString(swap)
//     });

//     console.log("sign--->", sign);
//     return sign;

//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

// export const generateSignString = async (swap: SUI_Swap) => {
//   const initNfts = swap.metadata.init.tokens.map((tkn, i) => {
//     return i === swap.metadata.init.tokens.length - 1
//       ? `[
//         id: ${tkn.id}, 
//         type: ${tkn.type.substring(3)}, 
//         contract address: ${tkn.address}
//       ]`
//       : `[
//         id: ${tkn.id}, 
//         type: ${tkn.type.substring(3)}, 
//         contract address: ${tkn.address}
//       ]`;
//   });

//   const acceptNfts = swap.metadata.accept.tokens.map((tkn, i) => {
//     return i === swap.metadata.accept.tokens.length - 1
//       ? `[
//         id: ${tkn.id}, 
//         type: ${tkn.type.substring(3)}, 
//         contract address: ${tkn.address}
//       ]`
//       : `[
//         id: ${tkn.id}, 
//         type: ${tkn.type.substring(3)}, 
//         contract address: ${tkn.address}
//       ]`;
//   });

//   let signStr = `${swap.init_address} offering to swap NFTs, ${initNfts} with the NFTs, ${acceptNfts} belonging to ${swap.accept_address}`;
//   console.log("sign string :" + signStr);

//   return signStr;
// };

// export const getUserApproval = async (swap: SUI_Swap, init = true, signer: JsonRpcSigner) => {
//   //if there are multiple NFT's in different smart contracts then we will have to call approve for all
//   //get unique contracts from swap.metadata.init.tokens
//   let tokens =
//     init === true
//       ? swap.metadata.init.tokens
//       : swap.metadata.accept.tokens;
//   let uniqueContracts = [...new Set(tokens.map((e) => e.address))];
//   let transactions = [];

//   //initiate all the approves at once and then wait
//   for (const elem of uniqueContracts) {
//     try {
//       let tx = await triggerApprovalForAll(elem, signer);
//       if (tx) transactions.push(tx);
//     } catch (err) {
//       //errors like user rejecting the transaction in metamask
//       console.log(err);
//       return false;
//     }
//   }

//   for (const tx of transactions) {
//     if ((await getTransactionReceipt(tx)).status == 0) return false;
//   }

//   return true;
// };


// export const triggerApprovalForAll = async (nftContractAddress: string, signer: JsonRpcSigner) => {
//   const contract = new ethers.Contract(
//     nftContractAddress,
//     abi.nft,
//     signer
//   );

//   console.log(contract);

//   const approved4all = await contract.isApprovedForAll(
//     await signer.getAddress(),
//     Environment.SWAPUP_CONTRACT
//   );

//   console.log(approved4all);
//   if (approved4all) return null;

//   const tx = await contract.setApprovalForAll(Environment.SWAPUP_CONTRACT, true);
//   console.log(tx.hash);

//   return tx;
// };

// export const triggerTransfer = async (swap: SUI_Swap, signer: JsonRpcSigner) => {
//   const contract = new ethers.Contract(
//     Environment.SWAPUP_CONTRACT,
//     abi.swapUp,
//     signer
//   );
//   console.log(contract);
//   let swapEncodedBytes = await getSwapEncodedBytes(swap);
//   try {
//     let gas = 200000 + 60000 * 10;
//     const tx = await contract["swap(bytes,bytes)"](
//       swapEncodedBytes,
//       swap.init_sign,
//       {
//         gasLimit: gas
//       }
//     );
//     console.log(tx);
//     let res = await getTransactionReceipt(tx);
//     console.log("rec", res);
//     return res;
//   } catch (err) {
//     console.log("txErr", err);
//     return null; //transaction rejected or other issues
//   }
// };

// export const getTransactionReceipt = async (tx: any) => {
//   /*** Transaction Receipt Logic (https://docs.ethers.org/v5/api/providers/types/#providers-TransactionResponse)
// If the transaction execution failed (i.e. the receipt status is 0), a CALL_EXCEPTION error will be rejected with the following properties:
//   error.transaction - the original transaction
//   error.transactionHash - the hash of the transaction
//   error.receipt - the actual receipt, with the status of 0
// If the transaction is replaced by another transaction, a TRANSACTION_REPLACED error will be rejected with the following properties:
//   error.hash - the hash of the original transaction which was replaced
//   error.reason - a string reason; one of "repriced", "cancelled" or "replaced"
//   error.cancelled - a boolean; a "repriced" transaction is not considered cancelled, but "cancelled" and "replaced" are
//   error.replacement - the replacement transaction (a TransactionResponse)
//   error.receipt - the receipt of the replacement transaction (a TransactionReceipt)
// *** Transaction Receipt Logic */

//   let res = {
//     status: 0,
//     hash: tx.hash,
//     notes: "",
//     timeStamp: ''
//   };

//   try {
//     // Wait for the transaction to be mined
//     let rcpt = await tx.wait();
//     const timestamp = await getTimestamp(tx);
//     // The transaction was mined without issue
//     res.status = rcpt.status;
//     res.notes = `from: ${rcpt.from}`;
//     res.timeStamp = timestamp;

//   } catch (error: any) {
//     if (error.code === 'TRANSACTION_REPLACED') {
//       res.notes = `${error.reason}: ${error.hash} - ${error.replacement?.hash}`;
//       if (error.cancelled) {
//         // The transaction was cancelled or replaced
//         res.status = 0;
//       } else {
//         // Repriced
//         // The user used "speed up" or something similar in their client, but we now have the updated info
//         if (error.receipt.status === 1) {
//           res.status = 1;
//           res.notes += ` - repriced with success - replacement hash ${error.receipt.hash}`;
//         } else {
//           res.status = 0;
//           res.notes += ` - repriced with failure - replacement hash ${error.receipt.hash}`;
//         }
//       }
//     } else {
//       // Handle other types of errors
//       console.error(error);
//     }
//   }
//   return res;
// };


// export const getTimestamp = async (tx: any) => {
//   const provider = tx.provider;
//   const receipt = await provider.getTransactionReceipt(tx.hash);
//   const block = await provider.getBlock(receipt.blockNumber);
//   return block.timestamp;
// };