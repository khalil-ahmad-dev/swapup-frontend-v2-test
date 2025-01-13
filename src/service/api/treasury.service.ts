import { SUI_TransferSubscriptionTokensToUserPayload } from "@/types/profile.types";
import API from "../Axios";
import { AxiosResponse } from "axios";

export const transferSubscriptionTokensToUserApi = (payload: SUI_TransferSubscriptionTokensToUserPayload): Promise<AxiosResponse> =>
  API.post(`/api/treasury/transfer/erc20`, payload);

export const treasurySmartWalletBalanceCheckApi = (): Promise<AxiosResponse> =>
  API.get(`/api/treasury/balance`);