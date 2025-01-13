import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import moment from 'moment';
import AppliedFilterSubItemTile from '../tiles/AppliedFilterSubItemTile';
import AppliedFilterItemTile from '../tiles/AppliedFilterItemTile';
import { IHistoryFilters } from '@/types/my-swaps-store.types';

interface IProp {
  handleResetAppliedFilters: (resetType: "all" | "swap-mode" | "swap-status" | "current-chain" | "request-date") => void;
  filters: IHistoryFilters;
  className?: string;
}

const HistorySwapAppliedFiltersBar = ({ handleResetAppliedFilters, filters, className }: IProp) => {
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

          {filters.swapStatus &&
            <AppliedFilterItemTile label='Request status:'>
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters('swap-status')}
                className='capitalize'
                hideActionButton={filters.swapStatus === "all"}
              >
                <div className="w-auto flex items-center gap-2" >
                  <span
                    className={cn(
                      "rounded-full w-1.5 h-1.5 ",
                      filters.swapStatus === "completed" && "bg-su_positive",
                      filters.swapStatus === "declined" && "bg-su_negative",
                      filters.swapStatus === "canceled" && "bg-su_negative",
                    )}
                  >
                  </span>

                  <span className='capitalize' >
                    {filters.swapStatus}
                  </span>
                </div>
              </AppliedFilterSubItemTile>
            </AppliedFilterItemTile>
          }

          {filters.swapMode &&
            <AppliedFilterItemTile label='Swap mode:'>
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters('swap-mode')}
                className='capitalize'
                hideActionButton={filters.swapMode === 'all'}
              >
                {filters.swapMode.replace("-", " ")}
              </AppliedFilterSubItemTile>
            </AppliedFilterItemTile>
          }

          {filters.requestedDate &&
            <AppliedFilterItemTile label='Request date:'>
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters('request-date')}
                className='capitalize'
              >
                {moment(filters.requestedDate).format('MMM Do, YYYY')}
              </AppliedFilterSubItemTile>
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

export default HistorySwapAppliedFiltersBar;