import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import CustomAvatar from '../shared/CustomAvatar';
import moment from 'moment';
import CopyTile from '../tiles/CopyTile';
import { cn, getDefaultNftImageOnError, getNumberToShortScaleFormate, getShortenWalletAddress } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { handleShowNotificationToast } from '@/lib/helpers';
import { useSwapMarketAnalyticsStore } from '@/store/swap-market-analytics-store';
import { defaults } from '@/constants/defaults';
import LoadingDataset from '../shared/LoadingDataset';
import EmptyDataset from '../shared/EmptyDataset';
import { getNewMembersApi } from '@/service/api';
import { SUI_NewMember } from '@/types/analytics.types';


const NewMembersSection = () => {

  const [newMembersData, setNewMembersData] = useSwapMarketAnalyticsStore(state => [state.newMembersData, state.setNewMembersData]);

  const { isSuccess, isLoading } = useQuery({
    queryKey: [`getNewMembersApi`],
    queryFn: async () => {
      try {
        const response = await getNewMembersApi();
        // console.log("getNewMembersApi: ", response.data.data);
        setNewMembersData(response.data.data as SUI_NewMember[]);
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
    <div className='border border-su_quinary_bg rounded-md py-4 lg:pt-6 lg:pb-0 space-y-4 lg:space-y-6'>
      <header className='px-6 flex items-center gap-5'>
        <svg className='w-7' viewBox="0 0 29 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.601562 20.6318V0.631836H28.6016V20.6318H0.601562ZM3.78338 14.3818H5.37429V10.0068L8.61974 14.3818H10.147V6.88184H8.55611V11.2568L5.37429 6.88184H3.78338V14.3818ZM11.4197 14.3818H16.5107V12.8193H13.3288V11.4443H16.5107V9.88184H13.3288V8.44434H16.5107V6.88184H11.4197V14.3818ZM17.7834 14.3818H25.4197V6.88184H23.8288V12.5068H22.4288V8.13184H20.8379V12.5068H19.3743V6.88184H17.7834V14.3818Z" fill="#868691" />
        </svg>

        <h2 className='text-su_primary text-2xl font-semibold' >New members</h2>
      </header>

      {(newMembersData.length > 0 && isSuccess) &&
        <ScrollArea className="w-full">
          <div>
            <ScrollArea className='w-full h-[380px]'>
              <Table className="min-w-full">
                <TableHeader className='w-full bg-su_secondary_bg'>
                  <TableRow className='!bg-su_secondary_bg !p-0 min-w-full'>
                    <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold min-w-[130px]">Data Joined</TableHead>
                    <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold min-w-[210px]">Trader</TableHead>
                    <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold min-w-[180px]">Membership created</TableHead>
                    <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold text-center min-w-[180px]">Wallet address</TableHead>
                    <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold text-center min-w-[130px]">Total collection</TableHead>
                    <TableHead className="px-4 py-0.5 lg:py-0.5 font-semibold text-center min-w-[150px] ">NFT profiles</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className='divide-y' >
                  {newMembersData.map((member, index) => (
                    <TableRow key={member.id + member.wallet} className="py-2 lg:py-2.5 text-base font-semibold">
                      <TableCell className="px-4 py-2 lg:py-2.5">{moment(member.createdAt).format("MM/DD/yyyy")}</TableCell>
                      <TableCell className="px-4 py-2 lg:py-2.5">
                        <div className='flex items-center gap-4' >
                          <CustomAvatar
                            imageSrc={member.avatar}
                            fallbackName={member.title || "swapup user"}
                          />

                          <span className='' >{member.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-2 lg:py-2.5">
                        {member.membershipCreatedAt ? moment(member.membershipCreatedAt).format('DD MMMM YYYY') : 'Not created'}
                      </TableCell>
                      <TableCell className="px-4 py-2 lg:py-2.5">
                        <CopyTile
                          className='p-0 dark:text-su_primary dark:bg-transparent text-base font-normal gap-5 justify-center'
                          textToCopy={member.wallet}
                        >
                          {getShortenWalletAddress(member.wallet, 'medium')}
                        </CopyTile>
                      </TableCell>
                      <TableCell className="px-4 py-2 lg:py-2.5">
                        <p className='text-center' >{getNumberToShortScaleFormate(Number(member.totalCollections))}</p>
                      </TableCell>
                      <TableCell className="px-4 py-2 lg:py-2.5">
                        {member.nftProfiles.length ?
                          <div className='group cursor-pointer flex items-center justify-center gap-4' >
                            <div className='flex items-center'>
                              {member.nftProfiles.slice(0, 3).map((item, index) => {
                                const imageURL = item.media.length > 0 ? item.media[0].gateway : defaults.fallback.nftImageUrl;
                                const mediaFound = item.media.length > 0;
                                return (
                                  <div key={item.contract.address + index}
                                    className={cn(
                                      "ml-[-7px] w-8 h-8 rounded-xs relative p-0.5 shadow-black shadow-md",
                                      (index === 0) && "golden-gradient-bg",
                                      (index === 1) && "silver-gradient-bg",
                                      (index === 2) && "bronze-gradient-bg",
                                      !mediaFound && "bg-none p-0"
                                    )}
                                  >
                                    <img
                                      className="w-full h-full rounded-xs object-cover"
                                      src={imageURL}
                                      alt=""
                                      onError={getDefaultNftImageOnError}
                                      loading='lazy'
                                    />
                                  </div>
                                );
                              })}
                            </div>

                            <Link to={''} className='flex items-center gap-2' >
                              <span className='text-su_brand group-hover:underline' >More</span>

                              <svg className="w-3 text-su_primary group-hover:text-su_brand" viewBox="0 0 13 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.10156 0.917969L5.04406 1.97547L9.22906 6.16797H0.101562V7.66797H9.22906L5.04406 11.8605L6.10156 12.918L12.1016 6.91797L6.10156 0.917969Z" fill="currentColor" />
                              </svg>

                            </Link>
                          </div>
                          :
                          <p className='text-center'>Empty Data</p>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar />
            </ScrollArea>
          </div>

          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      }

      <LoadingDataset
        className='h-[195px] lg:h-[195px]'
        isLoading={isLoading}
        title='Loading New Members'
        description='Please wait while we load the new members data.'
      />

      {(!isLoading && newMembersData.length === 0) &&
        <EmptyDataset
          className='h-[195px] lg:h-[195px]'
          title='No New Members'
          description='Could not find any new members. Please try again later.'
          showBackgroundPicture={false}
        />
      }
    </div>
  );
};

export default NewMembersSection;