import { Environment } from "@/config";
import { SUE_CHAIN_ID } from "@/constants/enums";
import { currentChain } from "@/lib/thirdWebClient";
import { handleTwitterSharingProcessLocalstorageState } from "@/lib/utils";
import { IGlobalStore } from "@/types/global-store.types";
import { SUI_CollectionItem, SUI_CurrencyChainItem, SUI_SubscriptionToken } from "@/types/global.types";
import { SUI_OpenSwap, SUI_Swap } from "@/types/swap-market.types";
import { SUI_NamespaceListedSubnameItem } from "@/types/third-party.types";


export const setAvailableCurrenciesHelper = (state: IGlobalStore, currenciesData: SUI_CurrencyChainItem[]): IGlobalStore => {



  // We might need to add our platform token on base mainnet aseel
  const swapupDemoChain: SUI_CurrencyChainItem = {
    "uuid": "swapup-demo",
    "symbol": "SWP",
    "name": "Swapup Demo",
    "color": "#22a079",
    "iconUrl": "https://www.swapup.io/assets/logos/swapup-icon-gradient.svg",
    "marketCap": "115217077712",
    "price": "2",
    "listedAt": 1420600,
    "tier": 1,
    "change": "0.05",
    "rank": 3,
    "sparkline": [
      "1.0013893068803361",
      "1.000970861576145",
    ],
    "lowVolume": false,
    "coinrankingUrl": "https://coinranking.com/coin/HIVsRcGKkPFtW+tetherusd-usdt",
    "24hVolume": "56513273955",
    "btcPrice": "0.000017515470706104",
    "contractAddresses": [
      `${(currentChain.id || Environment.CHAIN_ID) === SUE_CHAIN_ID.BASE ? "base" : "ethereum"}/0x69A80fc0AEEADAb709ac0e939E94d195D98579eb`,
    ]
  };

  const computedCurrencies = (currentChain.id || Environment.CHAIN_ID) === SUE_CHAIN_ID.BASE_SEPOLIA ? [swapupDemoChain, ...currenciesData] : currenciesData;

  const allFilteredCurrenciesWithoutMainnet = computedCurrencies.filter(currency => currency.symbol !== "ETH");

  return {
    ...state,
    availableCurrencies: computedCurrencies.length > 0 ? computedCurrencies : [],
    filteredAvailableCurrencies: allFilteredCurrenciesWithoutMainnet
  };
};

export const setAvailableCollectionsHelper = (state: IGlobalStore, collectionsData: SUI_CollectionItem[]): IGlobalStore => {

  return {
    ...state,
    availableCollections: collectionsData.length > 0 ? collectionsData : []
  };
};

export const setRecentAcceptedSwapHelper = (state: IGlobalStore, swap: SUI_OpenSwap | SUI_Swap): IGlobalStore => {
  return {
    ...state,
    recentAcceptedSwap: swap
  };
};

export const setStartRecentSwapSharingProcessHelper = (state: IGlobalStore, isOpen: boolean): IGlobalStore => {

  if (!isOpen) {
    handleTwitterSharingProcessLocalstorageState('REMOVE');
  }

  return {
    ...state,
    startRecentSwapSharingProcess: isOpen
  };
};

export const setSubscriptionTokenHelper = (state: IGlobalStore, subscriptionToken: SUI_SubscriptionToken): IGlobalStore => {
  return {
    ...state,
    subscriptionToken
  };
};

export const setAllSubnamesMintedOnL2SwapupEnsHelper = (state: IGlobalStore, subnamesData: SUI_NamespaceListedSubnameItem[]): IGlobalStore => {
  return {
    ...state,
    allSubnamesMintedOnL2SwapupEns: subnamesData
  };
};