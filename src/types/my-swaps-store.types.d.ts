import { SUI_OpenSwap } from "./swap-market.types";

export type SUT_RequestStatusType = "all" | "sent" | "received";
export type SUT_HistoryFiltersStatusType = "all" | "completed" | "declined" | "canceled";
export type SUT_FiltersSwapModeType = "all" | "open-market" | "private-party";
export type SUT_MySwapsTabType = "pending" | "history";

export interface IPendingFilters {
  offersFromCurrentChain: boolean;
  requestedDate: string;
  swapRequestStatus: SUT_RequestStatusType;
  swapMode: SUT_FiltersSwapModeType;
}

export interface IHistoryFilters extends Pick<IPendingFilters, 'offersFromCurrentChain' | 'swapMode' | 'requestedDate'> {
  swapStatus: SUT_HistoryFiltersStatusType;
}

export interface IMySwapsStore {
  pendingSwaps?: SUI_OpenSwap[];
  pendingSwapsFiltersApplied: boolean;
  pendingSwapsSearchApplied: boolean;
  filteredPendingSwaps?: SUI_OpenSwap[];
  historySwaps?: SUI_OpenSwap[];
  historySwapsFiltersApplied: boolean;
  historySwapsSearchApplied: boolean;
  filteredHistorySwaps?: SUI_OpenSwap[];
  pendingFilters: IPendingFilters;
  historyFilters: IHistoryFilters;
  setFilteredMySwapsBySearch: (searchValue: string, tabType: SUT_MySwapsTabType, loginWalletAddress: string) => void;
  setFilteredPendingSwapByFilters: (filters: IPendingFilters, loginWalletAddress: string) => void;
  setFilteredHistorySwapByFilters: (filters: IHistoryFilters) => void;
  resetAllFilters: (tabType: SUT_MySwapsTabType) => void;
  setMySwapsData: (data: SUI_OpenSwap[], tabType: SUT_MySwapsTabType) => void;
}