import { SUI_CollectionItem, SUI_CurrencyChainItem, SUI_SubscriptionToken } from "./global.types";
import { SUI_OpenSwap, SUI_Swap } from "./swap-market.types";
import { SUI_NamespaceListedSubnameItem } from "./third-party.types";

export interface IGlobalStore {
  subscriptionToken?: SUI_SubscriptionToken;
  availableCurrencies: SUI_CurrencyChainItem[];
  filteredAvailableCurrencies: SUI_CurrencyChainItem[];
  availableCollections: SUI_CollectionItem[];
  allSubnamesMintedOnL2SwapupEns: SUI_NamespaceListedSubnameItem[];
  recentAcceptedSwap?: SUI_OpenSwap | SUI_Swap;
  startRecentSwapSharingProcess: boolean;
  setAvailableCurrencies: (currenciesData: SUI_CurrencyChainItem[]) => void;
  setAvailableCollections: (collectionsData: SUI_CollectionItem[]) => void;
  setAllSubnamesMintedOnL2SwapupEns: (subnamesData: SUI_NamespaceListedSubnameItem[]) => void;
  setRecentAcceptedSwap: (swap: SUI_OpenSwap | SUI_Swap) => void;
  setStartRecentSwapSharingProcess: (isOpen: boolean) => void;
  setSubscriptionToken: (subscriptionToken: SUI_SubscriptionToken) => void;
}