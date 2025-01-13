import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React from 'react';
import TrendingTokenCardItem from './TrendingTokenCardItem';
import { useSwapMarketAnalyticsStore } from '@/store/swap-market-analytics-store';
import { useQuery } from '@tanstack/react-query';
import { getCoinRankingCurrenciesApi, getTrendingTokensApi } from '@/service/api';
import { SUI_TrendingToken } from '@/types/analytics.types';
import { handleShowNotificationToast } from '@/lib/helpers';
import LoadingDataset from '../../shared/LoadingDataset';
import EmptyDataset from '../../shared/EmptyDataset';
import { SUI_CurrencyChainItem } from '@/types/global.types';
import { currentChain } from '@/lib/thirdWebClient';
import { SUE_CHAIN_ID } from '@/constants/enums';


interface IProp {
  className?: string;
}

const TrendingTokensSection = ({ className }: IProp) => {

  const [trendingTokens, setTrendingTokens] = useSwapMarketAnalyticsStore(state => [state.trendingTokens, state.setTrendingTokens]);

  const { isSuccess, isLoading } = useQuery({
    queryKey: [`getCoinRankingCurrenciesApi`],
    queryFn: async () => {
      try {
        // Currently using coinranking API to get trending tokens, we will use our own data in the future

        // Get trending tokens from platform data
        // const response = await getTrendingTokensApi();

        const computedChainName = (currentChain.id === SUE_CHAIN_ID.BASE) ? 'base' : 'ethereum';
        const response = await getCoinRankingCurrenciesApi({ limit: 10, orderBy: "marketCap", orderDirection: "asc", blockchains: [computedChainName] });;
        const formattedData: SUI_TrendingToken[] = response.data.data.coins.map((coin: SUI_CurrencyChainItem) => {
          const foundCoinAddress = ((coin.contractAddresses.find((address: string) => address.toLowerCase().startsWith(computedChainName)) as string | undefined) || "").replace(`${computedChainName}/`, '');

          const formattedCoin: SUI_TrendingToken = {
            address: foundCoinAddress || '',
            image_url: coin.iconUrl,
            symbol: coin.symbol,
            trading_chain: currentChain.id,
            tokenAppearance: 0,
            type: 'ERC20',
            additionalData: coin
          };

          return formattedCoin;
        });

        setTrendingTokens(formattedData);
        return response.data.data;
      } catch (error: any) {
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


  return (
    <section className={cn(
      "space-y-6",
      className
    )}
    >
      <header className='flex items-center gap-5'>
        <svg className='w-6' viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M18.3495 9.94046C18.3495 14.9903 14.2558 19.084 9.20601 19.084C4.15619 19.084 0.0625 14.9903 0.0625 9.94046C0.0625 4.8906 4.15619 0.796875 9.20601 0.796875C14.2558 0.796875 18.3495 4.8906 18.3495 9.94046ZM13.6564 19.9683C12.2552 20.5901 10.7393 20.9113 9.20638 20.9114C8.84064 20.9114 8.4749 20.8931 8.11465 20.8584C8.70383 22.2316 9.62052 23.4395 10.7845 24.3765C11.9485 25.3135 13.3244 25.951 14.7918 26.2332C16.2592 26.5154 17.7733 26.4338 19.2019 25.9955C20.6304 25.5571 21.9298 24.7754 22.9863 23.7187C24.0428 22.662 24.8243 21.3625 25.2625 19.9339C25.7006 18.5053 25.782 16.9911 25.4996 15.5237C25.2171 14.0564 24.5794 12.6806 23.6423 11.5167C22.7051 10.3528 21.497 9.43633 20.1237 8.84735C20.2763 10.3727 20.1075 11.9131 19.6283 13.3692C19.1491 14.8253 18.3701 16.1648 17.3415 17.3014C16.3129 18.4381 15.0576 19.3465 13.6564 19.9683Z" fill="#868691" />
        </svg>


        <h2 className='text-su_primary text-2xl font-semibold' >Trending Tokens</h2>
      </header>

      {(isSuccess && trendingTokens.length > 0) &&

        <ScrollArea className='w-full'>
          <div className='flex items-center gap-2.5 mb-3'>
            {trendingTokens.map((item, index) => (
              <TrendingTokenCardItem key={item.address + index} item={item} />
            ))}
          </div>
          <ScrollBar orientation='horizontal' className='' />
        </ScrollArea>
      }

      <LoadingDataset
        className='h-[195px] lg:h-[195px]'
        isLoading={isLoading}
        title='Loading Trending Tokens'
        description='Please wait while we load the trending tokens.'
      />

      {(!isLoading && trendingTokens.length === 0) &&
        <EmptyDataset
          className='h-[195px] lg:h-[195px]'
          title='No Tokens Found'
          description='Could not find any trending tokens. Please try again later.'
          showBackgroundPicture={false}
        />
      }

    </section>
  );
};

export default TrendingTokensSection;