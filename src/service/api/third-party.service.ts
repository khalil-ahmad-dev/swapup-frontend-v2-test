import axios, { AxiosResponse } from "axios";
import { Environment } from "@/config";
import { currentChain } from "@/lib/thirdWebClient";
import API from "../Axios";

const coinRankingAPI = axios.create({
  baseURL: Environment.COIN_RANKING_BASE_URL,
  headers: { "Content-Type": "application/json", "x-access-token": Environment.COIN_RANKING_API_KEY },
});

coinRankingAPI.interceptors.response.use(
  response => response,
  error => {
    console.log(
      "Error in Response Interceptor:",
      JSON.stringify(error?.response || error?.message),
    );
    return Promise.reject(error);
  }
);

export const getCoinRankingCurrenciesApi = (params: Record<string, any> = {}): Promise<AxiosResponse> => {
  const defaultParams = {
    blockchains: ["ethereum"],
    limit: 100,
    orderBy: "price",
  };

  const mergedParams = { ...defaultParams, ...params };

  return coinRankingAPI.get(`/v2/coins`, { params: mergedParams });
};

export const getEthereumCurrencyTokenApi = (): Promise<AxiosResponse> => {
  return coinRankingAPI.get(`/v2/coins?blockchains[]=ethereum&uuids[]=razxDUgYGNAdQ&limit=100`);
};

// Opensea api
const openseaApi = axios.create({
  baseURL: Environment.OPENSEA_API_BASE_URL,
  headers: { accept: 'application/json', 'x-api-key': Environment.OPENSEA_API_KEY },
});

openseaApi.interceptors.response.use(
  response => response,
  error => {
    console.log(
      "Error in Response Interceptor:",
      JSON.stringify(error?.response || error?.message),
    );
    return Promise.reject(error);
  }
);

export const getAvailableCollectionsApi = (): Promise<AxiosResponse> => {
  const chain = Environment.NETWORK.replace("-", "_");
  return openseaApi.get(`/api/v2/collections?chain=${chain}`);
};


// Namespace APIs for Minting L1 subname --- Starts here
const namespaceApi = axios.create({
  baseURL: Environment.NAMESPACE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

namespaceApi.interceptors.response.use(
  response => response,
  error => {
    console.log(
      "Error in Response Interceptor:",
      JSON.stringify(error?.response || error?.message),
    );
    return Promise.reject(error);
  }
);

export const getSubnameListedOnL2Api = (): Promise<AxiosResponse> => {
  return namespaceApi.get(`/api/v1/nodes/?network=${currentChain.testnet ? "baseSepolia" : "base"}&parentName=${Environment.NAMESPACE_LISTED_ENS_NAME}&pageSize=1500`);
};
// Namespace APIs for Minting L1 subname --- Ends here



// Simple-hash APIs --- Starts here
const simaplehashApi = axios.create({
  baseURL: Environment.SIMPLEHASH_BASE_URL,
  headers: { "Content-Type": "application/json", "X-API-KEY": Environment.SIMPLEHASH_API_KEY },
});

simaplehashApi.interceptors.response.use(
  response => response,
  error => {
    console.log(
      "Error in Response Interceptor:",
      JSON.stringify(error?.response || error?.message),
    );
    return Promise.reject(error);
  }
);

export const getSimplehashTrendingNftCollectionsApi = (): Promise<AxiosResponse> => {
  return simaplehashApi.get(`/api/v0/nfts/collections/trending?chains=${currentChain.testnet ? "base-sepolia" : "base"}&limit=10&time_period=24h`);
};
// Simple-hash APIs --- Ends here