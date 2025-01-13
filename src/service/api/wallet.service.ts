import { AxiosResponse } from "axios";
import API from "../Axios";

export const getTokenBreakdownByWalletIdApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/wallet/token-breakdown/${walletId}`);

export const getSubscriptionTokenBalanceApi = (walletId: string): Promise<AxiosResponse> => {
  return API.get(`/api/wallet/subscription-token-balance/${walletId}`);
};

export const getCollectionsByWalletIdApi = (walletId: string): Promise<AxiosResponse> => {
  return API.get(`/api/nfts/collections/${walletId}`);
};
