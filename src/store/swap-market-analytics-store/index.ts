import { ISwapMarketDetailsStore } from "@/types/swap-market-analytics-store.types";
import { create } from "zustand";
import { setNewMembersDataHelper, setTopTradersDataHelper, setTrendingCollectionsHelper, setTrendingTokenPairsHelper, setTrendingTokensHelper } from "./swap-market-analytics-store-helpers";
import { SUI_NewMember, SUI_TopTrader, SUI_TrendingCollection, SUI_TrendingToken, SUI_TrendingTokenPair } from "@/types/analytics.types";


const initialState: ISwapMarketDetailsStore = {
  newMembersData: [],
  topTradersData: [],
  trendingTokenPairs: [],
  trendingTokens: [],
  trendingCollections: [],
  setTrendingTokenPairs: () => { },
  setTrendingTokens: () => { },
  setTopTradersData: () => { },
  setTrendingCollections: () => { },
  setNewMembersData: () => { }
};

export const useSwapMarketAnalyticsStore = create<ISwapMarketDetailsStore>((set, get) => ({
  ...initialState,
  setNewMembersData: (newMembers: SUI_NewMember[]) => set((state) => setNewMembersDataHelper(state, newMembers)),
  setTopTradersData: (topTraders: SUI_TopTrader[]) => set((state) => setTopTradersDataHelper(state, topTraders)),
  setTrendingTokenPairs: (tokenPairs: SUI_TrendingTokenPair[]) => set((state) => setTrendingTokenPairsHelper(state, tokenPairs)),
  setTrendingTokens: (tokens: SUI_TrendingToken[]) => set((state) => setTrendingTokensHelper(state, tokens)),
  setTrendingCollections: (collections: SUI_TrendingCollection[]) => set((state) => setTrendingCollectionsHelper(state, collections)),
}));
