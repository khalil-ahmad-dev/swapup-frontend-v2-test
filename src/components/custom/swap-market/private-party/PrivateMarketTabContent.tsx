import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import FilterButton from '../../shared/FilterButton';

import EmptyDataset from '../../shared/EmptyDataset';
import { generateRandomKey, getLastCharacters, getShortenWalletAddress } from '@/lib/utils';
import { SUI_OpenSwap, SUI_Swap, SUP_CancelSwap, SUP_CompleteSwap, SUP_RejectSwap, } from '@/types/swap-market.types';
import { useCancelSwapOffer, useCompletePrivateSwapOffer, useRejectSwapOffer, } from '@/service/queries/swap-market.query';
import { chainsDataset } from '@/constants/data';
import moment from 'moment';
import LoadingDataset from '../../shared/LoadingDataset';
import { useSwapMarketStore } from '@/store/swap-market';
import CreatePrivateSwapDialog from "@/components/custom/swap-market/private-party/CreatePrivateSwapDialog";
import { generateRandomTradeId } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { getWalletProxy } from '@/lib/walletProxy';
import { SUI_SwapCreation } from '@/types/global.types';
import { useProfileStore } from '@/store/profile';
import { handleShowNotificationToast, mapSwapTokensHelper, showWalletConnectionToast } from '@/lib/helpers';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import PrivateMarketSwapFilterDrawer from './PrivateMarketSwapFilterDrawer';
import { useQuery } from '@tanstack/react-query';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cancelSwapThroughSmartContractApi, completeSwapThroughSmartContractApi, getPrivateSwapPendingListApi } from '@/service/api';
import { defaults } from '@/constants/defaults';
import { SUE_SWAP_COMPLETE_ACTION, SUE_SWAP_MODE } from '@/constants/enums';
import { useGlobalStore } from '@/store/global-store';
import { updatedUserProfilePointsApi } from '@/service/api/user.service';
import { SUI_UpdateProfilePointsPayload } from '@/types/profile.types';
import SwapListMobileCard from '../../shared/SwapListMobileCard';
import { IPrivateMarketSwapFilters } from '@/types/swap-market-store.types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Schema_PrivateMarketFiltersForm } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import PrivateMarketAppliedFiltersBar from './PrivateMarketAppliedFiltersBar';
import SwapListItemActionPopover from '../../shared/SwapListItemActionPopover';
import LoadingIcon from '../../shared/LoadingIcon';
import CreateNewSwapDropdown from '../../shared/CreateNewSwapDropdown';


const PrivateMarketTabContent = () => {
  const navigate = useNavigate();

  const {
    setPrivateSwapsData,
    availablePrivateSwaps,
    filteredAvailablePrivateSwaps,
    setPrivateMarketAvailableSwapsBySearch,
    availablePrivateSwapsFiltersApplied,
    availablePrivateSwapsSearchApplied,
    resetAllPrivateMarketFilters,
    setPrivateMarketAvailableSwapsByFilters,
    privateMarketSwapsFilters
  } = useSwapMarketStore(state => state.privateMarket);

  const [setStartRecentSwapSharingProcess, setRecentAcceptedSwap] = useGlobalStore(state => [state.setStartRecentSwapSharingProcess, state.setRecentAcceptedSwap]);
  const { wallet, ...userProfile } = useProfileStore(state => state.profile);

  const [formKey, setFormKey] = useState(generateRandomKey(6));

  const [swapAcceptance, setSwapAcceptance] = useState<SUI_SwapCreation>({ created: false, isLoading: false });
  const [swapRejection, setSwapRejection] = useState<SUI_SwapCreation>({ created: false, isLoading: false });
  const [swapCancel, setSwapCancel] = useState<SUI_SwapCreation>({ created: false, isLoading: false });

  const { mutateAsync: rejectSwapOffer } = useRejectSwapOffer();
  const { mutateAsync: completePrivateSwapOffer } = useCompletePrivateSwapOffer();
  const { mutateAsync: cancelSwapOffer } = useCancelSwapOffer();

  // private room store state
  // const state = useSwapMarketStore(state => state.privateMarket.privateRoom);

  const handlePrivateSwapFilterData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setPrivateMarketAvailableSwapsBySearch(value);
  };

  const handleSwapAccept = async (swap: SUI_Swap | SUI_OpenSwap) => {
    try {
      setSwapAcceptance(prev => ({ ...prev, isLoading: true }));

      const userSignMessage = defaults.userSignMessages.private.accept;
      const sign = await getWalletProxy().getUserSignature(swap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }

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

      const pointsApiPayload: SUI_UpdateProfilePointsPayload = {
        pointsToAdd: defaults.pointSystem['completed-private-trade'],
        walletId: swap.accept_address,
        counterPartyWalletId: swap.init_address,
        defaultPointSystem: defaults.userSettings.newUser.points,
        keyType: 'completed-private-trade'
      };

      //calling actual api 
      const offerResult = await completePrivateSwapOffer(payload);
      const pointsUpdateResult = await updatedUserProfilePointsApi(pointsApiPayload);

      if (offerResult && pointsUpdateResult) {
        handleShowNotificationToast(
          "success",
          `Private Swap Completed Successfully`,
          `You will receive a notification on metamask about the transaction.`
        );
        setSwapAcceptance(prev => ({ ...prev, created: true }));
        setStartRecentSwapSharingProcess(true);
        setRecentAcceptedSwap(swap);
        navigate(`${defaults.profile.baseRoute}/assets`);
      }
    } catch (error: any) {
      console.log("Accept swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setSwapAcceptance(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSwapCancel = async (swap: SUI_Swap | SUI_OpenSwap) => {
    try {

      setSwapCancel(prev => ({ ...prev, isLoading: true }));
      // Cancel swap blockchain logic
      const userSignMessage = defaults.userSignMessages.private.cancel;
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
        sign_message: sign
      };
      const offerResult = await cancelSwapOffer(payload);

      if (offerResult) {
        handleShowNotificationToast(
          "success",
          `Swap Closed Successfully`,
          `You have successfully closed the swap.`
        );
        setSwapCancel(prev => ({ ...prev, created: true }));
        navigate("/swap-up/my-swaps/history");
      }

    } catch (error: any) {
      console.log("cancel swap: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setSwapCancel(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSwapReject = async (swap: SUI_Swap | SUI_OpenSwap) => {
    try {
      setSwapRejection(prev => ({ ...prev, isLoading: true }));

      const userSignMessage = defaults.userSignMessages.private.reject;
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
          sign_message: sign
        };
        const offerResult = await rejectSwapOffer(payload);

        if (offerResult) {
          handleShowNotificationToast(
            "success",
            `Swap Rejected Successfully`,
            `You have successfully rejected the swap offer.`
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

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: [`getPrivateSwapPendingListApi-key${wallet.address}`],
    queryFn: async () => {
      try {
        if (wallet.address && wallet.isConnected) {
          const response = await getPrivateSwapPendingListApi(wallet.address);
          await setPrivateSwapsData(response.data.data as SUI_Swap[]);
          return response.data.data;
        }
        return null;

      } catch (error: any) {
        await setPrivateSwapsData([]);
        handleShowNotificationToast(
          "error",
          `Request failed!`,
          `${error.message}`
        );

        throw error;
      }
    },
    retry: false,
    enabled: (wallet.address && wallet.isConnected) ? true : false
  });

  // Private party filters logic
  const privatePartyForm = useForm<z.infer<typeof Schema_PrivateMarketFiltersForm>>({
    resolver: zodResolver(Schema_PrivateMarketFiltersForm),
    defaultValues: {
      offersFromCurrentChain: false,
      swapRequestStatus: 'all',
      dateRangeFrom: undefined,
      dateRangeTo: undefined
    }
  });

  const getFiltersObjectByFormData = () => {
    const { offersFromCurrentChain, dateRangeFrom, dateRangeTo, swapRequestStatus } = privatePartyForm.getValues();

    const newFilters: IPrivateMarketSwapFilters = {
      offersFromCurrentChain: offersFromCurrentChain ? offersFromCurrentChain : false,
      swapRequestStatus,
      dateRangeFrom: dateRangeFrom ? moment.utc(dateRangeFrom).format() : undefined,
      dateRangeTo: dateRangeTo ? moment.utc(dateRangeTo).format() : undefined
    };

    return (newFilters);
  };

  const handleResetAppliedFilters = (resetType: 'all' | 'date' | 'status' | 'current-chain') => {

    switch (resetType) {
      case 'all':
        resetAllPrivateMarketFilters();
        privatePartyForm.reset();
        break;

      case 'current-chain':
        privatePartyForm.setValue('offersFromCurrentChain', undefined);
        setPrivateMarketAvailableSwapsByFilters(getFiltersObjectByFormData(), wallet.address);
        break;

      case 'date':
        privatePartyForm.setValue('dateRangeFrom', undefined);
        privatePartyForm.setValue('dateRangeTo', undefined);
        setPrivateMarketAvailableSwapsByFilters(getFiltersObjectByFormData(), wallet.address);
        break;

      case 'status':
        privatePartyForm.setValue("swapRequestStatus", 'all');
        setPrivateMarketAvailableSwapsByFilters(getFiltersObjectByFormData(), wallet.address);
        break;

      default:
        break;
    }

    setFormKey(generateRandomKey(6));
  };

  return (
    <div className="space-y-4">

      {/* Available title and search bar */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between" >

        <div className="flex items-center gap-4" >
          <h2 className="text-1.5xl font-medium" >Available rooms</h2>
          <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${(filteredAvailablePrivateSwaps || []).length > 0 ? 'bg-white text-su_primary_bg' : 'bg-muted'}`}>
            {(filteredAvailablePrivateSwaps || []).length}
          </span>
        </div>

        <div className='w-full lg:w-1/3 flex items-center justify-between gap-2' >
          <Input
            className="w-full bg-su_enable_bg text-su_secondary !p-3.5 mr-1"
            placeholder="Search by NFT, trade ID, wallet, etc..."
            onChange={handlePrivateSwapFilterData}
            icon={
              <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 14.6154L11.2277 9.84231C11.9968 8.78544 12.4105 7.5117 12.4092 6.20462C12.4092 2.78346 9.62577 0 6.20462 0C2.78346 0 0 2.78346 0 6.20462C0 9.62577 2.78346 12.4092 6.20462 12.4092C7.5117 12.4105 8.78544 11.9968 9.84231 11.2277L14.6154 16L16 14.6154ZM6.20462 10.4496C5.36493 10.4497 4.54407 10.2008 3.84586 9.7343C3.14765 9.26784 2.60345 8.60481 2.28208 7.82905C1.96071 7.05329 1.8766 6.19965 2.0404 5.37609C2.2042 4.55253 2.60854 3.79604 3.20229 3.20229C3.79604 2.60854 4.55253 2.2042 5.37609 2.0404C6.19965 1.8766 7.05329 1.96071 7.82905 2.28208C8.60481 2.60345 9.26784 3.14765 9.7343 3.84586C10.2008 4.54407 10.4497 5.36493 10.4496 6.20462C10.4483 7.33005 10.0006 8.40902 9.20482 9.20482C8.40902 10.0006 7.33005 10.4483 6.20462 10.4496Z" fill="#868691" />
              </svg>
            }
          />

          <div className='lg:hidden' >
            <PrivateMarketSwapFilterDrawer
              privatePartyForm={privatePartyForm}
              formKey={formKey}
              setFormKey={setFormKey}
              handleResetAppliedFilters={handleResetAppliedFilters}
            >
              <FilterButton className='rounded-md' filterApplied={availablePrivateSwapsFiltersApplied} />
            </PrivateMarketSwapFilterDrawer>
          </div>
        </div>
      </div>

      {/*Mobile: Filler applied to open market data */}
      {availablePrivateSwapsFiltersApplied &&
        <PrivateMarketAppliedFiltersBar
          className={`lg:hidden`}
          handleResetAppliedFilters={handleResetAppliedFilters}
          filters={privateMarketSwapsFilters}
        />
      }

      {/*Desktop: Available open swaps datalist */}
      <div className='hidden lg:block' >
        <ScrollArea className='min-w-full' >
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="align-top font-semibold min-w-[200px]">Assets</TableHead>
                <TableHead className="align-top font-semibold min-w-[150px]" >Unique trade ID</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[130px]" >Status</TableHead>
                <TableHead className="align-top font-semibold px-4 line-clamp-1 h-1" >Counter-party wallet</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[130px]" >Trading chain</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[130px]" >Creation date</TableHead>
                <TableHead className="min-w-[100px] pr-2 relative" >
                  <PrivateMarketSwapFilterDrawer
                    privatePartyForm={privatePartyForm}
                    formKey={formKey}
                    setFormKey={setFormKey}
                    handleResetAppliedFilters={handleResetAppliedFilters}
                  >
                    <div className="absolute top-2 left-2">
                      <FilterButton showTitleOnMobile filterApplied={availablePrivateSwapsFiltersApplied} />
                    </div>
                  </PrivateMarketSwapFilterDrawer>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* For Filters Applied */}
            {availablePrivateSwapsFiltersApplied &&
              <TableRow>
                <TableCell colSpan={7} >
                  <PrivateMarketAppliedFiltersBar
                    handleResetAppliedFilters={handleResetAppliedFilters}
                    filters={privateMarketSwapsFilters}
                  />
                </TableCell>
              </TableRow>
            }

            <TableBody className="divide-y">
              {
                filteredAvailablePrivateSwaps?.map((swap) => {
                  const currentChain = chainsDataset.find(chain => chain.uuid === swap.trading_chain) || chainsDataset[1];

                  return (
                    <TableRow key={swap.trade_id}>
                      <TableCell className="text-xs font-medium flex items-center gap-2">
                        <div className="flex items-center gap-1" >
                          {mapSwapTokensHelper(swap.metadata.init.tokens, 3)}
                        </div>

                        <svg className="w-4" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.72844 0L12 4.15863H0.238525V3.0368H9.21836L6.91377 0.793135L7.72844 0ZM11.7615 5.84137V6.9632H2.78164L5.08623 9.20687L4.27156 10L0 5.84137H11.7615Z" fill="#868691" />
                        </svg>

                        <div className="flex items-center gap-1" >
                          {mapSwapTokensHelper(swap.metadata.accept.tokens, 3)}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">#{getLastCharacters(swap.trade_id, 7)}</TableCell>
                      <TableCell className="text-xs font-medium px-4">
                        <div className="w-auto flex justify-start" >{
                          swap.init_address === wallet.address ?
                            <span className="flex items-center justify-center gap-2 py-2 px-3  rounded-full bg-su_enable_bg capitalize" >
                              <svg className="w-4" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                                <path d="M3.846 3.39353L3 2.64706L6 0L9 2.64706L8.154 3.39353L6.6 2.02765L6.6 7.14706H5.4L5.4 2.02765L3.846 3.39353Z" fill="white" />
                              </svg>

                              Sent
                            </span>
                            :
                            <span className="flex items-center justify-center gap-2 p-2 rounded-full bg-su_enable_bg capitalize" >
                              <svg className="w-4" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                                <path d="M3.846 3.75353L3 4.5L6 7.14706L9 4.5L8.154 3.75353L6.6 5.11941L6.6 4.62827e-08L5.4 0L5.4 5.11941L3.846 3.75353Z" fill="white" />
                              </svg>

                              Received
                            </span>

                        }</div>
                      </TableCell>
                      <TableCell className="text-xs font-medium px-4">
                        {
                          swap.init_address === wallet.address ?
                            <div className="w-auto flex justify-start" >{getShortenWalletAddress(swap.accept_address)}</div>
                            :
                            <div className="w-auto flex justify-start" >{getShortenWalletAddress(swap.init_address)}</div>
                        }
                      </TableCell>
                      <TableCell className="text-xs font-medium px-4 flex justify-start">
                        <span
                          className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize"
                        >
                          <img
                            className='w-4 h-4'
                            src={currentChain.iconUrl}
                            alt=""
                          />

                          {currentChain.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-medium px-4">{moment.utc(swap.created_at).format('MMM DD, YYYY')}</TableCell>

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
            (((filteredAvailablePrivateSwaps || []).length === 0) && (availablePrivateSwapsSearchApplied || availablePrivateSwapsFiltersApplied)) &&
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
        {filteredAvailablePrivateSwaps?.map((swap, index) => (
          <SwapListMobileCard
            key={index}
            swap={swap}
            swapCardType='private-party'
            handleSwapAccept={handleSwapAccept}
            handleSwapCancel={handleSwapCancel}
            handleSwapReject={handleSwapReject}
            swapCancel={swapCancel}
            swapRejection={swapRejection}
            swapAcceptance={swapAcceptance}
          />
        ))}

        {
          (((filteredAvailablePrivateSwaps || []).length === 0) && (availablePrivateSwapsSearchApplied || availablePrivateSwapsFiltersApplied)) &&
          <EmptyDataset
            title="No Results Found"
            description="We couldn't find any results matching your search query. Please try again with a different keyword or refine your search criteria."
            showBackgroundPicture={false}
          />
        }
      </div>

      <LoadingDataset
        isLoading={isLoading}
        title="Loading open swaps"
        description='Open swaps data is being loaded...'
      />

      {
        ((isSuccess || isError) && ((availablePrivateSwaps || []).length === 0) && (!availablePrivateSwapsFiltersApplied && !availablePrivateSwapsSearchApplied)) &&
        <EmptyDataset
          title="No Private Party Swaps Available"
          description="Check back later or create your own swap!"
        >
          <CreateNewSwapDropdown />
        </EmptyDataset>
      }

    </div >
  );
};

export default PrivateMarketTabContent;