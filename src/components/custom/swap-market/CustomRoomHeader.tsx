import { cn, getLastCharacters } from '@/lib/utils';
import CopyTile from '../tiles/CopyTile';
import { SUI_SwapPreferences } from '@/types/swap-market.types';
import SwapParameterTile from '../tiles/SwapParameterTile';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import SelectedCurrencyTile from '../tiles/SelectedCurrencyTile';

interface IProp {
  title: string;
  className?: string;
  tardeId: string;
  children?: any;
  swapPreferences?: SUI_SwapPreferences | null;
  showOpenMarketTile?: boolean;
  showPrivateMarketTile?: boolean;
}

const CustomRoomHeader = ({ title, className, tardeId, children, swapPreferences, showOpenMarketTile = false, showPrivateMarketTile = false }: IProp) => {

  return (
    <header
      className={cn(
        'absolute w-full left-0 top-0 z-50 su-px bg-su_secondary_bg py-4 flex flex-col gap-4 lg:gap-2 border-b border-b-su_enable_bg',
        className
      )}
    >
      <div className='flex items-center justify-between gap-4 lg:gap-0' >
        <img
          src="/assets/logos/swapup-logo-white.svg"
          alt="SwapUp"
          className="w-20 lg:w-auto lg:h-6 cursor-pointer"
        />

        <h2 className="font-semibold text-lg lg:text-1.5xl lg:pl-16 line-clamp-1">
          {title}
        </h2>

        <CopyTile textToCopy={tardeId} >
          <span className='hidden lg:block' >
            Unique trade ID:
          </span>
          <span className="dark:text-su_primary font-semibold">#{getLastCharacters(tardeId, 7)}</span>
        </CopyTile>
      </div>

      <div className='flex flex-col lg:flex-row gap-3 lg:gap-4 rounded-sm border border-su_enable_bg bg-su_tag_periwinkle' >
        {children}
      </div>

      <ScrollArea
        className={cn("w-full")}
      >
        <div className='min-w-max flex justify-center items-center gap-2' >
          {showOpenMarketTile &&
            <span className="tile-design text-su_primary font-semibold" >
              <svg className="w-3.5" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C7.54148 0 8.06079 0.228879 8.44368 0.636285C8.82656 1.04369 9.04167 1.59625 9.04167 2.17241C9.04167 2.74857 8.82656 3.30114 8.44368 3.70854C8.06079 4.11595 7.54148 4.34483 7 4.34483C6.45852 4.34483 5.93921 4.11595 5.55632 3.70854C5.17344 3.30114 4.95833 2.74857 4.95833 2.17241C4.95833 1.59625 5.17344 1.04369 5.55632 0.636285C5.93921 0.228879 6.45852 0 7 0ZM2.91667 1.55172C3.24333 1.55172 3.54667 1.64483 3.80917 1.81241C3.72167 2.7 3.96667 3.58138 4.46833 4.27034C4.17667 4.86621 3.59333 5.27586 2.91667 5.27586C2.45254 5.27586 2.00742 5.07968 1.67923 4.73047C1.35104 4.38127 1.16667 3.90764 1.16667 3.41379C1.16667 2.91994 1.35104 2.44632 1.67923 2.09711C2.00742 1.74791 2.45254 1.55172 2.91667 1.55172ZM11.0833 1.55172C11.5475 1.55172 11.9926 1.74791 12.3208 2.09711C12.649 2.44632 12.8333 2.91994 12.8333 3.41379C12.8333 3.90764 12.649 4.38127 12.3208 4.73047C11.9926 5.07968 11.5475 5.27586 11.0833 5.27586C10.4067 5.27586 9.82333 4.86621 9.53167 4.27034C10.04 3.57159 10.2761 2.69141 10.1908 1.81241C10.4533 1.64483 10.7567 1.55172 11.0833 1.55172ZM3.20833 7.91379C3.20833 6.62897 4.90583 5.58621 7 5.58621C9.09417 5.58621 10.7917 6.62897 10.7917 7.91379V9H3.20833V7.91379ZM0 9V8.06896C0 7.20621 1.1025 6.48 2.59583 6.26897C2.25167 6.69103 2.04167 7.27448 2.04167 7.91379V9H0ZM14 9H11.9583V7.91379C11.9583 7.27448 11.7483 6.69103 11.4042 6.26897C12.8975 6.48 14 7.20621 14 8.06896V9Z" fill="white" />
              </svg>

              Open Market
            </span>
          }

          {showPrivateMarketTile &&
            <span className="tile-design text-su_primary font-semibold" >
              <svg className="w-3.5" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4.66667L4.77273 2.33333L7 0L9.22727 2.33333L7 4.66667ZM0 12V9.33333C0 8.95556 0.124727 8.63889 0.374182 8.38333C0.623636 8.12778 0.923151 8 1.27273 8H3.35682C3.56894 8 3.77045 8.05556 3.96136 8.16667C4.15227 8.27778 4.30606 8.42778 4.42273 8.61667C4.7303 9.05 5.10958 9.38889 5.56054 9.63333C6.01151 9.87778 6.49133 10 7 10C7.5197 10 8.00503 9.87778 8.456 9.63333C8.90697 9.38889 9.28073 9.05 9.57727 8.61667C9.71515 8.42778 9.877 8.27778 10.0628 8.16667C10.2486 8.05556 10.4421 8 10.6432 8H12.7273C13.0879 8 13.3901 8.12778 13.6341 8.38333C13.878 8.63889 14 8.95556 14 9.33333V12H9.54545V10.4833C9.17424 10.7611 8.77376 10.9722 8.344 11.1167C7.91424 11.2611 7.46624 11.3333 7 11.3333C6.54394 11.3333 6.09848 11.2584 5.66364 11.1087C5.22879 10.9589 4.82576 10.7449 4.45455 10.4667V12H0ZM1.90909 7.33333C1.37879 7.33333 0.92803 7.13889 0.556818 6.75C0.185606 6.36111 0 5.88889 0 5.33333C0 4.76667 0.185606 4.29178 0.556818 3.90867C0.92803 3.52556 1.37879 3.33378 1.90909 3.33333C2.45 3.33333 2.90351 3.52511 3.26964 3.90867C3.63576 4.29222 3.81861 4.76711 3.81818 5.33333C3.81818 5.88889 3.63533 6.36111 3.26964 6.75C2.90394 7.13889 2.45042 7.33333 1.90909 7.33333ZM12.0909 7.33333C11.5606 7.33333 11.1098 7.13889 10.7386 6.75C10.3674 6.36111 10.1818 5.88889 10.1818 5.33333C10.1818 4.76667 10.3674 4.29178 10.7386 3.90867C11.1098 3.52556 11.5606 3.33378 12.0909 3.33333C12.6318 3.33333 13.0853 3.52511 13.4515 3.90867C13.8176 4.29222 14.0004 4.76711 14 5.33333C14 5.88889 13.8172 6.36111 13.4515 6.75C13.0858 7.13889 12.6322 7.33333 12.0909 7.33333Z" fill="white" />
              </svg>

              Private party
            </span>
          }


          {
            swapPreferences &&
            <div className="flex items-center gap-2" >
              <p className="text-xs text-su_ternary font-normal" >Swap preferences:</p>

              {swapPreferences.preferred_asset.type === 'nft' &&
                <div className="flex items-center gap-2" >
                  <SwapParameterTile
                    className='capitalize'
                    title="Collection:"
                    value={swapPreferences.preferred_asset.parameters.collection}
                  />

                  <SwapParameterTile
                    title="Rarity rank:"
                    value={
                      <span className="flex items-center gap-2" >
                        <svg className="w-3 pb-0.5" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.7175 2.85714L6 0L4.2825 2.85714H7.7175ZM1.7175 7.14286L0 10H12L10.2825 7.14286H1.7175ZM9.855 6.42857L8.145 3.57143H3.855L2.145 6.42857H9.855Z" fill="white" />
                        </svg>

                        <>{swapPreferences.preferred_asset.parameters.rank?.from} - {swapPreferences.preferred_asset.parameters.rank?.to}</>
                      </span>
                    }
                  />
                </div>
              }

              {swapPreferences.preferred_asset.type === 'any' &&
                <div className="flex items-center gap-2" >

                  <SwapParameterTile
                    title="Any"
                    valueClasses="uppercase"
                  />
                </div>
              }

              {swapPreferences.preferred_asset.type === 'currency' &&
                <div className="flex items-center gap-2" >
                  {
                    (swapPreferences.preferred_asset.parameters.preferred_currency && swapPreferences.preferred_asset.parameters.preferred_currency.length > 0) &&

                    <SwapParameterTile
                      title="Currencies:"
                      className='py-[4px] px-1.5'
                      value={
                        <div className="flex items-center gap-2 flex-wrap" >
                          {
                            swapPreferences.preferred_asset.parameters.preferred_currency.map((currency, index) => (
                              <SelectedCurrencyTile
                                key={currency.uuid + "-" + index}
                                currency={currency}
                                hideCross
                              />
                            ))
                          }
                        </div>
                      }
                    />
                  }
                </div>
              }
            </div>
          }
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea >

    </header>
  );
};

export default CustomRoomHeader;