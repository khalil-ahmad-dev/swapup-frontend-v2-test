import { AxiosResponse } from "axios";
import API from "../Axios";
import { currentChain } from "@/lib/thirdWebClient";
import { Environment } from "@/config";

export const getCurrenciesByChainIdApi = (chainId: number = (currentChain.id || Environment.CHAIN_ID)): Promise<AxiosResponse> =>
  API.get(`/api/currencies/${chainId}`);
