import { SUI_NFTItem, SUI_RarityRankItem } from "./global.types";
import { SUI_SwapAsset } from "./wallet-proxy.types";

export type SUT_GetNFTsByWalletIdResponse = SUI_NFTItem[];
export type SUT_SwapMode = 0 | 1;
export type SUT_SwapStatus = 1 | 2 | 3 | 4;
export type SUT_SwapOfferType = 0 | 1;
export type SUT_PreferredAssetType = "any" | "nft" | "currency";
export type SUT_TradeIdType = "trade_id" | "open_trade_id";
export type SUT_SwapRoomViewType = "default" | "view" | "propose" | "counter";
export type SUT_SwapTokenContractType = "ERC20" | "ERC21" | "ERC1155";
export type SUT_SwapTokenContractTypeNumbers = 0 | 1 | 2;
export type SUT_CompleteSwapActionType = 0 | 1;


// Swap Type starts here
export interface SUI_Swap {
  id?: string;
  trade_id: string;
  swap_mode: SUT_SwapMode;
  trading_chain: string;
  init_address: string;
  accept_address: string;
  init_sign: string;
  accept_sign: string;
  metadata: SUI_SwapMetadata;
  offer_type: SUT_SwapOfferType;
  status?: SUT_SwapStatus;
  created_at?: string;
  updated_at?: string;
  tx?: string;
  notes?: string;
}

export interface SUI_SwapMetadata {
  init: {
    tokens: SUI_SwapToken[];
  };
  accept: {
    tokens: SUI_SwapToken[];
  };
}

export interface SUI_SwapToken {
  id: string;
  address: string;
  type: string;
  image_url: string;
  value?: {
    amount: number;
    usdAmount: number;
    symbol: string;
  };
}


// Open Market Swap types
export interface SUI_OpenSwap extends SUI_Swap {
  swap_preferences: SUI_SwapPreferences;
  open_trade_id: string;
  number_of_offers?: number;

}

export interface SUI_SwapPreferences {
  expiration_date: string;
  preferred_asset: {
    type: SUT_PreferredAssetType;
    parameters: {
      collection?: string;
      rank?: SUI_RarityRankItem;
      preferred_currency?: SUI_SwapCurrencyItem[];
    };
  };
}

export interface SUI_SwapCurrencyItem {
  uuid: string;
  iconUrl: string;
  name: string;
  amount: string;
  usdAmount: string;
  symbol: string;
}
// Swap type ends here


// Swap api payload types starts here

export interface SUP_CreateOpenSwap extends Pick<
  SUI_OpenSwap,
  'init_address' | 'offer_type' | 'open_trade_id' | 'swap_preferences' | 'trading_chain' | 'swap_mode' | 'init_sign'> {
  metadata: {
    init: {
      tokens: SUI_SwapToken[];
    };
  };
}

export interface SUP_CompleteSwap extends Pick<SUI_OpenSwap, 'accept_sign' | 'accept_address' | 'id'> {
  status: number;
  tx: string;
  notes: string;
  timestamp: string;
}

export interface SUP_CancelSwap extends Pick<
  SUI_OpenSwap, 'swap_mode'> {
  open_trade_id?: string;
  trade_id?: string;
  sign_message: string;
}

export interface SUP_CounterSwap extends Pick<
  SUI_OpenSwap, 'metadata', 'init_sign', 'init_address', 'accept_address', 'id', 'trading_chain', 'offer_type', 'swap_mode'
> {
  open_trade_id?: string;
  trade_id?: string;
}

export interface SUP_RejectSwap {
  id: number;
  sign_message: string;
}
// Swap api payload types ends here

export interface SUI_SwapSignatureParams {
  signerAddress: string;
  initiatorAddress: string;
  responderAddress: string;
  initiatorAssets: SUI_SwapAsset[];
  responderAssets: SUI_SwapAsset[];
  signature: string;
  userSignMessage: string;
  tradeId: string;
  swapMode: SUT_SwapMode;
}

export interface SUI_CreateSwapThoughSmartContractApiPayload extends SUI_SwapSignatureParams { }

export interface SUI_CompleteSwapThoughSmartContractApiPayload extends SUI_SwapSignatureParams {
  swapAction: SUT_CompleteSwapActionType;
}

export interface SUI_CancelSwapThoughSmartContractApiPayload extends Pick<
  SUI_SwapSignatureParams, "signerAddress" | "initiatorAddress" | "responderAddress" | "initiatorAssets" | "responderAssets" | "signature" | "userSignMessage" | "swapMode"
> {
  tradeId?: string;
  openTradeId?: string;
}

export interface SUI_ProposeSwapThoughSmartContractApiPayload extends Pick<
  SUI_SwapSignatureParams, "signerAddress" | "initiatorAddress" | "responderAddress" | "initiatorAssets" | "responderAssets" | "signature" | "userSignMessage" | "tradeId"
> {
  openTradeId: string;
}


export interface SUI_CounterSwapThoughSmartContractApiPayload extends SUI_SwapSignatureParams { }