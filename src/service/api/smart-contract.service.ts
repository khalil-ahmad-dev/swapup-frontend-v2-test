import { SUI_CancelSwapThoughSmartContractApiPayload, SUI_CompleteSwapThoughSmartContractApiPayload, SUI_CounterSwapThoughSmartContractApiPayload, SUI_CreateSwapThoughSmartContractApiPayload, SUI_ProposeSwapThoughSmartContractApiPayload } from "@/types/swap-market.types";
import API from "../Axios";
import { AxiosResponse } from "axios";

export const createSwapThroughSmartContractApi = (payload: SUI_CreateSwapThoughSmartContractApiPayload): Promise<AxiosResponse> =>
  API.post(`/api/smart-contract/create-swap/${payload.signerAddress}`, payload);

export const completeSwapThroughSmartContractApi = (payload: SUI_CompleteSwapThoughSmartContractApiPayload): Promise<AxiosResponse> =>
  API.post(`/api/smart-contract/complete-swap/${payload.signerAddress}`, payload);

export const cancelSwapThroughSmartContractApi = (payload: SUI_CancelSwapThoughSmartContractApiPayload): Promise<AxiosResponse> =>
  API.patch(`/api/smart-contract/cancel-swap/${payload.signerAddress}`, payload);

export const counterSwapThroughSmartContractApi = (payload: SUI_CounterSwapThoughSmartContractApiPayload): Promise<AxiosResponse> =>
  API.patch(`/api/smart-contract/counter-swap/${payload.signerAddress}`, payload);

export const proposeSwapThroughSmartContractApi = (payload: SUI_ProposeSwapThoughSmartContractApiPayload): Promise<AxiosResponse> =>
  API.post(`/api/smart-contract/propose-swap/${payload.signerAddress}`, payload);