import { SUE_PaymentMode } from "@/constants/enums";

export type SUT_ToastVariantType = "default" | "success" | "error" | "info" | "warning";
export type SUT_Address = `0x${string}`;
// export type SUT_PurchaseModeType = SUE_PaymentMode.CRYPTO_OR_CARD | SUE_PaymentMode.SUBSCRIPTION_TOKENS;

export interface SUI_NavItem {
  key: string;
  title: string;
  basePath: string;
  path: string;
  protected: boolean;
  hash: string;
}

export interface SUI_TabItem {
  key: string;
  title: string;
  path: string;
}

export interface SUI_NavigationObject {
  title: string;
  baseRoute: string;
  defaultActiveTab: string;
  tabs: SUI_TabItem[];
}

export interface INFTItem {
  id: string;
  title: string;
  collection: string;
  image: string;
  isTopRated?: boolean;
  network: INetwork;
  amount: number;
  rarityRank: number;
}

export interface SUI_RarityRankItem {
  from: number;
  to: number;
}

export interface SUI_SelectCurrencyItem {
  uuid: string;
  name: string;
  iconUrl: string;
}
export interface SUI_CurrencyChainItem {
  uuid: string;
  symbol: string;
  name: string;
  color: string;
  iconUrl: string;
  marketCap: string;
  price: string;
  listedAt: number;
  tier: number;
  change: string;
  rank: number;
  sparkline: string[];
  lowVolume: boolean;
  coinrankingUrl: string;
  "24hVolume": string;
  btcPrice: string;
  contractAddresses: any[];
}


interface SUI_NFTContract {
  address: string;
  name: string;
  symbol?: string;
  tokenType: string;
  totalSupply?: string;
  contractDeployer?: string;
  deployedBlockNumber?: number;
  openSea: Record<string, any>;
}

interface SUI_NFTAttribute {
  value: string;
  trait_type: string;
}

interface SUI_NFTPoints {
  [key: string]: number;
}


interface SUI_NFTRawMetadata {
  image?: string;
  name?: string;
  description?: string;
  attributes?: SUI_NFTAttribute[] | [];
  google_image?: string;
  ipfs_image?: string;
  image_url?: string;
  image?: string;
  points?: SUI_NFTPoints;
  image_details?: {
    format: string;
    width: number;
    sha256: string;
    bytes: number;
    height: number;
  };
  created_by?: string;
  metadata?: [];
  attributes?: [];

}

interface SUI_NFTTokenUri {
  gateway: string;
  raw: string;
}

interface SUI_NFTMedia {
  gateway: string;
  raw: string;
}

interface SUI_NFTItem {
  contract: SUI_NFTContract;
  tokenId: string;
  tokenType: string;
  title: string;
  description: string;
  timeLastUpdated: string;
  metadataError?: string;
  rawMetadata: SUI_NFTRawMetadata;
  tokenUri: SUI_NFTTokenUri;
  media: SUI_NFTMedia[];
  balance: number;
  rarityRank?: number;
}


declare global {
  interface Window {
    ethereum: any;
  }
}

export interface SUI_SwapCreation {
  isLoading: boolean,
  created: boolean;
}

export interface SUI_SelectedCollectionItem {
  label: string,
  value: string;
}
export interface SUI_CollectionItem {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  safelist_status: string;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  trait_offers_enabled: boolean;
  collection_offers_enabled: boolean;
  opensea_url: string;
  project_url: string;
  wiki_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_username: string;
  instagram_username: string;
  contracts: SUI_CollectionContract[];
}

interface SUI_CollectionContract {
  address: string;
  chain: string;
}

interface SUI_SubscriptionToken {
  uuid: string;
  address: string;
  name: string;
  symbol: string;
  iconUrl: string;
  chainId: number;
  usdAmount: number;
  tradeCharges: number;
  subnameCharges: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SUI_SubscriptionTokenBalance extends Pick<SUI_SubscriptionToken, 'address' | 'chainId' | "name" | "symbol" | "iconUrl" | "tradeCharges"> {
  balance: number,
  usdBalance: number;
}


export interface SUI_MintSubnamePayload {
  minterAddress: string;
  subnameLabel: string;
  paymentMode: SUE_PaymentMode;
}