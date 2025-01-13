import { AxiosResponse } from "axios";
import API from "../Axios";
import { SUI_CreateNewUserPayload, SUI_DeleteProfilePicturePayload, SUI_TransferSubscriptionTokensToTreasuryPayload, SUI_UpdateProfileDetailsPayload, SUI_UpdateProfilePointsPayload, SUI_UploadProfilePicturePayload } from "@/types/profile.types";

export const createUserByWalletIdApi = (walletId: string, payload: SUI_CreateNewUserPayload): Promise<AxiosResponse> =>
  API.post(`/api/user/create/${walletId}`, payload);

export const createUserPlatformWalletApi = (walletId: string): Promise<AxiosResponse> =>
  API.post(`/api/user/create-platform-wallet/${walletId}`);

export const getUserByWalletIdApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/user/${walletId}`);

export const getUserTwitterAccessApi = (walletId: string): Promise<AxiosResponse> =>
  API.get(`/api/user/twitter-access/${walletId}`);

export const uploadProfilePictureApi = (payload: SUI_UploadProfilePicturePayload): Promise<AxiosResponse> => {

  const formData = new FormData();

  formData.append('file', payload.file);
  formData.append('pictureType', payload.pictureType);
  formData.append('walletId', payload.walletId);

  // Send multipart/form-data request
  return API.post('/api/user/upload-profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProfilePictureApi = (payload: SUI_DeleteProfilePicturePayload): Promise<AxiosResponse> =>
  API.patch(`/api/user/delete-profile-picture`, payload);

export const updatedUserProfilePointsApi = (payload: SUI_UpdateProfilePointsPayload): Promise<AxiosResponse> =>
  API.patch(`/api/user/update-points/${payload.walletId}`, payload);

export const updatedUserProfileDetailsApi = (payload: SUI_UpdateProfileDetailsPayload): Promise<AxiosResponse> =>
  API.patch(`/api/user/updated-profile-details/${payload.walletId}`, payload);