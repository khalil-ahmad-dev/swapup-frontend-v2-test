import { useQuery } from "@tanstack/react-query";
import { getUserByWalletIdApi } from "../api/user.service";

export const useGetUserProfile = (walletId: string) => {
  return useQuery({
    queryKey: ['getUserByWalletIdApi', walletId],
    queryFn: async () => {
      try {
        const response = await getUserByWalletIdApi(walletId);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};