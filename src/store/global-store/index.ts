import { IGlobalStore } from "@/types/global-store.types";
import { SUI_CollectionItem, SUI_CurrencyChainItem, SUI_SubscriptionToken } from "@/types/global.types";
import { create } from "zustand";
import { setAllSubnamesMintedOnL2SwapupEnsHelper, setAvailableCollectionsHelper, setAvailableCurrenciesHelper, setRecentAcceptedSwapHelper, setStartRecentSwapSharingProcessHelper, setSubscriptionTokenHelper } from "./global-store-helpers";
import { SUI_OpenSwap, SUI_Swap } from "@/types/swap-market.types";
import { SUI_NamespaceListedSubnameItem } from "@/types/third-party.types";


const initialState: IGlobalStore = {
  availableCurrencies: [],
  filteredAvailableCurrencies: [],
  availableCollections: [],
  allSubnamesMintedOnL2SwapupEns: [],
  startRecentSwapSharingProcess: false,
  setAvailableCurrencies: () => { },
  setAvailableCollections: () => { },
  setAllSubnamesMintedOnL2SwapupEns: () => { },
  setRecentAcceptedSwap: () => { },
  setStartRecentSwapSharingProcess: () => { },
  setSubscriptionToken: () => { }
};

export const useGlobalStore = create<IGlobalStore>((set, get) => ({
  ...initialState,
  setAvailableCurrencies: (currenciesData: SUI_CurrencyChainItem[]) => set(state => setAvailableCurrenciesHelper(state, currenciesData)),
  setAvailableCollections: (collectionsData: SUI_CollectionItem[]) => set(state => setAvailableCollectionsHelper(state, collectionsData)),
  setAllSubnamesMintedOnL2SwapupEns: (subnamesData: SUI_NamespaceListedSubnameItem[]) => set((state) => setAllSubnamesMintedOnL2SwapupEnsHelper(state, subnamesData)),
  setRecentAcceptedSwap: (swap: SUI_OpenSwap | SUI_Swap) => set(state => setRecentAcceptedSwapHelper(state, swap)),
  setStartRecentSwapSharingProcess: (isOpen: boolean) => set(state => setStartRecentSwapSharingProcessHelper(state, isOpen)),
  setSubscriptionToken: (subscriptionToken: SUI_SubscriptionToken) => set(state => setSubscriptionTokenHelper(state, subscriptionToken))
}));
