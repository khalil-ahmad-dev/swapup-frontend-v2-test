import { SUI_CurrencyChainItem } from "./global.types";

export interface SUI_NewMember {
  id: string | number;
  wallet: string;
  smartAccount: string;
  title: string;
  avatar: string;
  createdAt: string;
  nftProfiles: SUI_NFTItem[];
  totalCollections: number;
  membershipCreatedAt: string;
}

export interface SUI_TopTrader {
  wallet: string;
  images: {
    avatar: string;
    coverImage: string;
  };
  title: string;
  createdAt: string;
  totalSwaps: number;
  totalCollections: number;
  subname: string;
}

export interface SUI_TrendingTokenPair {
  init: SUI_TrendingPairTokenItem;
  accept: SUI_TrendingPairTokenItem;
  count: number;
}

interface SUI_TrendingPairTokenItem {
  address: string;
  type: string;
  image_url: string;
  symbol: string;
}

export interface SUI_TrendingToken {
  address: string;
  type: string;
  image_url: string;
  symbol: string;
  trading_chain: number;
  tokenAppearance: number;
  additionalData: SUI_CurrencyChainItem | null;
}

// Trending NFTs collection
interface SUI_PaymentToken {
  payment_token_id: string;
  name: string;
  symbol: string;
  address: string | null;
  decimals: number;
}

interface SUI_ImageProperties {
  width: number;
  height: number;
  mime_type: string;
}

interface SUI_MarketplacePage {
  marketplace_id: string;
  marketplace_name: string;
  marketplace_collection_id: string;
  collection_url: string;
  verified: boolean | null;
}

interface SUI_FloorPrice {
  marketplace_id: string;
  marketplace_name: string;
  value: number;
  payment_token: SUI_PaymentToken;
  value_usd_cents: number;
}

interface SUI_TopBid {
  marketplace_id: string;
  marketplace_name: string;
  value: number;
  payment_token: SUI_PaymentToken;
  value_usd_cents: number;
}

interface SUI_CollectionRoyalty {
  source: string;
  total_creator_fee_basis_points: number;
  recipients: any[];
}

interface SUI_CollectionDetails {
  collection_id: string;
  name: string;
  description: string | null;
  image_url: string;
  image_properties: SUI_ImageProperties;
  banner_image_url: string | null;
  category: string | null;
  is_nsfw: boolean;
  external_url: string | null;
  twitter_username: string | null;
  discord_url: string | null;
  instagram_username: string | null;
  medium_username: string | null;
  telegram_url: string | null;
  marketplace_pages: SUI_MarketplacePage[];
  metaplex_mint: string | null;
  metaplex_candy_machine: string | null;
  metaplex_first_verified_creator: string | null;
  mpl_core_collection_address: string | null;
  floor_prices: SUI_FloorPrice[];
  top_bids: SUI_TopBid[];
  distinct_owner_count: number;
  distinct_nft_count: number;
  total_quantity: number;
  chains: string[];
  top_contracts: string[];
  collection_royalties: SUI_CollectionRoyalty[];
}

export interface SUI_TrendingCollection {
  collection_id: string;
  volume: number;
  volume_string: string;
  volume_usd_cents: number;
  volume_percent_change: number;
  transaction_count: number;
  transaction_count_percent_change: number;
  payment_token: SUI_PaymentToken;
  collection_details: SUI_CollectionDetails;
}
