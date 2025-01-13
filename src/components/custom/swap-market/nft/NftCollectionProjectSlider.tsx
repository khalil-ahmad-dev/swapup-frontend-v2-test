import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn, getNumberToShortScaleFormate } from '@/lib/utils';
import React from 'react';
import CustomOutlineButton from '../../shared/CustomOutlineButton';
import CustomAvatar from '../../shared/CustomAvatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import moment from 'moment';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { showUnderConstructionToast } from '@/lib/helpers';

interface IProp {
  className?: string;
}

interface ICollectionProjectItem {
  contract: string;
  projectName: string;
  backgroundImage: string;
  owner: {
    address: string;
    title: string;
    avatar: string;
  };
  chain: {
    chainId: string;
    symbol: string;
    name: string;
    iconUrl: string;
  };
  createdOn: string;
  creatorFeePercent: number;
  holders: number;
  totalTransfers: number;
  totalItems: number;
  bestOffer: {
    amount: number | string;
    symbol: string;
    iconUrl: string;
  };
  volume: {
    amount: number | string;
    symbol: string;
    changePercentage: number | string;
    changeType: "high" | "low";
  };
}


const collectionProjectData: ICollectionProjectItem[] = [
  {
    contract: "0x38273231083021kajdk",
    backgroundImage: "/assets/images/collection-project-1.jpg",
    projectName: "Project AEON",
    owner: {
      address: "0x38273231083021kajdk",
      title: "Retardio Cousins",
      avatar: "/assets/images/member2.jpg",
    },
    chain: {
      chainId: "1",
      symbol: "ETH",
      name: "Ethereum",
      iconUrl: "/assets/svgs/ethereum.svg",
    },
    createdOn: "2023-08-10T12:00:00Z",
    creatorFeePercent: 5,
    holders: 55300,
    totalTransfers: 10000,
    totalItems: 67,
    bestOffer: {
      amount: 3.34,
      symbol: "ETH",
      iconUrl: "/assets/svgs/ethereum.svg",
    },
    volume: {
      amount: 202,
      symbol: "ETH",
      changePercentage: 36,
      changeType: "high",
    }
  },
  {
    contract: "0x38273231083021kajdkajhsa",
    backgroundImage: "/assets/images/collection-project-1.jpg",
    projectName: "Project AEON",
    owner: {
      address: "0x38273231083021kajdk",
      title: "Tate Crypto Punks",
      avatar: "/assets/images/member1.jpg",
    },
    chain: {
      chainId: "1",
      symbol: "ETH",
      name: "Ethereum",
      iconUrl: "/assets/svgs/ethereum.svg",
    },
    createdOn: "2022-08-10T12:00:00Z",
    creatorFeePercent: 4.6,
    holders: 34679,
    totalTransfers: 6779,
    totalItems: 35,
    bestOffer: {
      amount: 7.1,
      symbol: "ETH",
      iconUrl: "/assets/svgs/ethereum.svg",
    },
    volume: {
      amount: 123,
      symbol: "ETH",
      changePercentage: 13,
      changeType: "high",
    }
  },
];


const NftCollectionProjectSlider = ({ className }: IProp) => {
  return (
    <section className={cn(
      "w-full space-y-6 flex justify-center",
      className
    )}
    >
      <Carousel className="w-[95%] lg:w-[98%]">
        <CarouselContent className='text-su_primary' >
          {collectionProjectData.map((item, index) => (
            <CarouselItem key={item.contract + index} className='w-full h-[410px]' >
              <div className="relative w-full h-full border-[2px] border-su_least_bg rounded-xs p-2 lg:p-6 flex flex-col justify-end gap-10 lg:gap-6" >
                <div className='relative z-[1] flex items-center justify-between' >
                  <div>
                    <h3 className='text-base lg:text-xl font-semibold' >💎 Bonus: {item.owner.title}</h3>
                    <p className='text-su_secondary text-xs lg:text-sm font-medium flex items-center gap-2 lg:gap-6' >
                      <span className='uppercase' >{(Number(item.holders) > 3000) ? "hot" : ""} COLLECTION</span>
                      <span>.Total items {item.totalItems.toLocaleString('en-us')}</span>
                    </p>
                  </div>

                  <CustomOutlineButton className='px-5 py-3 normal-case' onClick={() => showUnderConstructionToast()} >
                    swap
                  </CustomOutlineButton>
                </div>

                <ScrollArea className='relative z-[1] w-full'>
                  <div className='mb-2 lg:mb-0 w-full flex items-center justify-between gap-10 lg:gap-20' >
                    {/* Profile section */}
                    <div className='flex items-center gap-2 min-w-max' >
                      <CustomAvatar
                        imageSrc={item.owner.avatar}
                        fallbackName={item.owner.title}
                      />

                      <div>
                        <h3 className='text-base font-semibold capitalize' >{item.projectName}</h3>
                        <p className='text-2xs font-medium text-su_secondary capitalize' >Chain {item.chain.name}</p>
                      </div>
                    </div>

                    <Table className='min-w-max' >
                      <TableHeader className='w-full py-0 lg:py-0 text-su_secondary text-sm font-medium'>
                        <TableRow className='min-w-full hover:bg-transparent py-0 lg:py-0' >
                          <TableHead className="py-0 lg:py-0 text-end min-w-[130px]">Created On</TableHead>
                          <TableHead className="py-0 lg:py-0 text-end min-w-[130px]">Creator fee</TableHead>
                          <TableHead className="py-0 lg:py-0 text-end min-w-[130px]">Number of Holders</TableHead>
                          <TableHead className="py-0 lg:py-0 text-end min-w-[130px]">Best Offer</TableHead>
                          <TableHead className="py-0 lg:py-0 text-end min-w-[130px]">Volume</TableHead>
                          <TableHead className="py-0 lg:py-0 text-end min-w-[130px]">Total Transfers</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody className='' >
                        <TableRow className='hover:bg-transparent !w-full text-sm font-medium text-su_primary'>
                          <TableCell className="py-0 lg:py-0 pr-2 text-end">
                            {moment(item.createdOn).format("DD MMM YYYY")}
                          </TableCell>
                          <TableCell className="py-0 lg:py-0 text-end">
                            {item.creatorFeePercent}%
                          </TableCell>
                          <TableCell className="py-0 lg:py-0 text-end">
                            {getNumberToShortScaleFormate(Number(item.holders))}
                          </TableCell>
                          <TableCell className="py-0 lg:py-0 text-end">
                            <div className='flex items-center gap-2 justify-end' >
                              <img className='w-3 h-3' src={item.bestOffer.iconUrl} alt="" />

                              <span className='' >{item.bestOffer.amount.toLocaleString('en-us')}</span>
                              <span className='text-su_ternary uppercase' >{item.bestOffer.symbol}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-0 lg:py-0 text-end">
                            <div className='flex items-center gap-2 justify-end' >
                              <p>{item.volume.amount.toLocaleString('en-us')} <span className='uppercase' >{item.volume.symbol}</span></p>
                              <span className={cn("text-su_ternary text-xs font-semibold", item.volume.changeType === 'high' ? "text-su_positive" : "text-su_negative")}>
                                {item.volume.changeType === 'high' ? "+" : "<"} {item.volume.changePercentage} %
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-0 lg:py-0 text-end">
                            {item.totalTransfers.toLocaleString('en-us')}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <ScrollBar orientation='horizontal' className='h-2' />
                </ScrollArea>

                {/* Background image */}
                <img className='absolute left-0 top-0 w-full h-full object-cover rounded-xs' src={item.backgroundImage} alt="" />
                {/* Background overlay */}
                <img className='absolute left-0 top-0 w-full h-full object-cover rounded-xs' src={"/assets/svgs/CollectionCarousolOverlay.svg"} alt="" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious children={''} />
        <CarouselNext children={''} />
      </Carousel>
    </section>
  );
};

export default NftCollectionProjectSlider;