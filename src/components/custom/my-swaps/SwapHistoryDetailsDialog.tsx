import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area';
import { cn, getBaseScanTransactionURL, getLastCharacters } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import CopyTile from '@/components/custom/tiles/CopyTile';
import AvoidingFeeDialog from '@/components/custom/shared/AvoidingFeeDialog';
import { SUI_OpenSwap, SUT_SwapTokenContractType } from '@/types/swap-market.types';
import { Link } from 'react-router-dom';
import SwapHistoryDialogSideCard from './SwapHistoryDialogSideCard';
import { SUE_SWAP_STATUS, SUE_SWAP_STATUS_TO_STRING } from '@/constants/enums';
import { useEffect, useState } from 'react';

interface IProp {
  children: any;
  swap: SUI_OpenSwap;
}


const SwapHistoryDetailsDialog = ({ children, swap }: IProp) => {


  return (
    <Dialog key={Math.random()}>
      <div className="relative" >
        {children}
        <DialogTrigger className="absolute w-full h-full top-0 left-0 bg-transparent !p-0">
        </DialogTrigger>
      </div>


      <DialogContent className="max-h-[calc(100vh_-_100px)] p-0" >
        <ScrollArea className="p-4 lg:p-5" >
          <ScrollBar orientation="vertical" />

          <div className="space-y-3" >
            {/* header */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4 pt-2 w-full" >
                  <h2 className="font-semibold text-xl" >Swap Details</h2>

                  <CopyTile textToCopy={swap.trade_id} >
                    <span className="hidden lg:hidden" >Unique trade ID:</span> <span className="dark:text-su_primary font-semibold">#{getLastCharacters(swap.trade_id, 7)}</span>
                  </CopyTile>

                  <span className=" flex items-center gap-2 p-2 bg-su_enable_bg text-su_primary font-semibold text-2xs lg:text-xs rounded-xs" >
                    <span
                      className={cn(
                        "rounded-full w-2 h-2 ",
                        swap.status === SUE_SWAP_STATUS.COMPLETED && "bg-su_positive",
                        swap.status === SUE_SWAP_STATUS.DECLINED && "bg-su_negative",
                        swap.status === SUE_SWAP_STATUS.CANCELED && "bg-su_negative",
                      )}
                    >
                    </span>

                    <span className='capitalize' >
                      {SUE_SWAP_STATUS_TO_STRING[`value${swap.status!}`]}
                    </span>
                  </span>


                  <span>

                    {swap.status === 2 ?
                      <div className="flex items-center gap-2 text-xs text-su_secondary" >
                        <Link to={getBaseScanTransactionURL(swap.tx || "")} target="_blank" ><span className="hidden lg:inline-block" >Etherscan link</span></Link>
                        <svg className="w-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M3.50268 6.06934C3.1801 6.06934 2.91464 6.33479 2.91464 6.65793L2.9152 10.3637C2.9152 10.6179 2.73039 10.8375 2.47669 10.8604C2.18884 10.8952 1.9581 10.9181 1.77329 10.9299C1.42719 10.9646 1.10405 10.7916 0.930994 10.4914C0.71202 10.1106 0.527208 9.71797 0.388879 9.30242C-0.879603 5.65379 1.05812 1.65961 4.7034 0.389449C8.34867 -0.880713 12.3395 1.05925 13.6085 4.70733C13.7239 5.03047 13.6662 5.37713 13.4584 5.64259C12.7662 6.54313 11.8892 7.29357 11.0357 7.91689V3.67966C11.0357 3.34476 10.7703 3.0793 10.4471 3.0793H9.45531C9.13216 3.0793 8.86671 3.35652 8.86671 3.67966V8.81687C8.86671 9.02521 8.75134 9.19826 8.56653 9.2789C8.32459 9.38251 8.0821 9.48668 8.0821 9.48668V5.18C8.0821 4.8451 7.80544 4.57964 7.4823 4.57964H6.49047C6.15613 4.57964 5.89067 4.85686 5.89067 5.18V9.82102C5.89067 10.0523 5.72882 10.2483 5.50985 10.306C5.348 10.3407 5.20967 10.3755 5.0943 10.4102V6.66969C5.0943 6.33479 4.81765 6.06934 4.4945 6.06934H3.50268ZM12.6613 11.1145C10.3893 14.2429 6.01706 14.9357 2.89093 12.6613C6.70926 12.1187 11.4276 10.3294 13.9763 6.50823L13.9779 6.53171C13.9886 6.68568 13.9993 6.8392 13.9993 6.99322C13.9993 8.4706 13.5266 9.91381 12.6613 11.1145Z" fill="white" />
                        </svg>
                      </div>
                      :
                      <div></div>
                    }

                  </span>

                </div>

                <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                  <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </DialogClose>
              </div>
              <h2 className="text-sm font-semibold">Trade Details</h2>
            </div>

            {/* side cards*/}
            <div className="flex flex-col lg:flex-row items-center gap-4" >
              <SwapHistoryDialogSideCard swap={swap} side="sender" className='self-start' />

              <svg className="w-3.5" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.72844 0L12 4.15863H0.238525V3.0368H9.21836L6.91377 0.793135L7.72844 0ZM11.7615 5.84137V6.9632H2.78164L5.08623 9.20687L4.27156 10L0 5.84137H11.7615Z" fill="#B6B6BD" />
              </svg>

              <SwapHistoryDialogSideCard swap={swap} side="receiver" className='self-start' />
            </div>

            {/* Fee section*/}
            <div className="custom-border-card" >
              <h2 className="text-xs lg:sm text-primary font-semibold" >Estimate fees:</h2>

              <div className="text-xs lg:text-sm dark:text-su_secondary font-normal flex items-center justify-between" >
                <p>Platform fee:</p>
                <p className="text-text dark:text-su_primary" >0.00 ETH</p>
              </div>
              <div className="text-xs lg:text-sm dark:text-su_secondary font-normal flex items-center justify-between" >
                <p>Current Gas:</p>
                <p className="text-text dark:text-su_primary" >$ 0.00045</p>
              </div>

              <div className="p-2 dark:bg-su_least_bg rounded-xs space-y-1" >

                <div className="text-xs lg:text-sm dark:text-su_secondary font-normal flex items-center justify-between" >
                  <p className="text-text dark:text-su_primary" >Total fees:</p>

                  <div className="flex gap-2" >
                    {/* icon will come here in future */}
                    <p className="text-su_primary" >$ 0.00045</p>
                  </div>
                </div>

                <p className="text-xs lg:text-sm dark:text-su_secondary" >
                  Interested in reducing fees?  {' '}
                  <AvoidingFeeDialog>
                    <span className="link-style" >View details</span>
                  </AvoidingFeeDialog>
                </p>
              </div>
            </div>

            {/* stay safe*/}



          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog >
  );
};

export default SwapHistoryDetailsDialog;