import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FilterButton from '@/components/custom/shared/FilterButton';
import { cn, generateRandomKey, generateRandomTradeId, getDefaultNftImageOnError, getLastCharacters, getShortenWalletAddress } from '@/lib/utils';
import EmptyDataset from '@/components/custom/shared/EmptyDataset';
import { SUI_OpenSwap } from '@/types/swap-market.types';
import { chainsDataset } from '@/constants/data';
import moment from 'moment';
import LoadingDataset from '@/components/custom/shared/LoadingDataset';
import CreatePrivateSwapDialog from "@/components/custom/swap-market/private-party/CreatePrivateSwapDialog";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

import { useProfileStore } from '@/store/profile';
import SwapHistoryDetailsDialog from './SwapHistoryDetailsDialog';
import { SUE_SWAP_MODE, SUE_SWAP_STATUS, SUE_SWAP_STATUS_TO_STRING } from '@/constants/enums';
import BadgeTile from '@/components/custom/tiles/BadgeTile';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { handleShowNotificationToast, mapSwapTokensHelper, showWalletConnectionToast } from '@/lib/helpers';
import HistorySwapsFilterDrawer from './HistorySwapsFilterDrawer';
import { useMySwapStore } from '@/store/my-swaps';
import { useQuery } from '@tanstack/react-query';
import { getSwapHistoryListApi } from '@/service/api';
import SwapListMobileCard from '../shared/SwapListMobileCard';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IHistoryFilters } from '@/types/my-swaps-store.types';
import { Schema_HistoryMySwapsFiltersForm } from '@/schema';
import { Input } from '@/components/ui/input';
import HistorySwapAppliedFiltersBar from './HistorySwapAppliedFiltersBar';
import { SUI_SwapCreation } from '@/types/global.types';
import CreateNewSwapDropdown from '../shared/CreateNewSwapDropdown';


const SwapHistoryTabContent = () => {
  const navigate = useNavigate();

  const [swapAcceptance, setSwapAcceptance] = useState<SUI_SwapCreation>({ created: false, isLoading: false });

  const {
    setMySwapsData,
    filteredHistorySwaps,
    historySwaps,
    historyFilters,
    historySwapsFiltersApplied,
    historySwapsSearchApplied,
    setFilteredHistorySwapByFilters,
    resetAllFilters,
    setFilteredMySwapsBySearch
  } = useMySwapStore(state => state);

  const wallet = useProfileStore(state => state.profile.wallet);

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: [`getSwapHistoryListApi-key${wallet.address}`],
    queryFn: async () => {
      try {
        if (wallet.address && wallet.isConnected) {
          const response = await getSwapHistoryListApi(wallet.address);
          // console.log("Res: ", response.data.data);
          await setMySwapsData(response.data.data as SUI_OpenSwap[], 'history');
          return response.data.data;
        }

        return null;
      } catch (error: any) {
        await setMySwapsData([], 'history');
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

  const historySwapsForm = useForm<z.infer<typeof Schema_HistoryMySwapsFiltersForm>>({
    resolver: zodResolver(Schema_HistoryMySwapsFiltersForm),
    defaultValues: {
      requestedDate: undefined,
      offersFromCurrentChain: false,
      swapMode: historyFilters.swapMode || 'all',
      swapStatus: historyFilters.swapStatus || 'all'
    }
  });

  const getPendingFiltersObjectByFormData = () => {
    const { offersFromCurrentChain, requestedDate, swapMode, swapStatus } = historySwapsForm.getValues();

    const newHistoryFilters: IHistoryFilters = {
      offersFromCurrentChain: offersFromCurrentChain ? offersFromCurrentChain : false,
      requestedDate: requestedDate ? moment.utc(requestedDate).format() : '',
      swapMode: swapMode ? swapMode : 'all',
      swapStatus: swapStatus ? swapStatus : 'all'
    };

    return newHistoryFilters;
  };

  const handleResetAppliedFilters = (resetType: 'all' | 'swap-mode' | 'swap-status' | 'current-chain' | "request-date") => {

    switch (resetType) {
      case 'all':
        historySwapsForm.reset();
        resetAllFilters('history');
        break;

      case 'current-chain':
        historySwapsForm.setValue('offersFromCurrentChain', undefined);
        setFilteredHistorySwapByFilters(getPendingFiltersObjectByFormData());
        break;

      case 'swap-mode':
        historySwapsForm.setValue('swapMode', 'all');
        setFilteredHistorySwapByFilters(getPendingFiltersObjectByFormData());
        break;

      case 'swap-status':
        historySwapsForm.setValue('swapStatus', 'all');
        setFilteredHistorySwapByFilters(getPendingFiltersObjectByFormData());
        break;

      case 'request-date':
        historySwapsForm.setValue('requestedDate', undefined);
        setFilteredHistorySwapByFilters(getPendingFiltersObjectByFormData());
        break;

      default:
        break;
    }

    setFormKey(generateRandomKey(6));
  };

  const handleSwapsDataBySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setFilteredMySwapsBySearch(searchValue, 'history', wallet.address);
  };

  return (
    <div className="space-y-4 w-full">

      {/* Available title and search bar for mobile */}
      <div className="lg:hidden flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between" >

        <div className="flex items-center gap-4" >
          <h2 className="text-1.5xl font-medium" >Available rooms</h2>
          <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${(filteredHistorySwaps || []).length > 0 ? 'bg-white text-su_primary_bg' : 'bg-muted'}`}>
            {(filteredHistorySwaps || []).length}
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
            <HistorySwapsFilterDrawer
              formKey={formKey}
              setFormKey={setFormKey}
              historySwapsForm={historySwapsForm}
              handleResetAppliedFilters={handleResetAppliedFilters}
            >
              <FilterButton
                filterApplied={historySwapsFiltersApplied}
                className='rounded-md'
              />
            </HistorySwapsFilterDrawer>
          </div>
        </div>
      </div>

      {/*Mobile: Filler applied to open market data */}
      {historySwapsFiltersApplied &&
        <HistorySwapAppliedFiltersBar
          className={`lg:hidden`}
          handleResetAppliedFilters={handleResetAppliedFilters}
          filters={historyFilters}
        />
      }

      {/*Desktop: Available open swaps datalist */}
      <div className='hidden lg:block' >
        <ScrollArea className='min-w-full' >
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="align-top font-semibold min-w-[200px]">Assets</TableHead>
                <TableHead className="align-top font-semibold min-w-[150px] pl-8" >Unique trade ID</TableHead>
                <TableHead className="align-top font-semibold px-4 line-clamp-1 h-1" >Counter-party wallet address</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[135px]" >Swap mode</TableHead>
                <TableHead className="align-top font-semibold px-4 min-w-[135px]" >Trading chain</TableHead>
                <TableHead className="align-top font-semibold px-4 line-clamp-1 h-1 min-w-[135px]" >Offer review date</TableHead>
                <TableHead className="align-top font-semibold px-4" >Status</TableHead>
                <TableHead className="w-[130px] pr-2 relative" >
                  <div className="absolute top-2 left-4">
                    <HistorySwapsFilterDrawer
                      formKey={formKey}
                      setFormKey={setFormKey}
                      historySwapsForm={historySwapsForm}
                      handleResetAppliedFilters={handleResetAppliedFilters}
                    >
                      <FilterButton
                        showTitleOnMobile
                        filterApplied={historySwapsFiltersApplied}
                      />
                    </HistorySwapsFilterDrawer>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* For Filters Applied */}
            {historySwapsFiltersApplied &&
              <TableRow>
                <TableCell colSpan={9} >
                  <HistorySwapAppliedFiltersBar
                    handleResetAppliedFilters={handleResetAppliedFilters}
                    filters={historyFilters}
                  />
                </TableCell>
              </TableRow>
            }

            <TableBody className="divide-y">
              {
                filteredHistorySwaps?.map((swap) => {
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

                      <TableCell className="text-xs font-medium pl-8">
                        <div className="w-auto flex justify-start" >  #
                          {getLastCharacters(swap.trade_id, 7)}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-medium px-4">
                        {
                          swap.init_address === wallet.address ?
                            <div className="w-auto flex justify-start" >{getShortenWalletAddress(swap.accept_address)}</div>
                            :
                            <div className="w-auto flex justify-start" >{getShortenWalletAddress(swap.init_address)}</div>
                        }
                      </TableCell>

                      <TableCell className="text-xs font-medium px-4">
                        {swap.swap_mode === SUE_SWAP_MODE.OPEN ? <BadgeTile>Open market</BadgeTile> : <BadgeTile>private market</BadgeTile>}
                      </TableCell>

                      <TableCell className="text-xs font-medium px-4 ">
                        <BadgeTile>
                          <img
                            className='w-3 h-3'
                            src={currentChain.iconUrl}
                            alt=""
                          />

                          <span className='line-clamp-1' >{currentChain.name}</span>
                        </BadgeTile>
                      </TableCell>

                      <TableCell className="text-xs font-medium px-4">{moment.utc(swap.updated_at).format('MMM Do, YYYY')}</TableCell>

                      <TableCell className="text-xs font-medium px-4 capitalize">
                        <div className="w-auto flex items-center gap-2" >
                          <span
                            className={cn(
                              "rounded-full w-1.5 h-1.5 ",
                              swap.status === SUE_SWAP_STATUS.COMPLETED && "bg-su_positive",
                              swap.status === SUE_SWAP_STATUS.DECLINED && "bg-su_negative",
                              swap.status === SUE_SWAP_STATUS.CANCELED && "bg-su_negative",
                            )}
                          >
                          </span>

                          <span className='capitalize' >
                            {SUE_SWAP_STATUS_TO_STRING[`value${swap.status!}`]}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="pb-10 text-xs font-medium pr-3 lg:pr-14">
                        <div className="flex justify-end">
                          <SwapHistoryDetailsDialog swap={swap}>
                            <svg className='w-4' viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 3.3C7.42135 3.3 6.86639 3.53178 6.45722 3.94436C6.04805 4.35695 5.81818 4.91652 5.81818 5.5C5.81818 6.08348 6.04805 6.64306 6.45722 7.05564C6.86639 7.46822 7.42135 7.7 8 7.7C8.57865 7.7 9.13361 7.46822 9.54278 7.05564C9.95195 6.64306 10.1818 6.08348 10.1818 5.5C10.1818 4.91652 9.95195 4.35695 9.54278 3.94436C9.13361 3.53178 8.57865 3.3 8 3.3ZM8 9.16667C7.03558 9.16667 6.11065 8.78036 5.4287 8.09272C4.74675 7.40509 4.36364 6.47246 4.36364 5.5C4.36364 4.52754 4.74675 3.59491 5.4287 2.90728C6.11065 2.21964 7.03558 1.83333 8 1.83333C8.96442 1.83333 9.88935 2.21964 10.5713 2.90728C11.2532 3.59491 11.6364 4.52754 11.6364 5.5C11.6364 6.47246 11.2532 7.40509 10.5713 8.09272C9.88935 8.78036 8.96442 9.16667 8 9.16667ZM8 0C4.36364 0 1.25818 2.28067 0 5.5C1.25818 8.71933 4.36364 11 8 11C11.6364 11 14.7418 8.71933 16 5.5C14.7418 2.28067 11.6364 0 8 0Z" fill="#B6B6BD" />
                            </svg>
                          </SwapHistoryDetailsDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>

          {
            (((filteredHistorySwaps || []).length === 0) && (historySwapsSearchApplied || historySwapsFiltersApplied)) &&
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
        {filteredHistorySwaps?.map((swap, index) => (
          <SwapListMobileCard
            key={index}
            swap={swap}
            swapCardType='history'
            // just to avoid error could be improved later
            swapCancel={swapAcceptance}
            swapRejection={swapAcceptance}
            swapAcceptance={swapAcceptance}
          />
        ))}

        {
          (((filteredHistorySwaps || []).length === 0) && (historySwapsSearchApplied || historySwapsFiltersApplied)) &&
          <EmptyDataset
            title="No Results Found"
            description="We couldn't find any results matching your search query. Please try again with a different keyword or refine your search criteria."
            showBackgroundPicture={false}
          />
        }
      </div>

      <LoadingDataset
        isLoading={isLoading}
        title="Loading swaps history"
        description='swaps history data is being loaded...'
      />

      {
        ((isSuccess || isError) && ((historySwaps || []).length === 0) && (!historySwapsFiltersApplied && !historySwapsSearchApplied)) &&
        <EmptyDataset
          title="No Pending Swaps Offers Yet"
          description="Your pending swap inbox is empty create your own swap!"
        >
          <CreateNewSwapDropdown />

        </EmptyDataset>
      }
    </div >
  );
};

export default SwapHistoryTabContent;