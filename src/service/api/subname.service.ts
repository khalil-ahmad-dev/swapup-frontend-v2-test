import { Axios, AxiosResponse } from "axios";
import API from "../Axios";
import { Address } from "thirdweb";
import { SUI_MintSubnamePayload } from "@/types/global.types";

export const mintNewSubnameOnL2Api = (payload: SUI_MintSubnamePayload): Promise<AxiosResponse> => {
  return API.post(`/api/subname/mint/${payload.minterAddress}`, payload);
};

export const getNewSubnameTransactionParamsApi = (minterAddress: Address, subnameLabel: string): Promise<AxiosResponse> => {
  return API.get(`/api/subname/mint-params`, { params: { minterAddress, subnameLabel } });
};