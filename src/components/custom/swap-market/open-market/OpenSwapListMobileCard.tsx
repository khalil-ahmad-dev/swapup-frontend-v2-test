import { SUI_OpenSwap } from '@/types/swap-market.types';
import React from 'react';
import CopyTile from '../../tiles/CopyTile';
import { getLastCharacters } from '@/lib/utils';
import { chainsDataset } from '@/constants/data';
import ChainTile from '../../tiles/ChainTile';
import { mapSwapTokensHelper, handleShowNotificationToast } from '@/lib/helpers';
import moment from 'moment';
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import OpenMarketListItemActionPopover from './OpenMarketListItemActionPopover';

interface IProp {
  swap: SUI_OpenSwap;
  handleNavigation: (swap: SUI_OpenSwap) => void;
  cardType?: "available" | "created";
  handleSwapCancel?: (swap: SUI_OpenSwap) => Promise<void>;
}

const OpenSwapListMobileCard = ({ swap, handleNavigation, cardType = "available", handleSwapCancel }: IProp) => {

  const currentChain = chainsDataset.find(chain => chain.uuid === swap.trading_chain) || chainsDataset[1];

  const handleIfAnyActionPropMissing = async (swap: SUI_OpenSwap) => {
    handleShowNotificationToast(
      'error',
      `Action props missing!`,
      'Mobile card component action props missing!'
    );
  };

  return (
    <section className='bg-su_secondary_bg rounded-lg space-y-4 py-4' >
      <aside className='flex flex-col gap-3 px-4'>
        {/* header */}
        <div className='flex items-center justify-between' >
          <div className='flex items-center gap-2'>
            <CopyTile
              textToCopy={swap.open_trade_id}
              className="flex text-xs lg:text-2xs !bg-transparent"
            >
              <span className="dark:text-su_primary">#{getLastCharacters(swap.open_trade_id, 7)}</span>
            </CopyTile>

            <ChainTile
              imageSrc={currentChain.iconUrl}
              title={currentChain.name}
              showChainTitleOnMobileScreen
              className='rounded-full px-2 bg-su_active_bg'
            />
          </div>


          {/* <Popover>
            <PopoverTrigger className='px-3 py-1.5 rounded-xs hover:bg-su_enable_bg cursor-pointer' >
              <svg
                className="w-1 cursor-pointer" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.00039 12.8C2.42474 12.8 2.8317 12.9686 3.13176 13.2686C3.43182 13.5687 3.60039 13.9757 3.60039 14.4C3.60039 14.8243 3.43182 15.2313 3.13176 15.5314C2.8317 15.8314 2.42474 16 2.00039 16C1.57604 16 1.16908 15.8314 0.86902 15.5314C0.568961 15.2313 0.400391 14.8243 0.400391 14.4C0.400391 13.9757 0.568961 13.5687 0.86902 13.2686C1.16908 12.9686 1.57604 12.8 2.00039 12.8ZM2.00039 6.4C2.42474 6.4 2.8317 6.56857 3.13176 6.86863C3.43182 7.16869 3.60039 7.57565 3.60039 8C3.60039 8.42435 3.43182 8.83131 3.13176 9.13137C2.8317 9.43143 2.42474 9.6 2.00039 9.6C1.57604 9.6 1.16908 9.43143 0.86902 9.13137C0.568961 8.83131 0.400391 8.42435 0.400391 8C0.400391 7.57565 0.568961 7.16869 0.86902 6.86863C1.16908 6.56857 1.57604 6.4 2.00039 6.4ZM2.00039 0C2.42474 0 2.8317 0.168571 3.13176 0.468629C3.43182 0.768687 3.60039 1.17565 3.60039 1.6C3.60039 2.02435 3.43182 2.43131 3.13176 2.73137C2.8317 3.03143 2.42474 3.2 2.00039 3.2C1.57604 3.2 1.16908 3.03143 0.86902 2.73137C0.568961 2.43131 0.400391 2.02435 0.400391 1.6C0.400391 1.17565 0.568961 0.768687 0.86902 0.468629C1.16908 0.168571 1.57604 0 2.00039 0Z" fill="#B6B6BD" />
              </svg>
            </PopoverTrigger>

            <PopoverContent
              align='start'
              className="max-w-52 px-2 pr-4 lg:pr-0 lg:px-3 py-3 bg-card dark:bg-su_least_bg lg:dark:bg-su_secondary_bg rounded-sm mr-10"
            >
              <button
                onClick={() => { handleNavigation(swap); }}
                className="action-popover-action-item"
              >
                <svg className='w-8' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.7284 11L22 15.1586H10.2385V14.0368H19.2184L16.9138 11.7931L17.7284 11ZM21.7615 16.8414V17.9632H12.7816L15.0862 20.2069L14.2716 21L10 16.8414H21.7615Z" fill="white" />
                </svg>

                Propose offer
              </button>
            </PopoverContent>
          </Popover> */}


          <OpenMarketListItemActionPopover
            cardType={cardType}
            handleSwapCancel={handleSwapCancel ? handleSwapCancel : handleIfAnyActionPropMissing}
            swap={swap}
            handleNavigation={handleNavigation}
          />

        </div>

        <div className='flex items-center gap-3' >
          {mapSwapTokensHelper(swap.metadata.init.tokens, 7)}
        </div>
      </aside>

      <div className='w-full border-b border-b-white/20' ></div>

      <aside className='flex flex-col gap-3 px-4'>

        <div className='grid grid-cols-3 gap-2' >

          <div className='space-y-1' >
            <h3 className='text-2xs text-su_secondary' >Owner`s wallet</h3>

            <CopyTile
              textToCopy={swap.init_address}
              className="flex !bg-transparent p-0"
            >
              <span className="dark:text-su_primary line-clamp-1 text-xs font-semibold w-3/5">{swap.init_address}</span>
            </CopyTile>
          </div>

          {/* Created Date */}
          <div className='space-y-1' >
            <h3 className='text-2xs text-su_secondary' >Open swap date</h3>
            <span className="dark:text-su_primary text-xs font-semibold w-3/4">{moment.utc(swap.created_at).format('MMM DD, YYYY')}</span>
          </div>

          {/* Expiry Date */}
          <div className='space-y-1' >
            <h3 className='text-2xs text-su_secondary' >Expiry date</h3>
            <span className="dark:text-su_primary text-xs font-semibold w-3/4">{moment.utc(swap.swap_preferences.expiration_date).local().format('MMM DD, YYYY')}</span>
          </div>

          {/* Swap Preferences */}
          <div className='space-y-1 col-span-3 text-xs' >
            <h3 className='text-2xs text-su_secondary' >Expiry date</h3>

            <div>
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
            </div>
          </div>

        </div>
      </aside>
    </section>
  );
};

export default OpenSwapListMobileCard;