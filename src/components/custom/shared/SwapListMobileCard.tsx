import React from 'react';
import { SUI_OpenSwap, SUI_Swap } from '@/types/swap-market.types';
import { cn, getLastCharacters } from '@/lib/utils';
import { chainsDataset } from '@/constants/data';
import { mapSwapTokensHelper, handleShowNotificationToast } from '@/lib/helpers';
import moment from 'moment';

import CopyTile from '../tiles/CopyTile';
import ChainTile from '../tiles/ChainTile';
import BadgeTile from '../tiles/BadgeTile';
import { useProfileStore } from '@/store/profile';
import { SUE_SWAP_MODE, SUE_SWAP_MODE_TO_STRING, SUE_SWAP_OFFER_TYPE_TO_STRING, SUE_SWAP_STATUS, SUE_SWAP_STATUS_TO_STRING } from '@/constants/enums';
import SwapListItemActionPopover from './SwapListItemActionPopover';
import SwapHistoryDetailsDialog from '../my-swaps/SwapHistoryDetailsDialog';
import { SUI_SwapCreation } from '@/types/global.types';
import LoadingIcon from './LoadingIcon';

interface IProp {
  swap: SUI_OpenSwap | SUI_Swap;
  handleSwapAccept?: (swap: SUI_Swap | SUI_OpenSwap) => Promise<void>;
  handleSwapCancel?: (swap: SUI_Swap | SUI_OpenSwap) => Promise<void>;
  handleSwapReject?: (swap: SUI_Swap | SUI_OpenSwap) => Promise<void>;
  swapCancel: SUI_SwapCreation;
  swapRejection: SUI_SwapCreation;
  swapAcceptance: SUI_SwapCreation;
  swapCardType: 'private-party' | 'pending' | 'history';
}

const SwapListMobileCard = ({ swap, swapCardType = "private-party", handleSwapAccept, handleSwapCancel, handleSwapReject, swapAcceptance, swapCancel, swapRejection }: IProp) => {

  const [wallet] = useProfileStore(state => [state.profile.wallet]);
  const currentChain = chainsDataset.find(chain => chain.uuid === swap.trading_chain) || chainsDataset[1];

  const handleIfAnyActionPropMissing = async (swap: SUI_OpenSwap | SUI_Swap) => {
    handleShowNotificationToast(
      'error',
      `Action props missing!`,
      'Mobile card component action props missing!'
    );
  };

  return (
    <section className='bg-su_secondary_bg rounded-lg space-y-5 py-3' >
      <aside className='flex flex-col gap-3 px-2.5'>
        {/* header */}
        <div className='flex items-center justify-between' >
          <div className='flex items-center gap-2'>
            <CopyTile
              textToCopy={swap.trade_id}
              className="flex text-xs lg:text-2xs !bg-transparent"
            >
              <span className="dark:text-su_primary">#{getLastCharacters(swap.trade_id, 7)}</span>
            </CopyTile>

            <div className='flex items-center gap-1' >
              <ChainTile
                imageSrc={currentChain.iconUrl}
                title={currentChain.name}
                className='rounded-full bg-su_active_bg'
                showChainTitleOnMobileScreen={false}
              />

              {
                (swap.init_address === wallet.address) ?
                  <BadgeTile className='normal-case text-2xs' >
                    <svg className="w-2.5" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                      <path d="M3.846 3.39353L3 2.64706L6 0L9 2.64706L8.154 3.39353L6.6 2.02765L6.6 7.14706H5.4L5.4 2.02765L3.846 3.39353Z" fill="white" />
                    </svg>

                    Sent
                  </BadgeTile>

                  :
                  <BadgeTile className='normal-case text-2xs' >
                    <svg className="w-3" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                      <path d="M3.846 3.75353L3 4.5L6 7.14706L9 4.5L8.154 3.75353L6.6 5.11941L6.6 4.62827e-08L5.4 0L5.4 5.11941L3.846 3.75353Z" fill="white" />
                    </svg>

                    Received
                  </BadgeTile>
              }

              {swapCardType !== 'private-party' &&
                <BadgeTile className='normal-case text-2xs gap-1' >
                  <span className='capitalize' >{SUE_SWAP_MODE_TO_STRING[`value${swap.swap_mode}`]}</span>
                  {(swap.swap_mode === SUE_SWAP_MODE.OPEN) ? "market" : "party"}
                </BadgeTile>
              }
            </div>
          </div>


          {swapCardType !== 'history' &&
            (
              (swapCancel.isLoading || swapRejection.isLoading || swapAcceptance.isLoading) ?
                <LoadingIcon />
                :
                <SwapListItemActionPopover
                  swap={swap}
                  handleSwapAccept={handleSwapAccept ? handleSwapAccept : handleIfAnyActionPropMissing}
                  handleSwapCancel={handleSwapCancel ? handleSwapCancel : handleIfAnyActionPropMissing}
                  handleSwapReject={handleSwapReject ? handleSwapReject : handleIfAnyActionPropMissing}
                  swapCancel={swapCancel}
                  swapRejection={swapRejection}
                  swapAcceptance={swapAcceptance}
                />
            )
          }

          {swapCardType === 'history' &&
            <SwapHistoryDetailsDialog swap={swap as SUI_OpenSwap}>
              <svg className='w-4 mr-2' viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.3C7.42135 3.3 6.86639 3.53178 6.45722 3.94436C6.04805 4.35695 5.81818 4.91652 5.81818 5.5C5.81818 6.08348 6.04805 6.64306 6.45722 7.05564C6.86639 7.46822 7.42135 7.7 8 7.7C8.57865 7.7 9.13361 7.46822 9.54278 7.05564C9.95195 6.64306 10.1818 6.08348 10.1818 5.5C10.1818 4.91652 9.95195 4.35695 9.54278 3.94436C9.13361 3.53178 8.57865 3.3 8 3.3ZM8 9.16667C7.03558 9.16667 6.11065 8.78036 5.4287 8.09272C4.74675 7.40509 4.36364 6.47246 4.36364 5.5C4.36364 4.52754 4.74675 3.59491 5.4287 2.90728C6.11065 2.21964 7.03558 1.83333 8 1.83333C8.96442 1.83333 9.88935 2.21964 10.5713 2.90728C11.2532 3.59491 11.6364 4.52754 11.6364 5.5C11.6364 6.47246 11.2532 7.40509 10.5713 8.09272C9.88935 8.78036 8.96442 9.16667 8 9.16667ZM8 0C4.36364 0 1.25818 2.28067 0 5.5C1.25818 8.71933 4.36364 11 8 11C11.6364 11 14.7418 8.71933 16 5.5C14.7418 2.28067 11.6364 0 8 0Z" fill="#B6B6BD" />
              </svg>
            </SwapHistoryDetailsDialog>
          }

        </div>

        <div className='flex items-center gap-2' >
          <div className='flex items-center gap-1.5' >
            {mapSwapTokensHelper(swap.metadata.init.tokens, 4)}
          </div>

          <svg className='w-2.5' viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.72844 0L12 4.15863H0.238525V3.0368H9.21836L6.91377 0.793135L7.72844 0ZM11.7615 5.84137V6.9632H2.78164L5.08623 9.20687L4.27156 10L0 5.84137H11.7615Z" fill="#868691" />
          </svg>

          <div className='flex items-center gap-1.5' >
            {mapSwapTokensHelper(swap.metadata.accept.tokens, 4)}
          </div>
        </div>
      </aside>

      <div className='w-full border-b border-b-white/20' ></div>

      <aside className='flex flex-col gap-3 px-2.5'>
        <div className={`grid gap-2 ${swapCardType === 'private-party' ? "grid-cols-4" : "grid-cols-3"}`} >

          <div className={`${swapCardType === 'private-party' ? "col-span-2" : "col-span-1"} space-y-1`} >
            <h3 className='text-2xs text-su_secondary' >Owner`s wallet</h3>

            <CopyTile
              textToCopy={swap.init_address}
              className="flex !bg-transparent p-0"
            >
              <span className="dark:text-su_primary line-clamp-1 text-xs font-semibold w-3/5">{swap.init_address}</span>
            </CopyTile>
          </div>

          {/* Created Date or offer review date */}
          <div className={`${swapCardType === 'private-party' ? "col-span-2" : "col-span-1"} space-y-1`} >
            <h3 className='text-2xs text-su_secondary' >
              {swapCardType !== 'history' ? "Creation date" : "Offer review date"}
            </h3>
            <span className="dark:text-su_primary text-xs font-semibold w-3/4">
              {swapCardType !== 'history' ?
                moment.utc(swap.updated_at).format('MMM DD, YYYY')
                :
                moment.utc(swap.created_at).format('MMM DD, YYYY')
              }
            </span>
          </div>

          {/* type or status */}
          {swapCardType !== "private-party" &&
            <div className='space-y-1' >
              <h3 className='text-2xs text-su_secondary' >
                {swapCardType === 'pending' && 'Type'}
                {swapCardType === 'history' && 'Status'}
              </h3>
              <span className="dark:text-su_primary text-xs font-semibold w-3/4 capitalize">
                {swapCardType === 'pending' &&
                  SUE_SWAP_OFFER_TYPE_TO_STRING[`value${swap.offer_type}`] + " offer"
                }

                {swapCardType === 'history' &&
                  <div className="w-auto flex items-center gap-2" >
                    <span
                      className={cn(
                        "rounded-full w-1.5 h-1.5 ",
                        swap.status === SUE_SWAP_STATUS.COMPLETED && "bg-su_positive",
                        swap.status === SUE_SWAP_STATUS.DECLINED && "bg-su_negative",
                        swap.status === SUE_SWAP_STATUS.CANCELED && "bg-su_negative",
                        swap.status === SUE_SWAP_STATUS.PENDING && "bg-su_info",
                      )}
                    >
                    </span>

                    <span className='capitalize' >
                      {SUE_SWAP_STATUS_TO_STRING[`value${swap.status!}`]}
                    </span>
                  </div>
                }
              </span>
            </div>
          }

        </div>
      </aside>
    </section >
  );
};

export default SwapListMobileCard;