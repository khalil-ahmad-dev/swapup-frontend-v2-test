import { SUI_SwapToken } from "./swap-market.types";

export interface SUI_TwitterAuthCodeToAccessTokenReqParams {
  code: string;
  redirectUri: string;
  walletAddress: string;
}

export interface SUI_TwitterUserInformation {
  id: string,
  name: string;
  username: string;
}

export interface SUI_TwitterAccessToken {
  accessToken: string;
  refreshToken: string | undefined;
  expiresIn: number;
  scope: string[];
  createdAt: number;
  userInfo: SUI_TwitterUserInformation;
}

interface SUI_TwitterPostImageProps {
  tradeId: string;
  title: string;
  initTokens: SUI_SwapToken[];
  acceptTokens: SUI_SwapToken[];
}

export interface SUI_CreateTweetOnBehalfOfUserReqParams {
  imageProps: SUI_TwitterPostImageProps;
  mentions: string[];
  hashtags: string[];
  postTitle: string;
  appLink: string;
  postDescription: string;
  walletAddress: string;
}

export interface SUI_TwitterPostLocalStorageState {
  started: boolean,
  tradeId: string;
}

// Namespace types start here

interface SUI_SubnameItemAddress {
  "60"?: string;
}

interface SUI_SubnameMintTransaction {
  price: number;
  paymentReceiver: string;
}

interface SUI_SubnameItemText {
}
export interface SUI_NamespaceListedSubnameItem {
  chainId: number;
  owner: string;
  label: string;
  name: string;
  namehash: string;
  parentNamehash: string;
  texts: SUI_SubnameItemText;
  expiry: number;
  addresses: SUI_SubnameItemAddress;
  mintTransaction: SUI_SubnameMintTransaction;
}
//  Namespace types end here