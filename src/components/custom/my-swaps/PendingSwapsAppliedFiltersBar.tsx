import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import moment from 'moment';
import AppliedFilterSubItemTile from '../tiles/AppliedFilterSubItemTile';
import AppliedFilterItemTile from '../tiles/AppliedFilterItemTile';
import { IPendingFilters } from '@/types/my-swaps-store.types';

interface IProp {
  handleResetAppliedFilters: (resetType: "all" | "swap-mode" | "request-status" | "current-chain" | "request-date") => void;
  filters: IPendingFilters;
  className?: string;
}

const PendingSwapsAppliedFiltersBar = ({ handleResetAppliedFilters, filters, className }: IProp) => {
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
            <AppliedFilterItemTile label='Request status:'>
              <AppliedFilterSubItemTile
                handleAction={() => handleResetAppliedFilters('request-status')}
                className='capitalize'
                hideActionButton={filters.swapRequestStatus === 'all'}
              >
                <span className='flex items-center gap-2' >
                  {filters.swapRequestStatus === 'sent' &&
                    <svg className="w-3" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                      <path d="M3.846 3.39353L3 2.64706L6 0L9 2.64706L8.154 3.39353L6.6 2.02765L6.6 7.14706H5.4L5.4 2.02765L3.846 3.39353Z" fill="white" />
                    </svg>
                  }

                  {filters.swapRequestStatus === 'received' &&
                    <svg className="w-3" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3.17647V7.94118C12 8.52353 11.46 9 10.8 9H1.2C0.54 9 -2.88495e-08 8.52353 0 7.94118L2.36042e-07 3.17647C2.64891e-07 2.59412 0.54 2.11765 1.2 2.11765H2.4V3.17647L1.2 3.17647L1.2 7.94118H10.8V3.17647H9.6V2.11765H10.8C11.46 2.11765 12 2.59412 12 3.17647Z" fill="white" />
                      <path d="M3.846 3.75353L3 4.5L6 7.14706L9 4.5L8.154 3.75353L6.6 5.11941L6.6 4.62827e-08L5.4 0L5.4 5.11941L3.846 3.75353Z" fill="white" />
                    </svg>
                  }

                  {filters.swapRequestStatus}
                </span>
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
            <AppliedFilterItemTile
              label='Request date:'
            >
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

export default PendingSwapsAppliedFiltersBar;