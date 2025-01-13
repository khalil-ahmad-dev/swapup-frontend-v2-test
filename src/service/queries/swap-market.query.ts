import { useMutation, useQuery } from "@tanstack/react-query";

import { SUI_OpenSwap, SUI_Swap, SUP_CreateOpenSwap, SUP_CompleteSwap, SUP_CancelSwap, SUP_CounterSwap, SUP_RejectSwap } from "@/types/swap-market.types";
import {
  createOpenSwapOfferApi,
  createPrivateSwapOfferApi,
  getNftsForWalletApi,
  getPendingSwapsForWalletApi,
  getSwapHistoryForWalletApi,
  completeOpenSwapOfferApi,
  proposeSwapApi,
  getSwapDetailsByTradeOrOpenTradeIdApi,
  completePrivateSwapOfferApi,
  rejectSwapOfferApi,
  cancelSwapOfferApi,
  counterSwapOfferApi
} from "../api";


export const getWalletSwapHistory = (walletId: string) => {
  return useQuery({
    queryKey: ['getSwapHistoryForWalletApi', walletId],
    queryFn: async () => {
      try {
        const response = await getSwapHistoryForWalletApi(walletId);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const getWalletPendingSwaps = (walletId: string) => {
  return useQuery({
    queryKey: ['getPendingSwapsForWalletApi', walletId],
    queryFn: async () => {
      try {
        const response = await getPendingSwapsForWalletApi(walletId);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useNFTsByWallet = (walletId: string) => {
  return useQuery({
    queryKey: ['getNftsForWallet', walletId],
    queryFn: async () => {
      try {
        const response = await getNftsForWalletApi(walletId);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};

export const useCreatePrivateSwapOffer = () => {
  return useMutation({
    mutationFn: async (swap: SUI_Swap) => {
      try {
        const response = await createPrivateSwapOfferApi(swap);
        return response;
      } catch (error) {
        console.error("Failed to create swap offer:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during mutation:", error);
    },
    onSuccess: (data) => {
      console.log("Swap offer created successfully:", data);
    },
  });
};

export const useCompleteOpenSwapOffer = () => {
  return useMutation({
    mutationFn: async (swap: SUP_CompleteSwap) => {
      try {
        const response = await completeOpenSwapOfferApi(swap);
        return response;
      } catch (error) {
        console.error("Failed to complete open swap:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during mutation:", error);
    },
    onSuccess: (data) => {
      console.log("Open Swap completed successfully:", data);
    },
  });
};


export const useRejectSwapOffer = () => {
  return useMutation({
    mutationFn: async (payload: SUP_RejectSwap) => {
      try {
        const response = await rejectSwapOfferApi(payload);
        return response;
      } catch (error) {
        console.error("Failed to reject swap:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during mutation:", error);
    },
    onSuccess: (data) => {
      console.log("Reject Swap completed successfully:", data);
    },
  });
};


export const useCancelSwapOffer = () => {
  return useMutation({
    mutationFn: async (cancelPayload: SUP_CancelSwap) => {
      try {
        const response = await cancelSwapOfferApi(cancelPayload);
        return response;
      } catch (error) {
        console.error("Failed to cancel swap:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during mutation:", error);
    },
    onSuccess: (data) => {
      console.log("Swap Cancel completed successfully:", data);
    },
  });
};

export const useCompletePrivateSwapOffer = () => {
  return useMutation({
    mutationFn: async (swap: SUP_CompleteSwap) => {
      try {
        const response = await completePrivateSwapOfferApi(swap);
        return response;
      } catch (error) {
        console.error("Failed to complete private swap:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during mutation:", error);
    },
    onSuccess: (data) => {
      console.log("Private Swap completed successfully:", data);
    },
  });
};
export const useGetSwapDetails = (tradeId: string) => {
  return useQuery({
    queryKey: ['getSwapDetailsByTradeOrOpenTradeIdApi', tradeId],
    queryFn: async () => {
      try {
        const response = await getSwapDetailsByTradeOrOpenTradeIdApi(tradeId);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
};

// Open Market queries
export const useCreateOpenSwapOffer = () => {
  return useMutation({
    mutationFn: async (swap: SUP_CreateOpenSwap) => {
      try {
        const response = await createOpenSwapOfferApi(swap);
        return response;
      } catch (error) {
        console.error("Failed to create swap offer:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during mutation:", error);
    },
    onSuccess: (data) => {
      console.log("Swap offer created successfully:", data);
    },
  });
};

export const useProposeOpenSwapOffer = () => {
  return useMutation({
    mutationFn: async (swap: SUI_OpenSwap) => {
      try {
        const response = await proposeSwapApi(swap);
        return response;
      } catch (error) {
        console.error("Failed to propose swap offer:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during propose open swap:", error);
    },
    onSuccess: (data) => {
      console.log("Swap offer proposed successfully:", data);
    },
  });
};


export const useCounterSwapOffer = () => {
  return useMutation({
    mutationFn: async (payload: SUP_CounterSwap) => {
      try {
        const response = await counterSwapOfferApi(payload);
        return response;
      } catch (error) {
        console.error("Failed to create counter swap offer:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Error occurred during mutation:", error);
    },
    onSuccess: (data) => {
      console.log("Swap counter offer created successfully:", data);
    },
  });
};
