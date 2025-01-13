import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { IOpenMarketSwapFilters } from '@/types/swap-market-store.types';
import AppliedFilterItemTile from '../../tiles/AppliedFilterItemTile';
import AppliedFilterSubItemTile from '../../tiles/AppliedFilterSubItemTile';
import RarityRankTile from '../../tiles/RarityRankTile';
import BadgeTile from '../../tiles/BadgeTile';

interface IProp {
  handleResetAppliedFilters: (resetType: "all" | "currency" | "nft" | "current-chain" | "offered-rarity-rank") => void;
  filters: IOpenMarketSwapFilters;
  className?: string;
}

const OpenMarketAppliedFiltersBar = ({ handleResetAppliedFilters, filters, className }: IProp) => {
  return (
    <ScrollArea
      className={cn(
        "w-full",
        className
      )}
    >
      <div className={cn("min-w-max lg:min-w-min flex items-center justify-between gap-6")}>

        <div className="flex items-center lg:flex-wrap gap-2 lg:gap-3">
          {filters.offersFromCurrentChain &&

            <AppliedFilterSubItemTile
              handleAction={() => handleResetAppliedFilters('current-chain')}
            >
              Only from the current chain
            </AppliedFilterSubItemTile>
          }

          {filters.offeredRarityRank &&
            <AppliedFilterItemTile label='Offered asset rarity rank:'>
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters('offered-rarity-rank')}
              >
                <RarityRankTile
                  from={filters.offeredRarityRank.from}
                  to={filters.offeredRarityRank.to}
                />
              </AppliedFilterSubItemTile>
            </AppliedFilterItemTile>
          }

          {filters.preferredAsset &&
            <AppliedFilterItemTile
              label='Swap preferences:'
            >
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters(filters.preferredAsset)}
                className={cn(
                  filters.preferredAsset === 'nft' ? 'uppercase' : 'capitalize'
                )}
                hideActionButton={filters.preferredAsset === "any"}
              >
                {filters.preferredAsset}
              </AppliedFilterSubItemTile>

              {(filters.collection && filters.rarityRank) &&
                <p className='flex items-center gap-1' >
                  <AppliedFilterSubItemTile
                    handleAction={() => { }}
                    hideActionButton
                  >
                    {filters.collection}
                  </AppliedFilterSubItemTile>

                  <AppliedFilterSubItemTile
                    handleAction={() => { }}
                    hideActionButton
                  >
                    <RarityRankTile
                      from={filters.rarityRank.from}
                      to={filters.rarityRank.to}
                    />
                  </AppliedFilterSubItemTile>

                </p>
              }

              {(filters.amountRangeFrom && filters.amountRangeTo && (filters.currencies && filters.currencies.length > 0)) &&
                <p className='flex items-center gap-1' >
                  <AppliedFilterSubItemTile
                    handleAction={() => { }}
                    hideActionButton
                  >

                    <RarityRankTile
                      from={filters.amountRangeFrom}
                      to={filters.amountRangeTo}
                      icon={
                        <svg className="w-2" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.33236 6.08366H9.99902C9.99902 3.71949 7.70319 2.64116 5.83236 2.39283V0.666992H4.16569V2.39283C2.29486 2.64116 -0.000976562 3.71949 -0.000976562 6.08366C-0.000976562 8.33866 2.22069 9.51116 4.16569 9.77533V13.917C2.95902 13.7078 1.66569 13.0637 1.66569 11.917H-0.000976562C-0.000976562 14.0745 2.01986 15.3495 4.16569 15.6137V17.3337H5.83236V15.6087C7.70319 15.3603 9.99902 14.2812 9.99902 11.917C9.99902 9.55282 7.70319 8.47449 5.83236 8.22616V4.08366C6.94069 4.28283 8.33236 4.86783 8.33236 6.08366ZM1.66569 6.08366C1.66569 4.86783 3.05736 4.28283 4.16569 4.08366V8.08283C3.02319 7.87199 1.66569 7.24783 1.66569 6.08366ZM8.33236 11.917C8.33236 13.1328 6.94069 13.7178 5.83236 13.917V9.91699C6.94069 10.1162 8.33236 10.7012 8.33236 11.917Z" fill="#868691" />
                        </svg>
                      }
                    />

                  </AppliedFilterSubItemTile>

                  {filters.currencies.map((currency, index) => {

                    return (
                      <BadgeTile
                        key={currency.uuid}
                        className='rounded-xs font-semibold lg:text-sm flex items-center gap-2'
                      >
                        <img src={currency.iconUrl} alt="" className='w-4 h-4' />
                        {currency.name}
                      </BadgeTile>
                    );
                  })}
                </p>
              }

            </AppliedFilterItemTile>
          }

        </div>

        <span
          className="text-sm font-semibold py-2 px-3 hover:bg-su_enable_bg cursor-pointer flex items-center gap-2 rounded-xs"
          onClick={() => handleResetAppliedFilters('all')}
        >
          Clear all

          <svg className="w-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.1194 1.94157L11.6497 1.41124L10.5891 0.350586L10.0587 0.880919L6.00069 4.939L1.94265 0.880919L1.41232 0.350586L0.351652 1.41124L0.88198 1.94157L4.94003 5.99967L0.88189 10.0578L0.351562 10.5882L1.41223 11.6488L1.94256 11.1185L6.00069 7.06033L10.0588 11.1185L10.5891 11.6488L11.6498 10.5882L11.1195 10.0578L7.06134 5.99967L11.1194 1.94157Z" fill="#B6B6BD" />
          </svg>
        </span>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea >
  );
};

export default OpenMarketAppliedFiltersBar;