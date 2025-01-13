import { SUI_OpenSwap, SUI_Swap, SUI_SwapPreferences, SUT_SwapOfferType } from "@/types/swap-market.types";
import { SUI_CurrencyChainItem, INetwork, INFTItem, SUI_RarityRankItem, SUI_NFTItem, SUI_SelectedCollectionItem } from "@/types/global.types";
import { IProfile, IWallet } from "./profile.types";
import { SUT_RequestStatusType } from "./my-swaps-store.types";

export type SUT_GridViewType = 'detailed' | 'overview';
export type SUT_PrivateRoomLayoutType = "sender" | "receiver";
export type SUT_OpenMarketLayoutType = "sender" | "parameters";
export type SUT_MarketKeyType = "privateMarket" | "openMarket";
export type SUT_RoomKeyType = "privateRoom" | "openRoom";


//====OpenMarket Specific Types=====
export interface IOpenRoomFilterItem {
  collection: string;
  rarityRank: SUI_RarityRankItem;
}


export interface IOpenRoom {
  uniqueTradeId: string;
  sender: IOpenMarketLayoutSide;
  receiver: IOpenMarketLayoutSide;
  swap: SUI_OpenSwap;
  proposeSwap?: SUI_OpenSwap;
  swapEncodedMsg: string;
  sign: string;
  chainId: number;
  setValuesOnCreateOpenSwapRoom: (tradeId: string, senderProfile: IProfile) => void;
  setValuesOnProposeOpenSwapRoom: (tradeId: string, swap: SUI_OpenSwap, senderProfile: IProfile) => void;
  setValuesOnViewSwapRoom: (tradeId: string, swap: SUI_OpenSwap) => void;
  createOpenSwap: (initWalletAddress: string) => void;
  createProposeOpenSwap: (initWalletAddress: string) => void;
  setSwapEncodedMsgAndSign: (swapEncodedBytes: string, sign: string) => void;
  setSwapPreferences: (preferences: SUI_SwapPreferences) => void;
  resetOpenSwapCreationRoom: () => void;
  resetOpenSwapProposeRoom: () => void;
  resetViewSwapRoom: () => void;
  createCounterSwapOffer: () => void;
}

export interface IOpenMarketLayoutSide {
  activeGridView: SUT_GridViewType;
  toggleGridView: (value: SUT_GridViewType) => void;
  profile: IProfile;
  collections: string[] | [];
  addedAmount?: IAddedAmount;
  filters?: IOpenRoomFilterItem;
  nfts?: SUI_NFTItem[];
  filteredNfts?: SUI_NFTItem[];
  nftsSelectedForSwap: SUI_NFTItem[] | [];
  setSelectedNftsForSwap: (selectedNfts: SUI_NFTItem[] | []) => void;
  setFilteredNftsBySearch: (searchValue: string) => void;
  setFilteredNftsByFilters: (collectionTitle: string, selectedRarityRank: SUI_RarityRankItem) => void;
  setAddedAmount: (selectedAmount: string, selectedCoin: string) => void;
  setNftsDataset: (selectedNfts: SUI_NFTItem[]) => void;
  setFilteredNftsBySwapTokens: (selectedNfts: SUI_NFTItem[]) => void;
  removeAllFilters: () => void;
}
//====================================

export interface IOpenMarketSwapFilters {
  offersFromCurrentChain: boolean;
  preferredAsset: SUT_PreferredAssetType;
  amountRangeFrom?: number;
  amountRangeTo?: number;
  currencies?: SUI_SwapCurrencyItem[];
  offeredRarityRank?: SUI_RarityRankItem;
  collection?: string;
  rarityRank?: SUI_RarityRankItem;
}

export interface IOpenCreatedSwapFilters extends IOpenMarketSwapFilters { }

export interface IPrivateRoomFilterItem {
  collection: string;
  rarityRank: SUI_RarityRankItem;
}

export interface IAddedAmount {
  amount: number;
  coin: SUI_CurrencyChainItem;
}

export interface IPrivateMarketSwapFilters {
  offersFromCurrentChain: boolean;
  swapRequestStatus: SUT_RequestStatusType;
  dateRangeFrom?: string;
  dateRangeTo?: string;
}

export interface IPrivateRoomsLayoutSide {
  activeGridView: SUT_GridViewType;
  toggleGridView: (value: SUT_GridViewType) => void;
  profile: IProfile;
  collections: string[] | [];
  addedAmount?: IAddedAmount;
  filters?: IPrivateRoomFilterItem;
  nfts?: SUI_NFTItem[];
  filteredNfts?: SUI_NFTItem[];
  nftsSelectedForSwap: SUI_NFTItem[] | [];
  setSelectedNftsForSwap: (selectedNfts: SUI_NFTItem[] | []) => void;
  setFilteredNftsBySearch: (searchValue: string) => void;
  setFilteredNftsByFilters: (collectionTitle: string, selectedRarityRank: SUI_RarityRankItem) => void;
  setFilteredNftsBySwapTokens: (selectedNfts: SUI_NFTItem[]) => void;
  setAddedAmount: (selectedAmount: string, selectedCoin: string) => void;
  setNftsDataset: (selectedNfts: SUI_NFTItem[] | []) => void;
  removeAllFilters: (doNotRemoveSelectedNfts?: boolean) => void;
}

export interface IPrivateRoom {
  uniqueTradeId: string;
  sender: IPrivateRoomsLayoutSide;
  receiver: IPrivateRoomsLayoutSide;
  swap?: SUI_Swap;
  swapEncodedMsg: string;
  sign: string;
  chainId: number;
  setValuesOnCreatingPrivateRoom: (tradeId: string, counterPartyWalletAddress: string, senderProfile: IProfile) => void;
  createPrivateMarketSwap: (offer_type: SUT_SwapOfferType, initWalletAddress: string) => void;
  setSwapEncodedMsgAndSign: (swapEncodedBytes: string, sign: string) => void;
  resetPrivateRoom: () => void;
  setValuesOnViewSwapRoom: (tradeId: string, swap: SUI_Swap) => void;
  resetViewSwapRoom: () => void;
  createCounterSwapOffer: () => void;
}

export interface ISwapMarketStore {
  openMarket: {
    availableOpenSwaps?: SUI_OpenSwap[];
    availableOpenSwapCollections: SUI_SelectedCollectionItem[];
    availableOpenSwapsFiltersApplied: boolean;
    availableOpenSwapsSearchApplied: boolean;
    filteredAvailableOpenSwaps?: SUI_OpenSwap[];
    createdSwaps?: SUI_OpenSwap[];
    createdSwapCollections: SUI_SelectedCollectionItem[];
    createdSwapsFiltersApplied: boolean;
    createdSwapsSearchApplied: boolean;
    createdSwapsFilters: IOpenCreatedSwapFilters,
    filteredCreatedSwaps?: SUI_OpenSwap[];
    openRoom: IOpenRoom;
    openMarketSwapsFilters: IOpenMarketSwapFilters;
    setOpenSwapsData: (swapsData: SUI_OpenSwap[], wallet: IWallet) => void;
    setOpenCreatedSwapsData: (createdSwaps: SUI_OpenSwap[], wallet: IWallet) => void;
    setOpenCreatedSwapsBySearch: (searchValue: string) => void;
    setOpenCreatedSwapsByFilters: (filters: IOpenCreatedSwapFilters) => void;
    setOpenMarketAvailableSwapsBySearch: (searchValue: string) => void;
    setOpenMarketAvailableSwapsByFilters: (filters: IOpenMarketSwapFilters) => void;
    resetAllOpenMarketFilters: () => void;
    resetAllCreatedSwaps: () => void;
  },
  privateMarket: {
    availablePrivateSwaps?: SUI_Swap[];
    availablePrivateSwapsFiltersApplied: boolean;
    availablePrivateSwapsSearchApplied: boolean;
    filteredAvailablePrivateSwaps?: SUI_Swap[];
    privateRoom: IPrivateRoom;
    privateMarketSwapsFilters: IPrivateMarketSwapFilters;
    setPrivateSwapsData: (swapsData: SUI_Swap[]) => void;
    setPrivateMarketAvailableSwapsBySearch: (searchValue: string) => void;
    setPrivateMarketAvailableSwapsByFilters: (filters: IPrivateMarketSwapFilters, loginWalletAddress: string) => void;
    resetAllPrivateMarketFilters: () => void;
  };

}
