import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FilterButton from '../../shared/FilterButton';
import { Button } from '@/components/ui/button';
import EmptyDataset from '../../shared/EmptyDataset';
import { generateRandomKey, generateRandomTradeId, getLastCharacters, getShortenWalletAddress } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { SUI_OpenSwap } from '@/types/swap-market.types';
import { chainsDataset } from '@/constants/data';
import moment from 'moment';
import LoadingDataset from '../../shared/LoadingDataset';
import { useSwapMarketStore } from '@/store/swap-market';
import { useProfileStore } from '@/store/profile';
import { handleShowNotificationToast, mapSwapTokensHelper, showWalletConnectionToast } from '@/lib/helpers';
import OpenMarketSwapFilterDrawer from './OpenMarketSwapFilterDrawer';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { getOpenSwapPendingListApi } from '@/service/api';
import CreatedOpenSwapsCard from './CreatedOpenSwapsCard';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Schema_OpenMarketFiltersForm } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { IOpenMarketSwapFilters } from '@/types/swap-market-store.types';
import { useState } from 'react';
import OpenMarketAppliedFiltersBar from './OpenMarketAppliedFiltersBar';
import OpenSwapListMobileCard from './OpenSwapListMobileCard';

const OpenMarketTabContent = () => {
  const wallet = useProfileStore(state => state.profile.wallet);
  const navigate = useNavigate();

  const {
    setOpenSwapsData,
    setOpenMarketAvailableSwapsBySearch,
    createdSwaps,
    availableOpenSwaps,
    filteredAvailableOpenSwaps,
    availableOpenSwapsFiltersApplied,
    availableOpenSwapsSearchApplied,
    openMarketSwapsFilters,
    setOpenMarketAvailableSwapsByFilters,
    resetAllOpenMarketFilters,
    availableOpenSwapCollections
  } = useSwapMarketStore(state => state.openMarket);

  const handleFilterAvailableSwapsBySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setOpenMarketAvailableSwapsBySearch(value);
  };

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: [`getOpenSwapPendingList-key${wallet.address}`],
    queryFn: async () => {
      try {
        const response = await getOpenSwapPendingListApi();
        await setOpenSwapsData(response.data.data as SUI_OpenSwap[], wallet);
        // console.log(useSwapMarketStore.getState().openMarket.availableOpenSwaps);

        return response.data.data;
      } catch (error: any) {
        await setOpenSwapsData([], wallet);
        handleShowNotificationToast(
          "error",
          `Request failed!`,
          `${error.message}`
        );

        throw error;
      }
    },
    retry: false,
    enabled: true,
    staleTime: 0,
    refetchOnMount: true,
  });

  const handleNavigateToProposeRoom = (swap: SUI_OpenSwap) => {
    if (wallet.isConnected && wallet.address) {
      navigate(`/swap-up/swap-market/open-swap/propose/${swap.open_trade_id}/${generateRandomTradeId()}`);
    } else {
      showWalletConnectionToast("error", "Please connect to your wallet to propose swap.");
    }
  };

  // Open market filters logic
  const [formKey, setFormKey] = useState(generateRandomKey(6));

  const openMarketForm = useForm<z.infer<typeof Schema_OpenMarketFiltersForm>>({
    resolver: zodResolver(Schema_OpenMarketFiltersForm),
    defaultValues: {
      offersFromCurrentChain: false,
      preferredAsset: 'any',
      amountRangeFrom: '',
      amountRangeTo: '',
      currencies: undefined,
      offeredRarityRank: '',
      collection: '',
      rarityRank: ''
    }
  });

  const getFiltersObjectByFormValues = () => {
    const { offersFromCurrentChain, preferredAsset, amountRangeFrom, amountRangeTo, collection, currencies, offeredRarityRank, rarityRank } = openMarketForm.getValues();

    const newFilters: IOpenMarketSwapFilters = {
      offersFromCurrentChain: offersFromCurrentChain ? offersFromCurrentChain : false,
      offeredRarityRank: offeredRarityRank ? JSON.parse(offeredRarityRank) : undefined,
      preferredAsset,
      amountRangeFrom: amountRangeFrom ? Number(amountRangeFrom) : openMarketSwapsFilters.amountRangeFrom,
      amountRangeTo: amountRangeTo ? Number(amountRangeTo) : openMarketSwapsFilters.amountRangeTo,
      collection,
      currencies,
      rarityRank: rarityRank ? JSON.parse(rarityRank) : undefined
    };

    return (newFilters);
  };

  const handleResetAppliedFilters = (resetType: 'all' | 'currency' | 'nft' | 'current-chain' | 'offered-rarity-rank') => {

    switch (resetType) {
      case 'all':
        resetAllOpenMarketFilters();
        openMarketForm.reset();
        break;

      case 'current-chain':
        openMarketForm.setValue("offersFromCurrentChain", undefined);
        setOpenMarketAvailableSwapsByFilters(getFiltersObjectByFormValues());
        break;

      case 'nft':
        openMarketForm.setValue('preferredAsset', 'any');
        openMarketForm.setValue('collection', '');
        openMarketForm.setValue('rarityRank', '');
        setOpenMarketAvailableSwapsByFilters(getFiltersObjectByFormValues());
        break;

      case 'offered-rarity-rank':
        openMarketForm.setValue('offeredRarityRank', '');
        setOpenMarketAvailableSwapsByFilters(getFiltersObjectByFormValues());
        break;

      case 'currency':
        openMarketForm.setValue('preferredAsset', 'any');
        openMarketForm.setValue('amountRangeFrom', '');
        openMarketForm.setValue('amountRangeTo', '');
        openMarketForm.setValue('currencies', undefined);
        setOpenMarketAvailableSwapsByFilters(getFiltersObjectByFormValues());
        break;
      default:
        break;
    }

    setFormKey(generateRandomKey(6));
  };

  return (
    <section className="space-y-4 w-full">

      <header className="flex items-center justify-between" >
        <div className="flex items-center justify-between gap-4" >
          <h2 className="text-1.5xl font-medium" >Created</h2>
          <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${(createdSwaps || []).length > 0 ? 'bg-white text-su_primary_bg' : 'bg-muted'}`}>
            {(createdSwaps || []).length}
          </span>
        </div>

        {
          (createdSwaps || []).length > 0 &&
          <div
            className="flex items-center justify-between gap-4 py-2 px-3 rounded-sm cursor-pointer hover:bg-su_enable_bg"
            onClick={() => { wallet.isConnected ? navigate(`/swap-up/swap-market/open-market/manage-open-market`) : showWalletConnectionToast(); }}
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.35821 12L4.1194 10.08C3.99005 10.03 3.86826 9.97 3.75403 9.9C3.6398 9.83 3.52776 9.755 3.41791 9.675L1.64179 10.425L0 7.575L1.53731 6.405C1.52736 6.335 1.52239 6.2676 1.52239 6.2028V5.7978C1.52239 5.7326 1.52736 5.665 1.53731 5.595L0 4.425L1.64179 1.575L3.41791 2.325C3.52736 2.245 3.64179 2.17 3.76119 2.1C3.8806 2.03 4 1.97 4.1194 1.92L4.35821 0H7.64179L7.8806 1.92C8.00995 1.97 8.13194 2.03 8.24657 2.1C8.36119 2.17 8.47304 2.245 8.58209 2.325L10.3582 1.575L12 4.425L10.4627 5.595C10.4726 5.665 10.4776 5.7326 10.4776 5.7978V6.2022C10.4776 6.2674 10.4677 6.335 10.4478 6.405L11.9851 7.575L10.3433 10.425L8.58209 9.675C8.47264 9.755 8.35821 9.83 8.23881 9.9C8.1194 9.97 8 10.03 7.8806 10.08L7.64179 12H4.35821ZM6.02985 8.1C6.60697 8.1 7.0995 7.895 7.50746 7.485C7.91542 7.075 8.1194 6.58 8.1194 6C8.1194 5.42 7.91542 4.925 7.50746 4.515C7.0995 4.105 6.60697 3.9 6.02985 3.9C5.44279 3.9 4.94766 4.105 4.54448 4.515C4.14129 4.925 3.9399 5.42 3.9403 6C3.9407 6.58 4.14229 7.075 4.54507 7.485C4.94786 7.895 5.44279 8.1 6.02985 8.1Z" fill="white" />
            </svg>
            Manage
          </div>
        }
      </header>

      {/* Open Swaps created by logged in user */}
      <ScrollArea className='w-full' >
        <div className="w-full flex items-center gap-3 py-2" >
          {createdSwaps &&
            createdSwaps.map(swap => (
              <CreatedOpenSwapsCard key={swap.open_trade_id} swap={swap} />
            ))
          }
        </div>

        <ScrollBar orientation='horizontal' className='h-2' />
      </ScrollArea>

      {/* Available open swaps data table section */}
      <section className='border border-su_quinary_bg rounded-md py-4 lg:pt-6 lg:pb-0 space-y-4 lg:space-y-6' >

        {/* Available title and search bar */}
        <header className="rounded-tl-md rounded-tr-md px-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between" >
          <div>
            <div className="flex items-center gap-4" >
              <h2 className="text-xl lg:text-1.5xl font-medium" >Open Market Trades</h2>
              <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${(filteredAvailableOpenSwaps || []).length > 0 ? 'bg-white text-su_primary_bg' : 'bg-muted'}`}>
                {filteredAvailableOpenSwaps?.length || 0}
              </span>
            </div>
            <p className='text-su_ternary text-sm' >View all open trades on platforms</p>
          </div>

          <div className='w-full lg:w-1/3 flex items-center justify-between gap-2' >
            <Input
              className="w-full bg-su_enable_bg text-su_secondary !p-3.5 mr-1"
              placeholder="Search by NFT, trade ID, wallet, etc..."
              onChange={handleFilterAvailableSwapsBySearch}
              icon={
                <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 14.6154L11.2277 9.84231C11.9968 8.78544 12.4105 7.5117 12.4092 6.20462C12.4092 2.78346 9.62577 0 6.20462 0C2.78346 0 0 2.78346 0 6.20462C0 9.62577 2.78346 12.4092 6.20462 12.4092C7.5117 12.4105 8.78544 11.9968 9.84231 11.2277L14.6154 16L16 14.6154ZM6.20462 10.4496C5.36493 10.4497 4.54407 10.2008 3.84586 9.7343C3.14765 9.26784 2.60345 8.60481 2.28208 7.82905C1.96071 7.05329 1.8766 6.19965 2.0404 5.37609C2.2042 4.55253 2.60854 3.79604 3.20229 3.20229C3.79604 2.60854 4.55253 2.2042 5.37609 2.0404C6.19965 1.8766 7.05329 1.96071 7.82905 2.28208C8.60481 2.60345 9.26784 3.14765 9.7343 3.84586C10.2008 4.54407 10.4497 5.36493 10.4496 6.20462C10.4483 7.33005 10.0006 8.40902 9.20482 9.20482C8.40902 10.0006 7.33005 10.4483 6.20462 10.4496Z" fill="#868691" />
                </svg>
              }
            />

            <div className='lg:hidden' >
              <OpenMarketSwapFilterDrawer
                formKey={formKey}
                setFormKey={setFormKey}
                openMarketForm={openMarketForm}
                handleResetAppliedFilters={handleResetAppliedFilters}
                availableCollections={availableOpenSwapCollections}
                filters={openMarketSwapsFilters}
                setOpenMarketSwapsByFilters={setOpenMarketAvailableSwapsByFilters}
              >
                <FilterButton className='rounded-md' filterApplied={availableOpenSwapsFiltersApplied} />
              </OpenMarketSwapFilterDrawer>
            </div>
          </div>
        </header>

        {/*Desktop: Available open swaps datalist */}
        <div className='hidden lg:block '>
          <ScrollArea className={`w-full ${(filteredAvailableOpenSwaps || []).length > 0 ? "h-[450px]" : ""}`}>
            <Table className="min-w-full">
              <TableHeader className='w-full bg-su_secondary_bg'>
                <TableRow className='!bg-su_secondary_bg !p-0 min-w-full' >
                  <TableHead className="pl-6 py-0.5 lg:py-0.5 font-semibold min-w-[150px]">Assets</TableHead>
                  <TableHead className="pl-4 py-0.5 lg:py-0.5 font-semibold min-w-[100px]">Unique trade ID</TableHead>
                  <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold">Owner's wallet</TableHead>
                  <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold min-w-[130px]">Trading chain</TableHead>
                  <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold min-w-[120px]">Open swap date</TableHead>
                  <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold min-w-[100px]">Expiry date</TableHead>
                  <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold min-w-[130px]">Swap Preferences</TableHead>
                  <TableHead className="py-0.5 lg:py-0.5 pr-2">
                    <div className='' >
                      <OpenMarketSwapFilterDrawer
                        formKey={formKey}
                        setFormKey={setFormKey}
                        openMarketForm={openMarketForm}
                        handleResetAppliedFilters={handleResetAppliedFilters}
                        availableCollections={availableOpenSwapCollections}
                        filters={openMarketSwapsFilters}
                        setOpenMarketSwapsByFilters={setOpenMarketAvailableSwapsByFilters}
                      >
                        <FilterButton showTitleOnMobile filterApplied={availableOpenSwapsFiltersApplied} className='py-1.5' />
                      </OpenMarketSwapFilterDrawer>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className='divide-y' >
                {
                  filteredAvailableOpenSwaps?.map((swap) => {
                    const currentChain = chainsDataset.find(chain => chain.uuid === swap.trading_chain) || chainsDataset[1];
                    return (
                      <TableRow key={swap.open_trade_id} className='!w-full text-xs font-medium'>
                        <TableCell className="py-2 lg:py-2.5 pl-6 flex items-center gap-2">
                          <div className="flex items-center gap-1" >
                            {mapSwapTokensHelper(swap.metadata.init.tokens, 3)}
                          </div>
                        </TableCell>
                        <TableCell className="pl-4 py-2 lg:py-2.5">#{getLastCharacters(swap.open_trade_id, 7)}</TableCell>
                        <TableCell className="px-4 py-2 lg:py-2.5">{getShortenWalletAddress(swap.init_address)}</TableCell>
                        <TableCell className="px-4 py-2 lg:py-2.5 flex justify-start">
                          <span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize" >
                            <img
                              className='w-4 h-4'
                              src={currentChain.iconUrl}
                              alt=""
                            />

                            {currentChain.name}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-2 lg:py-2.5">{moment.utc(swap.created_at).format('MMM DD, YYYY')}</TableCell>
                        <TableCell className="px-4 py-2 lg:py-2.5">{moment.utc(swap.swap_preferences.expiration_date).local().format('MMM DD, YYYY')}</TableCell>
                        <TableCell className="px-4 py-2 lg:py-2.5 capitalize">

                          {
                            swap.swap_preferences.preferred_asset.type === "any" &&
                            <span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize" >
                              Any
                            </span>
                          }

                          {
                            swap.swap_preferences.preferred_asset.type === "nft" &&
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize" >
                                {swap.swap_preferences.preferred_asset.parameters.collection}
                              </span>
                              /
                              <span
                                className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize"
                              >
                                <svg className='w-3' viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4.42378 9.85092C4.44292 9.86768 4.46712 9.87783 4.49268 9.87984C4.51824 9.88184 4.54377 9.87559 4.56538 9.86204C4.587 9.84849 4.60351 9.82837 4.61242 9.80475C4.62133 9.78113 4.62214 9.75529 4.61473 9.73118L3.10154 4.63583C3.08781 4.58947 3.05998 4.54834 3.02176 4.51797C2.98355 4.4876 2.93679 4.46945 2.88777 4.46595C2.64278 4.44825 2.39838 4.42879 2.15399 4.40696L0.1304 4.22587C0.109007 4.22383 0.0874498 4.22752 0.0680225 4.23655C0.0485952 4.24559 0.0320244 4.25963 0.0200731 4.27718C0.00812187 4.29473 0.00123726 4.31513 0.000151745 4.33622C-0.00093377 4.35731 0.00382039 4.37829 0.0139085 4.39693C1.10857 6.40841 2.68481 8.3255 4.42378 9.85092ZM5.90814 10.928C5.92015 10.9693 5.95618 11 6.00002 11C6.0212 10.9994 6.0416 10.992 6.05817 10.9791C6.07474 10.9661 6.08657 10.9482 6.09189 10.928L7.94374 4.69128C7.94925 4.67317 7.95025 4.65403 7.94666 4.63547C7.94307 4.6169 7.93499 4.59945 7.9231 4.5846C7.91121 4.56974 7.89586 4.5579 7.87835 4.55009C7.86083 4.54227 7.84166 4.5387 7.82245 4.53968C6.60805 4.59087 5.39198 4.59087 4.17758 4.53968C4.15844 4.53873 4.13934 4.5423 4.12189 4.55009C4.10443 4.55787 4.08913 4.56965 4.07725 4.58443C4.06538 4.59921 4.05728 4.61657 4.05363 4.63506C4.04999 4.65354 4.0509 4.67262 4.05629 4.69069L5.90814 10.928ZM7.38531 9.73118C7.35168 9.84326 7.48739 9.92879 7.57626 9.85092C9.31522 8.32491 10.8915 6.40841 11.9861 4.39693C11.9962 4.37833 12.0009 4.35741 11.9999 4.33638C11.9988 4.31535 11.992 4.29499 11.9801 4.27747C11.9682 4.25994 11.9517 4.24589 11.9324 4.2368C11.9131 4.22772 11.8916 4.22394 11.8702 4.22587L9.84664 4.40696C9.60165 4.42879 9.35726 4.44825 9.11226 4.46595C9.06324 4.46945 9.01648 4.4876 8.97827 4.51797C8.94005 4.54834 8.91222 4.58947 8.8985 4.63583L7.38531 9.73118ZM11.8852 3.33634C11.9062 3.33453 11.9263 3.32736 11.9435 3.31554C11.9607 3.30371 11.9745 3.28765 11.9834 3.26896C11.9924 3.25028 11.9962 3.22961 11.9944 3.20903C11.9927 3.18846 11.9855 3.16869 11.9735 3.15171L10.0292 0.38224C9.94632 0.264296 9.83554 0.167887 9.70637 0.101304C9.57719 0.0347212 9.43348 -4.316e-05 9.2876 5.11881e-07H7.79243C7.77271 2.50091e-07 7.75329 0.00477053 7.73589 0.01389C7.71849 0.0230095 7.70365 0.0361974 7.69267 0.0522892C7.68169 0.0683809 7.67491 0.0868813 7.67293 0.106156C7.67096 0.125431 7.67384 0.144887 7.68134 0.162806L9.0366 3.42069C9.05586 3.46677 9.08946 3.50569 9.13261 3.53186C9.17576 3.55803 9.22623 3.57012 9.27679 3.56639C9.43892 3.554 9.60225 3.54043 9.76498 3.5251L11.8852 3.33634ZM6.69957 0.14511C6.68128 0.102056 6.65042 0.0652925 6.61088 0.0394645C6.57133 0.0136364 6.52488 -9.66368e-05 6.47739 5.11881e-07H5.52264C5.47515 -9.66368e-05 5.4287 0.0136364 5.38916 0.0394645C5.34961 0.0652925 5.31875 0.102056 5.30047 0.14511L3.88455 3.48263C3.87722 3.50009 3.87427 3.51903 3.87594 3.53785C3.87761 3.55667 3.88385 3.57482 3.89415 3.59078C3.90445 3.60673 3.9185 3.62002 3.93511 3.62953C3.95173 3.63904 3.97043 3.6445 3.98964 3.64543C5.32869 3.70914 6.67134 3.70914 8.011 3.64543C8.03015 3.64441 8.04878 3.63889 8.06532 3.62934C8.08186 3.61979 8.09583 3.60649 8.10606 3.59055C8.11629 3.57461 8.12248 3.55649 8.12412 3.53771C8.12576 3.51893 8.1228 3.50005 8.11548 3.48263L6.69957 0.14511ZM4.31869 0.162806C4.32619 0.144887 4.32907 0.125431 4.3271 0.106156C4.32512 0.0868813 4.31835 0.0683809 4.30737 0.0522892C4.29639 0.0361974 4.28154 0.0230095 4.26414 0.01389C4.24674 0.00477053 4.22733 2.50091e-07 4.20761 5.11881e-07H2.71243C2.56655 -4.316e-05 2.42284 0.0347212 2.29367 0.101304C2.16449 0.167887 2.05371 0.264296 1.97085 0.38224L0.0265185 3.15171C0.0145622 3.16869 0.00735242 3.18846 0.00560972 3.20903C0.00386702 3.22961 0.00765244 3.25028 0.0165877 3.26896C0.0255229 3.28765 0.039295 3.30371 0.0565275 3.31554C0.07376 3.32736 0.0938493 3.33453 0.114788 3.33634L2.23506 3.5251C2.39778 3.54043 2.56051 3.554 2.72324 3.56639C2.77382 3.57021 2.82433 3.55816 2.8675 3.53198C2.91066 3.50579 2.94425 3.46683 2.96343 3.42069L4.31869 0.162806Z" fill="white" />
                                </svg>

                                {swap.swap_preferences.preferred_asset.parameters.rank?.from} - {swap.swap_preferences.preferred_asset.parameters.rank?.to}
                              </span>
                            </div>
                          }

                          {swap.swap_preferences.preferred_asset.type === "currency" &&
                            <div className="flex items-center gap-1">
                              <span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize" >
                                {/* Not sure what to show here */}
                                Crypto currencies
                              </span>

                            </div>
                          }
                        </TableCell>
                        <TableCell className="pr-8 py-2 lg:py-2.5 text-xs font-medium flex justify-end">
                          <svg
                            onClick={() => { handleNavigateToProposeRoom(swap); }}

                            className="w-12 h-6 cursor-pointer"
                            viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="30" height="30" rx="15" stroke="url(#paint0_linear_2344_40905)" strokeWidth="2" />
                            <path d="M17.7284 11L22 15.1586H10.2385V14.0368H19.2184L16.9138 11.7931L17.7284 11ZM21.7615 16.8414V17.9632H12.7816L15.0862 20.2069L14.2716 21L10 16.8414H21.7615Z" fill="white" />
                            <defs>
                              <linearGradient id="paint0_linear_2344_40905" x1="32" y1="6.08" x2="-1.86631" y2="14.9716" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#51C0FF" />
                                <stop offset="1" stopColor="#9452FF" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
            <ScrollBar />
          </ScrollArea>

          {
            (((filteredAvailableOpenSwaps || []).length === 0) && (availableOpenSwapsFiltersApplied || availableOpenSwapsSearchApplied)) &&
            <EmptyDataset
              title="No Results Found"
              description="We couldn't find any results matching your search query. <br/>  Please try again with a different keyword or refine your search criteria."
              showBackgroundPicture={false}
            />
          }
        </div>

        <div className='px-4 lg:px-6' >
          {/*Mobile: Filler applied to open market data */}
          {availableOpenSwapsFiltersApplied &&
            <OpenMarketAppliedFiltersBar
              className={`lg:hidden`}
              handleResetAppliedFilters={handleResetAppliedFilters}
              filters={openMarketSwapsFilters}
            />
          }

          {/*Mobile: Available open swaps datalist */}
          <div className='flex flex-col gap-3 lg:hidden' >
            {filteredAvailableOpenSwaps?.map((swap, index) => (
              <OpenSwapListMobileCard
                key={index}
                swap={swap}
                handleNavigation={handleNavigateToProposeRoom}
              />
            ))}

            {
              (((filteredAvailableOpenSwaps || []).length === 0) && (availableOpenSwapsFiltersApplied || availableOpenSwapsSearchApplied)) &&
              <EmptyDataset
                title="No Results Found"
                description="We couldn't find any results matching your search query.  Please try again with a different keyword or refine your search criteria."
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
            ((isError || isSuccess) && ((availableOpenSwaps || []).length === 0) && !availableOpenSwapsFiltersApplied && !availableOpenSwapsSearchApplied) &&
            <EmptyDataset
              title="No Open Swaps Available"
              description="Check back later or create your own swap!"
            >
              <Button
                className="gradient-button"
                onClick={() => {
                  wallet.isConnected ?
                    navigate(`/swap-up/swap-market/open-swap/create/${generateRandomTradeId()}`)
                    : showWalletConnectionToast();
                }}
              >
                Create open swap
              </Button>
            </EmptyDataset>
          }
        </div>
      </section >
    </section >
  );
};

export default OpenMarketTabContent;