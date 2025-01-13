import { SUI_NewMember, SUI_TopTrader, SUI_TrendingCollection, SUI_TrendingToken, SUI_TrendingTokenPair } from "@/types/analytics.types";
import { ISwapMarketDetailsStore } from "@/types/swap-market-analytics-store.types";



export const setNewMembersDataHelper = (state: ISwapMarketDetailsStore, newMembers: SUI_NewMember[]): ISwapMarketDetailsStore => {
  return {
    ...state,
    newMembersData: newMembers
  };
};

export const setTopTradersDataHelper = (state: ISwapMarketDetailsStore, topTraders: SUI_TopTrader[]): ISwapMarketDetailsStore => {
  return {
    ...state,
    topTradersData: topTraders
  };
};

export const setTrendingTokenPairsHelper = (state: ISwapMarketDetailsStore, tokenPairs: SUI_TrendingTokenPair[]): ISwapMarketDetailsStore => {
  return {
    ...state,
    trendingTokenPairs: tokenPairs
  };
};

export const setTrendingTokensHelper = (state: ISwapMarketDetailsStore, tokens: SUI_TrendingToken[]): ISwapMarketDetailsStore => {
  return {
    ...state,
    trendingTokens: tokens
  };
};

export const setTrendingCollectionsHelper = (state: ISwapMarketDetailsStore, collections: SUI_TrendingCollection[]): ISwapMarketDetailsStore => {
  return {
    ...state,
    trendingCollections: collections
  };
};