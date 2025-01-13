import { AxiosResponse } from "axios";
import API from "../Axios";
import { Environment } from "@/config";

export const getSubscriptionTokenApi = (): Promise<AxiosResponse> => {
  return API.get(`/api/manage/subscription-token?chainId=${Environment.CHAIN_ID}`);
};