import { AxiosResponse } from "axios";
import API from "../Axios";
import { SUI_CreateTweetOnBehalfOfUserReqParams, SUI_TwitterAuthCodeToAccessTokenReqParams } from "@/types/third-party.types";

export const getTwitterClientAccessTokenFromCodeApi = (payload: SUI_TwitterAuthCodeToAccessTokenReqParams): Promise<AxiosResponse> =>
  API.post(`/api/twitter/code-to-access-token`, payload);

export const postSwapOnTwitterOnBehalfOfCurrentUserApi = (payload: SUI_CreateTweetOnBehalfOfUserReqParams): Promise<AxiosResponse> =>
  API.post(`/api/twitter/create-post`, payload);