import { AxiosResponse } from "axios";
import API from "../Axios";


export const getNewMembersApi = (): Promise<AxiosResponse> =>
  API.get(`/api/analytics/new-members`);

export const getTopTradersApi = (): Promise<AxiosResponse> =>
  API.get(`/api/analytics/top-traders`);

export const getTrendingTokenPairsApi = (): Promise<AxiosResponse> =>
  API.get(`/api/analytics/trending-token-pairs`);

export const getTrendingTokensApi = (): Promise<AxiosResponse> =>
  API.get(`/api/analytics/trending-tokens`);