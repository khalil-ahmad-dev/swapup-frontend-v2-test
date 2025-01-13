import React, { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, getDefaultNftImageOnError, getNetworkImageById } from '@/lib/utils';
import { getSimplehashTrendingNftCollectionsApi } from '@/service/api';
import { useSwapMarketAnalyticsStore } from '@/store/swap-market-analytics-store';
import { useQuery } from '@tanstack/react-query';
import { handleShowNotificationToast } from '@/lib/helpers';
import { SUI_TrendingCollection } from '@/types/analytics.types';
import LoadingDataset from '../../shared/LoadingDataset';
import EmptyDataset from '../../shared/EmptyDataset';
import { Environment } from '@/config';
import { toEther } from 'thirdweb';
import { currentChain } from '@/lib/thirdWebClient';

interface IProp {
  className?: string;
}

const TrendingNftCollectionSection = ({ className }: IProp) => {
  const [collectionsFirstHalf, setCollectionsFirstHalf] = useState<SUI_TrendingCollection[]>([]);
  const [collectionsLastHalf, setCollectionsLastHalf] = useState<SUI_TrendingCollection[]>([]);

  const [trendingCollections, setTrendingCollections] = useSwapMarketAnalyticsStore(state => [state.trendingCollections, state.setTrendingCollections]);

  const { isSuccess, isLoading } = useQuery({
    queryKey: [`getSimplehashTrendingNftCollectionsApi`],
    queryFn: async () => {
      try {
        const response = await getSimplehashTrendingNftCollectionsApi();
        setTrendingCollections(response.data.collections as SUI_TrendingCollection[]);
        return response.data.collections;
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


  const handleMapTrendingCollectionItems = (collections: SUI_TrendingCollection[]) => {
    return collections.map((item, index) => {

      const formattedVolume = new Intl.NumberFormat(
        'en-US',
        { maximumFractionDigits: 8, minimumFractionDigits: 0 })
        .format(parseFloat(toEther(item.volume as unknown as bigint))
        );

      return (
        <TableRow key={item.collection_id} className='!w-full text-base font-semibold text-su_primary'>
          <TableCell className="pl-4" >
            {index + 1}
          </TableCell>

          <TableCell className="pl-4" >
            <div className='flex items-center gap-2 lg:gap-4' >
              <img
                className='h-8 w-8 lg:w-10 lg:h-10 rounded-sm object-cover'
                src={item.collection_details.image_url}
                alt="collection image"
                loading='lazy'
                onError={(e: any) => {
                  e.currentTarget.className = "h-8 w-8 lg:w-10 lg:h-10 rounded-sm object-cover";
                  getDefaultNftImageOnError(e);
                }}
              />

              <span className='capitalize text-sm lg:text-base' >{item.collection_details.name}</span>
            </div>
          </TableCell>

          <TableCell className="text-sm font-normal">
            {(item.collection_details.top_bids.length > 0 || item.collection_details.floor_prices.length > 0) ?
              <div className='flex items-center gap-2'>
                <span className=''>
                  {
                    item.collection_details.top_bids.length ?
                      toEther(item.collection_details.top_bids[0].value as unknown as bigint) :
                      item.collection_details.floor_prices.length ? toEther((item.collection_details.floor_prices || [])[0].value as unknown as bigint) : 0
                  }
                </span>
                <span className='uppercase' >{item.payment_token.symbol}</span>
                <img
                  className='w-4 h-4 object-cover'
                  src={getNetworkImageById(String(currentChain.id))}
                  alt=""
                  loading='lazy'
                  onError={(e: any) => {
                    e.currentTarget.className = "w-4 h-4 object-cover";
                    getDefaultNftImageOnError(e);
                  }}
                />
              </div>
              :
              <p className='text-su_ternary' >Not offered yet</p>
            }
          </TableCell>

          <TableCell className="text-sm font-normal pr-4">
            <div className='flex flex-col items-end' >
              <p>{formattedVolume} {item.payment_token.symbol}</p>
              <p className={cn(
                "text-su_ternary font-semibold",
                item.volume_percent_change > 0 ? "text-su_positive" : "text-su_negative"
              )}
              >
                {item.volume_percent_change > 0 ? "+" : "<"} {String(item.volume_percent_change).replace("-", "")} %
              </p>
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  useEffect(() => {
    if (trendingCollections.length > 0) {
      const fullDataset = [...trendingCollections];
      const mid = Math.floor(fullDataset.length / 2);

      const firstHalf = trendingCollections.slice(0, mid);
      const lastHalf = trendingCollections.slice(mid);

      setCollectionsFirstHalf(firstHalf);
      setCollectionsLastHalf(lastHalf);
    } else {
      setCollectionsFirstHalf([]);
      setCollectionsLastHalf([]);
    }

  }, [trendingCollections]);

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

        <h2 className='text-su_primary text-2xl font-semibold' >Trending NFT Collection</h2>
      </header>

      {(isSuccess && trendingCollections.length > 0) &&
        <ScrollArea className='w-full'>
          <div className='flex items-center lg:grid lg:grid-cols-2 gap-6' >
            <ScrollArea className='w-full'>
              <Table>
                <TableHeader className='w-full'>
                  <TableRow className='min-w-full hover:bg-transparent' >
                    <TableHead className="font-semibold w-[60px]">Rank</TableHead>
                    <TableHead className="pl-4 font-semibold min-w-[180px]">Collection</TableHead>
                    <TableHead className="font-semibold min-w-[130px]">Best Offer</TableHead>
                    <TableHead className="font-semibold min-w-[100px] text-right pr-4">Volume</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className='divide-y' >
                  {handleMapTrendingCollectionItems(collectionsFirstHalf)}
                </TableBody>
              </Table>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>

            <ScrollArea className='w-full'>
              <Table className="overflow-x-auto">
                <TableHeader className='w-full'>
                  <TableRow className='min-w-full hover:bg-transparent' >
                    <TableHead className="font-semibold w-[60px]">Rank</TableHead>
                    <TableHead className="pl-4 font-semibold min-w-[180px]">Collection</TableHead>
                    <TableHead className="font-semibold min-w-[130px]">Best Offer</TableHead>
                    <TableHead className="font-semibold min-w-[100px] text-right pr-4">Volume</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className='divide-y' >
                  {handleMapTrendingCollectionItems(collectionsLastHalf)}
                </TableBody>
              </Table>
              <ScrollBar orientation='horizontal' className='h-2' />
            </ScrollArea>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      }

      <LoadingDataset
        className='h-[195px] lg:h-[195px]'
        isLoading={isLoading}
        title='Loading Trending NFT Collections'
        description='Please wait while we load the trending NFT collections for you.'
      />

      {(!isLoading && trendingCollections.length === 0) &&
        <EmptyDataset
          className='h-[195px] lg:h-[195px]'
          title='Empty Trending NFT Collections'
          description='Could not find any trending NFT collections. Please try again later.'
          showBackgroundPicture={false}
        />
      }
    </section>
  );
};

export default TrendingNftCollectionSection;