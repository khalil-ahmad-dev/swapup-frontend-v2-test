import { createNamespaceClient } from "namespace-sdk";
import { Environment } from "@/config";
import { getWalletProxy } from "./walletProxy";

import { currentChain, thirdWebClient } from "./thirdWebClient";
import { Address, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { ethereum, sepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { INamespaceClient } from "namespace-sdk/dist/clients";
import { privateKeyToAccount, smartWallet } from "thirdweb/wallets";


const LISTED_NAME = Environment.NAMESPACE_LISTED_ENS_NAME;
const computedChain = currentChain.testnet ? sepolia : ethereum;


type SignTypedDataFunction = (params: {
  message: any;
  domain: any;
  primaryType: string;
  types: any;
}) => Promise<Address>;



const signTypedDataFunction: SignTypedDataFunction = async (params) => {
  const { signer } = await getWalletProxy().getEthersProviderAndSigner();
  // console.log("Signer: ", signer);

  const signature = await signer.signTypedData(
    params.domain,
    params.types,
    params.message
  );

  console.log("Signature collected --->", signature);
  return signature as Address;
};

export const getNamespaceClientAndListing = async () => {
  // console.log("Listed name: ", LISTED_NAME);
  const NamespaceClient = createNamespaceClient({
    chainId: currentChain.id,
    mintSource: `swapup`,
    rpcUrl: currentChain.rpc
  });

  // console.log("NamespaceClient: ", NamespaceClient);
  const listing = await NamespaceClient.getListedName(LISTED_NAME, computedChain.id);
  return { NamespaceClient, listing };
};

// Function to get user authentication tokens
export const getUserAuthTokens = async () => {
  const { NamespaceClient, listing } = await getNamespaceClientAndListing();
  const wallet = getWalletProxy().getConnectedWalletAccount()?.address! as Address;
  // const wallet = "0xfF9598c066A0349B9893Cf8015238b0BCE258923";
  const signingMessage = "I'm white listed user.";

  // // Domain with correct version
  // const domain = {
  //   name: "namespace",
  //   version: "1",
  //   chainId: currentChain.id,
  //   verifyingContract: "0x2674e4fae872780f01b99e109e67749b765703fb",
  // };

  // // Types structure with only the `msg` field
  // const types = {
  //   set: [
  //     { name: "msg", type: "string" },
  //   ]
  // };


  // Generate the auth tokens using the Namespace SDK
  const tokens = await NamespaceClient.generateAuthToken(
    wallet as Address,
    signTypedDataFunction,
    signingMessage
  );

  console.log("Auth tokens: ", tokens);
  return tokens;
};

export const handleCheckSubnameAvailability = async (subnameLabel: string) => {
  const { NamespaceClient, listing } = await getNamespaceClientAndListing();
  const isAvailable = await NamespaceClient.isSubnameAvailable(listing, subnameLabel);
  return isAvailable;
};

export const handleGetMintSubnameTransactionParams = async (subnameLabel: string, minterAddress: Address) => {
  const { NamespaceClient, listing } = await getNamespaceClientAndListing();

  const tokens = await getUserAuthTokens();

  const transactionParams = await NamespaceClient.getMintTransactionParameters(listing, {
    minterAddress,
    subnameLabel,
    subnameOwner: minterAddress,
    token: tokens.refreshToken
  });

  if (transactionParams) { console.log("Transaction Params:", transactionParams); }

  return transactionParams;
};

export const handleMintNewSubname = async (subnameLabel: string, minterAddress: Address) => {
  const transactionParams = await handleGetMintSubnameTransactionParams(subnameLabel, minterAddress);

  const namespaceContract = getContract({
    address: transactionParams.contractAddress,
    client: thirdWebClient,
    chain: currentChain,
    abi: transactionParams.abi
  });

  // This method is used for minting subname on Sepolia ETH & Ethereum mainnet (L1)
  // method: "function mint((bytes32 parentNode, string subnameLabel, address resolver, address subnameOwner, uint32 fuses, uint256 mintPrice, uint256 mintFee, uint64 ttl, uint64 expiry) context, bytes signature) external payable",

  const preparedTransaction = prepareContractCall({
    contract: namespaceContract,
    method: "function mint((address owner, string label, bytes32 parentNode, uint256 price, uint256 fee, address paymentReceiver, uint256 expiry, uint256 signatureExpiry, address verifiedMinter), bytes signature, bytes[] resolverData, bytes extraData) external payable",
    params: transactionParams.args,
    value: transactionParams.value
  });


  const transactionRes = await sendTransaction({
    transaction: preparedTransaction,
    account: getWalletProxy().getConnectedWalletAccount()!
  });

  return transactionRes;
};