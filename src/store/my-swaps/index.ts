import { create } from 'zustand';
import { IHistoryFilters, IMySwapsStore, IPendingFilters, SUT_MySwapsTabType } from "@/types/my-swaps-store.types";
import { resetAllFiltersHelper, setFilteredHistorySwapByFiltersHelper, setFilteredMySwapsBySearchHelper, setFilteredPendingSwapByFiltersHelper, setMySwapsDataHelper } from './my-swaps-helpers';
import { SUI_OpenSwap } from '@/types/swap-market.types';

const initialState: IMySwapsStore = {
  pendingSwapsFiltersApplied: false,
  pendingSwapsSearchApplied: false,
  historySwapsFiltersApplied: false,
  historySwapsSearchApplied: false,
  pendingFilters: {
    offersFromCurrentChain: false,
    requestedDate: '',
    swapMode: 'all',
    swapRequestStatus: 'all'
  },
  historyFilters: {
    offersFromCurrentChain: false,
    requestedDate: '',
    swapMode: 'all',
    swapStatus: 'all'
  },
  setMySwapsData: () => { },
  setFilteredMySwapsBySearch: () => { },
  setFilteredPendingSwapByFilters: () => { },
  setFilteredHistorySwapByFilters: () => { },
  resetAllFilters: () => { },
};




export const useMySwapStore = create<IMySwapsStore>((set, get): IMySwapsStore => ({
  ...initialState,
  setMySwapsData: async (data: SUI_OpenSwap[], tabType: SUT_MySwapsTabType) => {
    const state = get();
    const newState = await setMySwapsDataHelper(state, data, tabType);
    set(newState);
  },
  setFilteredMySwapsBySearch: (searchValue: string, tabType: SUT_MySwapsTabType, loginWalletAddress: string) => set(state => setFilteredMySwapsBySearchHelper(state, searchValue, tabType, loginWalletAddress)),
  setFilteredPendingSwapByFilters: (filters: IPendingFilters, loginWalletAddress: string) => set(state => setFilteredPendingSwapByFiltersHelper(state, filters, loginWalletAddress)),
  setFilteredHistorySwapByFilters: (filters: IHistoryFilters) => set(state => setFilteredHistorySwapByFiltersHelper(state, filters)),
  resetAllFilters: (tabType: SUT_MySwapsTabType) => set(state => resetAllFiltersHelper(state, tabType)),
}));