import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import FilterButton from '@/components/custom/shared/FilterButton';
import { cn, generateRandomKey, generateRandomTradeId, getLastCharacters, getShortenWalletAddress } from '@/lib/utils';
import EmptyDataset from '@/components/custom/shared/EmptyDataset';
import { SUI_OpenSwap, SUI_SwapToken, SUI_Swap, SUP_CompleteSwap, SUP_CancelSwap, SUP_RejectSwap } from '@/types/swap-market.types';
import { useCancelSwapOffer, useCompletePrivateSwapOffer, useRejectSwapOffer } from '@/service/queries/swap-market.query';

import { chainsDataset } from '@/constants/data';
import moment from 'moment';
import LoadingDataset from '@/components/custom/shared/LoadingDataset';
import { useSwapMarketStore } from '@/store/swap-market';
import CreatePrivateSwapDialog from "@/components/custom/swap-market/private-party/CreatePrivateSwapDialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { getWalletProxy } from '@/lib/walletProxy';
import { SUI_SwapCreation } from "@/types/global.types";
import { useCompleteOpenSwapOffer } from "@/service/queries/swap-market.query";

import { SUE_SWAP_COMPLETE_ACTION, SUE_SWAP_MODE, SUE_SWAP_OFFER_TYPE } from '@/constants/enums';
import { useProfileStore } from '@/store/profile';
import BadgeTile from '@/components/custom/tiles/BadgeTile';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { handleShowNotificationToast, mapSwapTokensHelper, showWalletConnectionToast } from '@/lib/helpers';
import PendingSwapsFilterDrawer from './PendingSwapsFilterDrawer';
import { useMySwapStore } from '@/store/my-swaps';
import { useQuery } from '@tanstack/react-query';
import { cancelSwapThroughSmartContractApi, completeSwapThroughSmartContractApi, getPendingSwapListApi } from '@/service/api';
import { useGlobalStore } from '@/store/global-store';
import { updatedUserProfilePointsApi } from '@/service/api/user.service';
import { defaults } from '@/constants/defaults';
import { SUI_UpdateProfilePointsPayload } from '@/types/profile.types';
import SwapListMobileCard from '../shared/SwapListMobileCard';
import { Schema_PendingMySwapsFiltersForm } from '@/schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IPendingFilters } from '@/types/my-swaps-store.types';
import PendingSwapsAppliedFiltersBar from './PendingSwapsAppliedFiltersBar';
import { Input } from '@/components/ui/input';
import SwapListItemActionPopover from '../shared/SwapListItemActionPopover';
import LoadingIcon from '../shared/LoadingIcon';


const PendingSwapsTabContent = () => {
  const navigate = useNavigate();

  const { wallet, ...userProfile } = useProfileStore(state => state.profile);
  // const state = useSwapMarketStore(state => state.privateMarket.privateRoom);

  const {
    setMySwapsData,
    filteredPendingSwaps,
    pendingSwaps,
    pendingSwapsFiltersApplied,
    pendingFilters,
    setFilteredPendingSwapByFilters,
    pendingSwapsSearchApplied,
    resetAllFilters,
    setFilteredMySwapsBySearch
  } = useMySwapStore(state => state);

  const [setStartRecentSwapSharingProcess, setRecentAcceptedSwap] = useGlobalStore(state => [state.setStartRecentSwapSharingProcess, state.setRecentAcceptedSwap]);

  const [swapAcceptance, setSwapAcceptance] = useState<SUI_SwapCreation>({ created: false, isLoading: false });
  const [swapRejection, setSwapRejection] = useState<SUI_SwapCreation>({ created: false, isLoading: false });
  const [swapCancel, setSwapCancel] = useState<SUI_SwapCreation>({ created: false, isLoading: false });

  const [searchParams] = useSearchParams();
  const walletIdToFilterSwaps = searchParams.get('walletIdToFilterSwaps');

  const { mutateAsync: completeOpenSwapOffer } = useCompleteOpenSwapOffer();
  const { mutateAsync: completePrivateSwapOffer } = useCompletePrivateSwapOffer();
  const { mutateAsync: rejectSwapOffer } = useRejectSwapOffer();
  const { mutateAsync: cancelSwapOffer } = useCancelSwapOffer();

  const handleSwapAccept = async (swap: SUI_Swap | SUI_OpenSwap) => {
    try {

      setSwapAcceptance(prev => ({ ...prev, isLoading: true }));

      const userSignMessage = (swap.swap_mode === SUE_SWAP_MODE.OPEN) ? defaults.userSignMessages.open.accept : defaults.userSignMessages.private.accept;
      const sign = await getWalletProxy().getUserSignature(swap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }
      //temp fix
      swap.accept_sign = sign;

      const approval = await getWalletProxy().getUserApproval(swap, false);

      if (!approval) {
        throw new Error("User approval not granted.");
      }

      const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(swap);

      const transactionRes = await completeSwapThroughSmartContractApi({
        signerAddress: wallet.address,
        initiatorAddress: swap.init_address,
        responderAddress: swap.accept_address,
        initiatorAssets: initAssets,
        responderAssets: acceptAssets,
        signature: sign,
        swapAction: SUE_SWAP_COMPLETE_ACTION.COMPLETE,
        swapMode: swap.swap_mode,
        tradeId: swap.trade_id,
        userSignMessage
      });

      console.log("transactionRes: ", transactionRes);

      const payload: SUP_CompleteSwap = {
        ...swap,
        status: transactionRes.status || 0,
        tx: transactionRes.data.transaction.transactionHash || "",
        notes: transactionRes.data.transaction.chain.id || "",
        timestamp: transactionRes.data.transaction.timestamp || "",
      };

      let offerResult;
      let pointsUpdateResult;
      //calling actual api 

      const pointsApiPayload: SUI_UpdateProfilePointsPayload = {
        pointsToAdd: swap.swap_mode === SUE_SWAP_MODE.OPEN ? defaults.pointSystem['completed-open-trade'] : defaults.pointSystem['completed-private-trade'],
        keyType: swap.swap_mode === SUE_SWAP_MODE.OPEN ? 'completed-open-trade' : 'completed-private-trade',
        walletId: swap.accept_address,
        counterPartyWalletId: swap.init_address,
        defaultPointSystem: defaults.userSettings.newUser.points
      };

      if (swap.swap_mode === SUE_SWAP_MODE.OPEN) {
        offerResult = await completeOpenSwapOffer(payload);
        pointsUpdateResult = await updatedUserProfilePointsApi(pointsApiPayload);
      }

      if (swap.swap_mode === SUE_SWAP_MODE.PRIVATE) {
        offerResult = await completePrivateSwapOffer(payload);
        pointsUpdateResult = await updatedUserProfilePointsApi(pointsApiPayload);
      }

      if (offerResult && pointsUpdateResult) {
        handleShowNotificationToast(
          "success",
          `${swap.swap_mode === SUE_SWAP_MODE.OPEN ? "Open" : "Private"} Swap Completed Successfully`,
          `You will receive a notification on metamask about the transaction.`
        );
        setSwapAcceptance(prev => ({ ...prev, created: true }));
        setStartRecentSwapSharingProcess(true);
        setRecentAcceptedSwap(swap);
        navigate("/swap-up/my-swaps/history");
      }

    } catch (error: any) {
      console.log("Accept swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
      // console.log(error);
    } finally {
      setSwapAcceptance(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSwapReject = async (swap: SUI_Swap | SUI_OpenSwap) => {
    try {
      setSwapRejection(prev => ({ ...prev, isLoading: true }));

      const userSignMessage = (swap.swap_mode === SUE_SWAP_MODE.OPEN) ? defaults.userSignMessages.open.reject : defaults.userSignMessages.private.reject;
      const sign = await getWalletProxy().getUserSignature(swap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }
      swap.accept_sign = sign;

      const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(swap);

      const transactionRes = await completeSwapThroughSmartContractApi({
        signerAddress: wallet.address,
        initiatorAddress: swap.init_address,
        responderAddress: swap.accept_address,
        initiatorAssets: initAssets,
        responderAssets: acceptAssets,
        signature: sign,
        swapAction: SUE_SWAP_COMPLETE_ACTION.REJECT,
        swapMode: swap.swap_mode,
        tradeId: swap.trade_id,
        userSignMessage
      });

      console.log("transactionRes: ", transactionRes);

      if (swap.id) {
        const payload: SUP_RejectSwap = {
          id: Number(swap.id),
          sign_message: sign ? sign : ''
        };
        const offerResult = await rejectSwapOffer(payload);
        // console.log(swap.id);
        if (offerResult) {
          handleShowNotificationToast(
            "success",
            `Swap Rejected Successfully`,
            `You have successfully rejected the swap offer`
          );
          setSwapRejection(prev => ({ ...prev, created: true }));
          navigate("/swap-up/my-swaps/history");
        }

      }

    } catch (error: any) {
      console.log("Reject swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setSwapRejection(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSwapCancel = async (swap: SUI_Swap | SUI_OpenSwap) => {
    try {
      setSwapCancel(prev => ({ ...prev, isLoading: true }));

      // Cancel swap blockchain logic
      const userSignMessage = (swap.swap_mode === SUE_SWAP_MODE.OPEN) ? defaults.userSignMessages.open.cancelProposal : defaults.userSignMessages.private.cancel;
      const sign = await getWalletProxy().getUserSignature(swap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }

      const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(swap);
      const transactionRes = await cancelSwapThroughSmartContractApi({
        signerAddress: wallet.address,
        initiatorAddress: swap.init_address,
        responderAddress: swap.accept_address,
        initiatorAssets: initAssets,
        responderAssets: acceptAssets,
        signature: sign,
        swapMode: swap.swap_mode,
        tradeId: swap.trade_id,
        userSignMessage
      });

      console.log("transactionRes: ", transactionRes);

      // enforcing swap mode to private because
      // 1.The original open swap can only be canceled through manage page
      // 2.The user can only cancel the private swap and single proposed open swap

      const payload: SUP_CancelSwap = {
        swap_mode: SUE_SWAP_MODE.PRIVATE,
        trade_id: swap.trade_id,
        open_trade_id: swap.swap_mode === SUE_SWAP_MODE.OPEN ? (swap as SUI_OpenSwap).open_trade_id : '',
        sign_message: sign
      };

      const offerResult = await cancelSwapOffer(payload);

      if (offerResult) {
        handleShowNotificationToast(
          "success",
          `Swap Closed Successfully`,
          `You have successfully closed the swap`
        );
        setSwapCancel(prev => ({ ...prev, created: true }));
        navigate("/swap-up/my-swaps/history");
      }

    } catch (error: any) {
      console.log("Cancel swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setSwapCancel(prev => ({ ...prev, isLoading: false }));
    }
  };

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: [`getPendingSwapListApi-key${wallet.address}`],
    queryFn: async () => {
      try {
        if (wallet.address && wallet.isConnected) {
          const response = await getPendingSwapListApi(wallet.address);
          let filteredResponse: SUI_OpenSwap[];

          if (walletIdToFilterSwaps) {
            filteredResponse = (response.data.data as SUI_OpenSwap[]).filter(swap =>
              (swap.swap_mode === SUE_SWAP_MODE.OPEN && (swap.init_address === walletIdToFilterSwaps || swap.accept_address === walletIdToFilterSwaps))
            );

          } else {
            filteredResponse = response.data.data as SUI_OpenSwap[];
          }

          await setMySwapsData(filteredResponse, 'pending');
          return response.data.data;
        }

        return null;
      } catch (error: any) {
        await setMySwapsData([], 'pending');
        handleShowNotificationToast(
          "error",
          `Request failed!`,
          `${error.message}`
        );
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    enabled: (wallet.address && wallet.isConnected) ? true : false
  });

  // Applied filters logic
  const [formKey, setFormKey] = useState(generateRandomKey(6));

  const pendingSwapsForm = useForm<z.infer<typeof Schema_PendingMySwapsFiltersForm>>({
    resolver: zodResolver(Schema_PendingMySwapsFiltersForm),
    defaultValues: {
      requestedDate: undefined,
      offersFromCurrentChain: false,
      swapMode: pendingFilters.swapMode || 'all',
      swapRequestStatus: pendingFilters.swapRequestStatus || 'all'
    }
  });

  const getPendingFiltersObjectByFormData = () => {
    const { offersFromCurrentChain, requestedDate, swapMode, swapRequestStatus } = pendingSwapsForm.getValues();

    const pendingFilters: IPendingFilters = {
      offersFromCurrentChain: offersFromCurrentChain ? offersFromCurrentChain : false,
      requestedDate: requestedDate ? moment.utc(requestedDate).format() : '',
      swapMode: swapMode ? swapMode : 'all',
      swapRequestStatus: swapRequestStatus ? swapRequestStatus : 'all'
    };

    return pendingFilters;
  };

  const handleResetAppliedFilters = (resetType: 'all' | 'swap-mode' | 'request-status' | 'current-chain' | "request-date") => {

    switch (resetType) {
      case 'all':
        pendingSwapsForm.reset();
        resetAllFilters('pending');
        break;

      case 'current-chain':
        pendingSwapsForm.setValue('offersFromCurrentChain', undefined);
        setFilteredPendingSwapByFilters(getPendingFiltersObjectByFormData(), wallet.address);
        break;

      case 'swap-mode':
        pendingSwapsForm.setValue('swapMode', 'all');
        setFilteredPendingSwapByFilters(getPendingFiltersObjectByFormData(), wallet.address);
        break;

      case 'request-status':
        pendingSwapsForm.setValue('swapRequestStatus', 'all');
        setFilteredPendingSwapByFilters(getPendingFiltersObjectByFormData(), wallet.address);
        break;

      case 'request-date':
        pendingSwapsForm.setValue('requestedDate', undefined);
        setFilteredPendingSwapByFilters(getPendingFiltersObjectByFormData(), wallet.address);
        break;

      default:
        break;
    }

    setFormKey(generateRandomKey(6));
  };

  const handleSwapsDataBySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setFilteredMySwapsBySearch(searchValue, 'pending', wallet.address);
  };

  return (
    <div className="space-y-4">

      {/* Available title and search bar for mobile */}
      <div className="lg:hidden flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between" >

        <div className="flex items-center gap-4" >
          <h2 className="text-1.5xl font-medium" >Available rooms</h2>
          <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${(filteredPendingSwaps || []).length > 0 ? 'bg-white text-su_primary_bg' : 'bg-muted'}`}>
            {(filteredPendingSwaps || []).length}
          </span>
        </div>

        <div className='w-full lg:w-1/3 flex items-center justify-between gap-2' >
          <Input
            className="w-full bg-su_enable_bg text-su_secondary !p-3.5 mr-1"
            placeholder="Search by NFT, trade ID, wallet, etc..."
            onChange={handleSwapsDataBySearch}
            icon={
              <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 14.6154L11.2277 9.84231C11.9968 8.78544 12.4105 7.5117 12.4092 6.20462C12.4092 2.78346 9.62577 0 6.20462 0C2.78346 0 0 2.78346 0 6.20462C0 9.62577 2.78346 12.4092 6.20462 12.4092C7.5117 12.4105 8.78544 11.9968 9.84231 11.2277L14.6154 16L16 14.6154ZM6.20462 10.4496C5.36493 10.4497 4.54407 10.2008 3.84586 9.7343C3.14765 9.26784 2.60345 8.60481 2.28208 7.82905C1.96071 7.05329 1.8766 6.19965 2.0404 5.37609C2.2042 4.55253 2.60854 3.79604 3.20229 3.20229C3.79604 2.60854 4.55253 2.2042 5.37609 2.0404C6.19965 1.8766 7.05329 1.96071 7.82905 2.28208C8.60481 2.60345 9.26784 3.14765 9.7343 3.84586C10.2008 4.54407 10.4497 5.36493 10.4496 6.20462C10.4483 7.33005 10.0006 8.40902 9.20482 9.20482C8.40902 10.0006 7.33005 10.4483 6.20462 10.4496Z" fill="#868691" />
              </svg>
            }
          />

          <div className='lg:hidden' >
            <PendingSwapsFilterDrawer
              handleResetAppliedFilters={handleResetAppliedFilters}
              pendingSwapsForm={pendingSwapsForm}
              setFormKey={setFormKey}
              formKey={formKey}
            >
              <FilterButton className='rounded-md' filterApplied={pendingSwapsFiltersApplied} />
            </PendingSwapsFilterDrawer>
          </div>
        </div>
      </div>

      {/*Mobile: Filler applied to open market data */}
      {pendingSwapsFiltersApplied &&
        <PendingSwapsAppliedFiltersBar
          className={`lg:hidden`}
          handleResetAppliedFilters={handleResetAppliedFilters}
          filters={pendingFilters}
        />
      }

      {/*Desktop: Available open swaps datalist */}
      <div className='hidden lg:block' >
        <ScrollArea className='min-w-full' >
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="align-top font-semibold min-w-[200px]">Assets</TableHead>
                <TableHead className="align-top font-semibold min-w-[150px] pl-4" >Unique trade ID</TableHead>
                <TableHead className="align-top font-semibold px-4" >Status</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[135px]" >Swap mode</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[130px] line-clamp-1 h-1" >Counter-party wallet address</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[150px]" >Trading chain</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[130px]" >Request date</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[150px]" >Type</TableHead>
                <TableHead className="min-w-[130px] pr-2 relative" >
                  <div className="absolute top-2 left-4">
                    <PendingSwapsFilterDrawer
                      handleResetAppliedFilters={handleResetAppliedFilters}
                      pendingSwapsForm={pendingSwapsForm}
                      setFormKey={setFormKey}
                      formKey={formKey}
                    >
                      <FilterButton showTitleOnMobile filterApplied={pendingSwapsFiltersApplied} />
                    </PendingSwapsFilterDrawer>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* For Filters Applied */}
            {pendingSwapsFiltersApplied &&
              <TableRow>
                <TableCell colSpan={9} >
                  <PendingSwapsAppliedFiltersBar
                    handleResetAppliedFilters={handleResetAppliedFilters}
                    filters={pendingFilters}
                  />
                </TableCell>
              </TableRow>
            }

            <TableBody className="divide-y">
              {
                filteredPendingSwaps?.map((swap) => {
                  const currentChain = chainsDataset.find(chain => chain.uuid === swap.trading_chain) || chainsDataset[1];
                  return (
                    <TableRow key={swap.trade_id}>
                      <TableCell className="text-xs font-medium flex items-center gap-2">

                        <div className='flex items-center gap-1'>
                          {mapSwapTokensHelper(swap.metadata.init.tokens, 2)}
                        </div>

                        <svg className="w-4" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.72844 0L12 4.15863H0.238525V3.0368H9.21836L6.91377 0.793135L7.72844 0ZM11.7615 5.84137V6.9632H2.78164L5.08623 9.20687L4.27156 10L0 5.84137H11.7615Z" fill="#868691" />
                        </svg>

                        <div className="flex items-center gap-1" >
                          {mapSwapTokensHelper(swap.metadata.accept.tokens, 2)}
                        </div>

                      </TableCell>
                      <TableCell className="text-xs font-medium pl-4">
                        # {swap.swap_mode === 0 ? getLastCharacters(swap.open_trade_id, 7) : getLastCharacters(swap.trade_id, 7)}
                      </TableCell>

                      <TableCell className="text-xs font-medium px-4">
                        {
                          (swap.init_address === wallet.address) ?
                            <BadgeTile>
                              <svg className="w-3" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                                <path d="M3.846 3.39353L3 2.64706L6 0L9 2.64706L8.154 3.39353L6.6 2.02765L6.6 7.14706H5.4L5.4 2.02765L3.846 3.39353Z" fill="white" />
                              </svg>

                              Sent
                            </BadgeTile>

                            :
                            <BadgeTile>
                              <svg className="w-3" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                                <path d="M3.846 3.75353L3 4.5L6 7.14706L9 4.5L8.154 3.75353L6.6 5.11941L6.6 4.62827e-08L5.4 0L5.4 5.11941L3.846 3.75353Z" fill="white" />
                              </svg>

                              Received
                            </BadgeTile>

                        }
                      </TableCell>

                      <TableCell className="text-xs font-medium px-4">
                        {swap.swap_mode === SUE_SWAP_MODE.OPEN ? <BadgeTile>Open market</BadgeTile> : <BadgeTile>private market</BadgeTile>}
                      </TableCell>
                      <TableCell className="text-xs font-medium px-4">
                        {
                          swap.init_address === wallet.address ?
                            <div className="w-auto flex justify-start" >{getShortenWalletAddress(swap.accept_address)}</div>
                            :
                            <div className="w-auto flex justify-start" >{getShortenWalletAddress(swap.init_address)}</div>
                        }
                      </TableCell>
                      <TableCell className="text-xs font-medium px-4" >
                        <BadgeTile>
                          <img
                            className='w-3 h-3'
                            src={currentChain.iconUrl}
                            alt=""
                          />

                          {currentChain.name}
                        </BadgeTile>
                      </TableCell>
                      <TableCell className="text-xs font-medium px-4">{moment.utc(swap.updated_at).format('MMM Do, YYYY')}</TableCell>
                      <TableCell className="text-xs font-medium px-4 capitalize">
                        {swap.offer_type === SUE_SWAP_OFFER_TYPE.PRIMARY ? <BadgeTile>Primary offer</BadgeTile> : <BadgeTile>Counter offer</BadgeTile>}
                      </TableCell>

                      <TableCell className="text-xs font-medium flex pr-8 justify-end">
                        {
                          (swapCancel.isLoading || swapRejection.isLoading || swapAcceptance.isLoading) ?
                            <LoadingIcon />
                            :
                            <SwapListItemActionPopover
                              swap={swap}
                              handleSwapAccept={handleSwapAccept}
                              handleSwapCancel={handleSwapCancel}
                              handleSwapReject={handleSwapReject}
                              swapCancel={swapCancel}
                              swapRejection={swapRejection}
                              swapAcceptance={swapAcceptance}
                            />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>

          {
            (((filteredPendingSwaps || []).length === 0) && (pendingSwapsFiltersApplied || pendingSwapsSearchApplied)) &&
            <EmptyDataset
              title="No Results Found"
              description="We couldn't find any results matching your search query. <br/>  Please try again with a different keyword or refine your search criteria."
              showBackgroundPicture={false}
            />
          }

          <ScrollBar orientation='horizontal' className='h-2' />
        </ScrollArea>
      </div>

      {/*Mobile: Available open swaps datalist */}
      <div className='flex flex-col gap-3 lg:hidden' >
        {filteredPendingSwaps?.map((swap, index) => (
          <SwapListMobileCard
            key={index}
            swap={swap}
            swapCardType='pending'
            handleSwapAccept={handleSwapAccept}
            handleSwapCancel={handleSwapCancel}
            handleSwapReject={handleSwapReject}
            swapCancel={swapCancel}
            swapRejection={swapRejection}
            swapAcceptance={swapAcceptance}
          />
        ))}

        {
          (((filteredPendingSwaps || []).length === 0) && (pendingSwapsFiltersApplied || pendingSwapsSearchApplied)) &&
          <EmptyDataset
            title="No Results Found"
            description="We couldn't find any results matching your search query. Please try again with a different keyword or refine your search criteria."
            showBackgroundPicture={false}
          />
        }
      </div>

      <LoadingDataset
        isLoading={isLoading}
        title="Loading pending swaps"
        description='pending swaps data is being loaded...'
      />

      {
        ((isSuccess || isError) && ((pendingSwaps || []).length === 0) && (!pendingSwapsSearchApplied && !pendingSwapsFiltersApplied)) &&
        <EmptyDataset
          title="No Pending Swaps Offers Yet"
          description="Your pending swap inbox is empty create your own swap!"
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="gradient-button px-5 py-3 gap-4">
              Create Swap

              <svg className={`w-4 rotate-180`} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L6 2L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="dark:bg-su_least_bg rounded-md min-w-full px-6 py-4 mt-1 flex flex-col gap-2 z-50">

              <div
                className="relative text-sm flex items-center gap-4 cursor-pointer hover:bg-su_enable_bg py-2 px-4 rounded-md"
                onClick={() => {
                  wallet.isConnected ? navigate(`/swap-up/swap-market/open-swap/create/${generateRandomTradeId()}`) : showWalletConnectionToast();
                }}
              >
                <svg className="w-5" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C8.61884 0 9.21233 0.25431 9.64992 0.706984C10.0875 1.15966 10.3333 1.77362 10.3333 2.41379C10.3333 3.05397 10.0875 3.66793 9.64992 4.1206C9.21233 4.57328 8.61884 4.82759 8 4.82759C7.38116 4.82759 6.78767 4.57328 6.35008 4.1206C5.9125 3.66793 5.66667 3.05397 5.66667 2.41379C5.66667 1.77362 5.9125 1.15966 6.35008 0.706984C6.78767 0.25431 7.38116 0 8 0ZM3.33333 1.72414C3.70667 1.72414 4.05333 1.82759 4.35333 2.01379C4.25333 3 4.53333 3.97931 5.10667 4.74483C4.77333 5.4069 4.10667 5.86207 3.33333 5.86207C2.8029 5.86207 2.29419 5.64409 1.91912 5.25608C1.54405 4.86808 1.33333 4.34183 1.33333 3.7931C1.33333 3.24438 1.54405 2.71813 1.91912 2.33012C2.29419 1.94212 2.8029 1.72414 3.33333 1.72414ZM12.6667 1.72414C13.1971 1.72414 13.7058 1.94212 14.0809 2.33012C14.456 2.71813 14.6667 3.24438 14.6667 3.7931C14.6667 4.34183 14.456 4.86808 14.0809 5.25608C13.7058 5.64409 13.1971 5.86207 12.6667 5.86207C11.8933 5.86207 11.2267 5.4069 10.8933 4.74483C11.4743 3.96843 11.7441 2.99046 11.6467 2.01379C11.9467 1.82759 12.2933 1.72414 12.6667 1.72414ZM3.66667 8.7931C3.66667 7.36552 5.60667 6.2069 8 6.2069C10.3933 6.2069 12.3333 7.36552 12.3333 8.7931V10H3.66667V8.7931ZM0 10V8.96552C0 8.0069 1.26 7.2 2.96667 6.96552C2.57333 7.43448 2.33333 8.08276 2.33333 8.7931V10H0ZM16 10H13.6667V8.7931C13.6667 8.08276 13.4267 7.43448 13.0333 6.96552C14.74 7.2 16 8.0069 16 8.96552V10Z" fill="#B6B6BD" />
                </svg>
                Open Market
              </div>

              <div className="group relative" >
                <CreatePrivateSwapDialog>
                  <div className="relative text-sm flex items-center gap-4 cursor-pointer group-hover:bg-su_enable_bg py-2 px-4 rounded-md">
                    <svg className="w-5" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5.05556L5.45455 2.52778L8 0L10.5455 2.52778L8 5.05556ZM0 13V10.1111C0 9.70185 0.142545 9.3588 0.427636 9.08194C0.712727 8.80509 1.05503 8.66667 1.45455 8.66667H3.83636C4.07879 8.66667 4.30909 8.72685 4.52727 8.84722C4.74545 8.96759 4.92121 9.13009 5.05454 9.33472C5.40606 9.80417 5.83951 10.1713 6.35491 10.4361C6.8703 10.7009 7.41867 10.8333 8 10.8333C8.59394 10.8333 9.14861 10.7009 9.664 10.4361C10.1794 10.1713 10.6065 9.80417 10.9455 9.33472C11.103 9.13009 11.288 8.96759 11.5004 8.84722C11.7127 8.72685 11.9338 8.66667 12.1636 8.66667H14.5455C14.9576 8.66667 15.303 8.80509 15.5818 9.08194C15.8606 9.3588 16 9.70185 16 10.1111V13H10.9091V11.3569C10.4848 11.6579 10.0272 11.8866 9.536 12.0431C9.04485 12.1995 8.53285 12.2778 8 12.2778C7.47879 12.2778 6.9697 12.1966 6.47273 12.0344C5.97576 11.8721 5.51515 11.6403 5.09091 11.3389V13H0ZM2.18182 7.94444C1.57576 7.94444 1.06061 7.7338 0.636364 7.3125C0.212121 6.8912 0 6.37963 0 5.77778C0 5.16389 0.212121 4.64943 0.636364 4.23439C1.06061 3.81935 1.57576 3.61159 2.18182 3.61111C2.8 3.61111 3.3183 3.81887 3.73673 4.23439C4.15515 4.64991 4.36412 5.16437 4.36364 5.77778C4.36364 6.37963 4.15467 6.8912 3.73673 7.3125C3.31879 7.7338 2.80048 7.94444 2.18182 7.94444ZM13.8182 7.94444C13.2121 7.94444 12.697 7.7338 12.2727 7.3125C11.8485 6.8912 11.6364 6.37963 11.6364 5.77778C11.6364 5.16389 11.8485 4.64943 12.2727 4.23439C12.697 3.81935 13.2121 3.61159 13.8182 3.61111C14.4364 3.61111 14.9547 3.81887 15.3731 4.23439C15.7915 4.64991 16.0005 5.16437 16 5.77778C16 6.37963 15.791 6.8912 15.3731 7.3125C14.9552 7.7338 14.4368 7.94444 13.8182 7.94444Z" fill="#B6B6BD" />
                    </svg>
                    Private Party
                  </div>
                </CreatePrivateSwapDialog>

                <span
                  className={`${wallet.isConnected ? "hidden" : "absolute"} cursor-pointer top-0 left-0 w-full h-full bg-transparent rounded-full`}
                  onClick={() => showWalletConnectionToast()}
                ></span>

              </div>

            </DropdownMenuContent>
          </DropdownMenu>

          <span
            className={`${wallet.isConnected ? "hidden" : "absolute"} cursor-pointer top-0 left-0 w-full h-full bg-transparent rounded-full`}
            onClick={() => showWalletConnectionToast()}
          ></span>

        </EmptyDataset>
      }
    </div >
  );
};

export default PendingSwapsTabContent;