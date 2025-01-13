import { AxiosResponse } from "axios";
import API from "../Axios";
import { SUI_Swap, SUI_OpenSwap, SUP_CreateOpenSwap, SUP_CompleteSwap, SUP_CancelSwap, SUP_CounterSwap, SUP_RejectSwap } from "@/types/swap-market.types";

export const getNftsForWalletApi = (walletId: string): Promise<AxiosResponse> => {
  return API.get(`/api/nfts/${walletId}`);
};

export const getPendingSwapsForWalletApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/swaps/pending/?address=${walletId}`);

export const getSwapHistoryForWalletApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/swaps/history/?address=${walletId}`);

export const getSwapDetailsByTradeOrOpenTradeIdApi = (tradeOrOpenTradeId: string): Promise<AxiosResponse> =>
  API.get(`/api/swaps/get-swap-details/${tradeOrOpenTradeId}`);

export const createPrivateSwapOfferApi = (swap: SUI_Swap): Promise<AxiosResponse> =>
  API.post('/api/swaps/', swap);

export const completePrivateSwapOfferApi = (swap: SUP_CompleteSwap): Promise<AxiosResponse> =>
  API.patch('/api/swaps/accept', swap);

export const counterSwapOfferApi = (payload: SUP_CounterSwap): Promise<AxiosResponse> =>
  API.patch('/api/swaps/counter-offer', payload);

export const getPrivateSwapPendingListApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/swaps/private-swaplist/?address=${walletId}`);

//for my swaps view
export const getPendingSwapListApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/swaps/pendingswaps/?address=${walletId}`);

export const getSwapHistoryListApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/swaps/swapshistory/?address=${walletId}`);

//open swap
export const getMyOpenSwapListApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/openswap/myopenswaps/?address=${walletId}`);

export const createOpenSwapOfferApi = (swap: SUP_CreateOpenSwap): Promise<AxiosResponse> =>
  API.post('/api/openswap/create', swap);

export const getOpenSwapPendingListApi = (): Promise<AxiosResponse> =>
  API.get(`/api/openswap/list`);

export const proposeSwapApi = (swap: SUI_OpenSwap): Promise<AxiosResponse> =>
  API.post(`/api/openswap/propose`, swap);

export const completeOpenSwapOfferApi = (swap: SUP_CompleteSwap): Promise<AxiosResponse> =>
  API.patch(`/api/openswap/accept`, swap);

export const rejectSwapOfferApi = (payload: SUP_RejectSwap): Promise<AxiosResponse> =>
  API.patch(`/api/openswap/reject-swap/?id=${payload.id}`, payload);

export const cancelSwapOfferApi = (cancelPayload: SUP_CancelSwap): Promise<AxiosResponse> =>
  API.patch(`/api/openswap/cancel`, cancelPayload);
