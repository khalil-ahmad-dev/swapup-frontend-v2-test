import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import TrendingTraderCard from '../TrendingTraderCard';
import { useSwapMarketAnalyticsStore } from '@/store/swap-market-analytics-store';
import { useQuery } from '@tanstack/react-query';
import { getTopTradersApi } from '@/service/api';
import { handleShowNotificationToast } from '@/lib/helpers';
import EmptyDataset from '../../shared/EmptyDataset';
import LoadingDataset from '../../shared/LoadingDataset';
import { SUI_TopTrader } from '@/types/analytics.types';

interface IProp {
  className?: string;
}

const TrendingNftTradersSection = ({ className }: IProp) => {

  const [topTradersData, setTopTradersData] = useSwapMarketAnalyticsStore(state => [state.topTradersData, state.setTopTradersData]);

  const { isSuccess, isLoading } = useQuery({
    queryKey: [`getTopTradersApi`],
    queryFn: async () => {
      try {
        const response = await getTopTradersApi();
        setTopTradersData(response.data.data as SUI_TopTrader[]);
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
    <section
      className={cn(
        "w-full space-y-6",
        className
      )}
    >
      <header className='flex items-center gap-5'>
        <svg className='w-6' viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.9349 24.6406V21.974H11.2682V17.8406C10.1793 17.5962 9.20734 17.1353 8.35223 16.458C7.49712 15.7806 6.86912 14.9304 6.46823 13.9073C4.80156 13.7073 3.40734 12.9797 2.28556 11.7246C1.16378 10.4695 0.602451 8.99707 0.601562 7.30729V5.97396C0.601562 5.24063 0.862896 4.61307 1.38556 4.09129C1.90823 3.56951 2.53578 3.30818 3.26823 3.30729H5.9349V0.640625H19.2682V3.30729H21.9349C22.6682 3.30729 23.2962 3.56862 23.8189 4.09129C24.3416 4.61396 24.6025 5.24151 24.6016 5.97396V7.30729C24.6016 8.99618 24.0402 10.4686 22.9176 11.7246C21.7949 12.9806 20.4007 13.7082 18.7349 13.9073C18.3349 14.9295 17.7073 15.7797 16.8522 16.458C15.9971 17.1362 15.0247 17.5971 13.9349 17.8406V21.974H19.2682V24.6406H5.9349ZM5.9349 11.0406V5.97396H3.26823V7.30729C3.26823 8.15174 3.51267 8.91307 4.00156 9.59129C4.49045 10.2695 5.1349 10.7526 5.9349 11.0406ZM19.2682 11.0406C20.0682 10.7517 20.7127 10.2682 21.2016 9.58996C21.6905 8.91174 21.9349 8.15085 21.9349 7.30729V5.97396H19.2682V11.0406Z" fill="#868691" />
        </svg>

        <h2 className='text-su_primary text-2xl font-semibold' >Trending Traders</h2>
      </header>

      {(isSuccess && topTradersData.length > 0) &&
        <ScrollArea className='w-full'>
          <div className='flex items-center gap-4 mb-3' >
            {topTradersData.map(trader => (
              <TrendingTraderCard key={trader.wallet} trader={trader} />
            ))}
          </div>

          <ScrollBar orientation='horizontal' className='' />
        </ScrollArea>
      }


      <LoadingDataset
        isLoading={isLoading}
        className='h-[195px] lg:h-[195px]'
        title='Loading Trending Traders'
        description='Please wait while we load the traders data.'
      />

      {(!isLoading && topTradersData.length === 0) &&
        <EmptyDataset
          className='h-[195px] lg:h-[195px]'
          title='No Trending Traders Found'
          description='Could not find any Traders. Please try again later.'
          showBackgroundPicture={false}
        />
      }
    </section>
  );
};

export default TrendingNftTradersSection;