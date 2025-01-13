import { SUI_NewMember, SUI_TopTrader, SUI_TrendingCollection, SUI_TrendingToken, SUI_TrendingTokenPair } from "./analytics.types";


export interface ISwapMarketDetailsStore {
  newMembersData: SUI_NewMember[];
  topTradersData: SUI_TopTrader[];
  trendingTokenPairs: SUI_TrendingTokenPair[];
  trendingTokens: SUI_TrendingToken[];
  trendingCollections: SUI_TrendingCollection[];
  setTrendingTokenPairs: (tokenPairs: SUI_TrendingTokenPair[]) => void;
  setTrendingTokens: (tokens: SUI_TrendingToken[]) => void;
  setTrendingCollections: (collections: SUI_TrendingCollection[]) => void;
  setTopTradersData: (topTraders: SUI_TopTrader[]) => void;
  setNewMembersData: (newMembers: SUI_NewMember[]) => void;
}