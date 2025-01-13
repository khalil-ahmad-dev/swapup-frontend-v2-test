import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { IPrivateMarketSwapFilters } from '@/types/swap-market-store.types';

import AppliedFilterItemTile from '../../tiles/AppliedFilterItemTile';
import AppliedFilterSubItemTile from '../../tiles/AppliedFilterSubItemTile';
import RarityRankTile from '../../tiles/RarityRankTile';

import BadgeTile from '../../tiles/BadgeTile';
import moment from 'moment';

interface IProp {
  handleResetAppliedFilters: (resetType: "all" | "date" | "status" | "current-chain") => void;
  filters: IPrivateMarketSwapFilters;
  className?: string;
}

const PrivateMarketAppliedFiltersBar = ({ handleResetAppliedFilters, filters, className }: IProp) => {
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

          {filters.swapRequestStatus &&
            <AppliedFilterItemTile label='Status:'>
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters('status')}
                className='capitalize'
              >
                {filters.swapRequestStatus}
              </AppliedFilterSubItemTile>
            </AppliedFilterItemTile>
          }

          {(filters.dateRangeFrom && filters.dateRangeTo) &&
            <AppliedFilterItemTile label='Status:'>
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters('date')}
                className='capitalize'
              >
                <RarityRankTile
                  from={moment.utc(filters.dateRangeFrom).format('MMM DD, YYYY')}
                  to={moment.utc(filters.dateRangeTo).format('MMM DD, YYYY')}
                  icon={
                    <svg className="w-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 5.5H12V11.4C12 11.5591 11.9368 11.7117 11.8243 11.8243C11.7117 11.9368 11.5591 12 11.4 12H0.6C0.44087 12 0.288258 11.9368 0.175736 11.8243C0.0632141 11.7117 0 11.5591 0 11.4V5.5ZM9 1H11.4C11.5591 1 11.7117 1.06321 11.8243 1.17574C11.9368 1.28826 12 1.44087 12 1.6V4H0V1.6C0 1.44087 0.0632141 1.28826 0.175736 1.17574C0.288258 1.06321 0.44087 1 0.6 1H3V0H4.2V1H7.8V0H9V1Z" fill="white" />
                    </svg>
                  }
                />
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

export default PrivateMarketAppliedFiltersBar;