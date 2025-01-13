export type SUT_SwapupEnvironmentKey = "local" | "development" | "staging" | "production";
export type SUT_SwapupEnvironmentId = 1 | 2 | 3 | 4;

export interface SUI_ConfigEnvironment {
  ENVIRONMENT_KEY: string;
  ENVIRONMENT_ID: SUT_SwapupEnvironmentId;
  API_BASE_URL: string;
  BLOCKSCOUT_BASE_URL: string;
  OPENSEA_API_BASE_URL: string;
  OPENSEA_API_KEY: string;
  BASESCAN_BASE_URL: string;
  NETWORK: string;
  CHAIN_ID: number;
  SWAPUP_CONTRACT: string;
  THIRDWEB_CLIENT_ID: string;
  COIN_RANKING_API_KEY: string;
  COIN_RANKING_BASE_URL: string;
  NAMESPACE_LISTED_ENS_NAME: string;
  NAMESPACE_API_KEY: string;
  SIMPLEHASH_BASE_URL: string;
  SIMPLEHASH_API_KEY: string;
  NAMESPACE_API_BASE_URL: string;
  TWITTER_CLIENT_ID: string;
  WARPCAST_FRAME_BASE_URL: string;
  SWAPUP_TREASURY_WALLET: string;
  NEW_SUBNAME_CHARGES: number;
}
export interface SUI_Config {
  local: SUI_ConfigEnvironment;
  development: SUI_ConfigEnvironment;
  staging: SUI_ConfigEnvironment;
  production: SUI_ConfigEnvironment;
}