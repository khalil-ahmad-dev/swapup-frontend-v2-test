import { cn } from '@/lib/utils';
import { SUI_SwapCurrencyItem } from '@/types/swap-market.types';
import React from 'react';

interface IProp {
  className?: string;
  currency: SUI_SwapCurrencyItem;
  hideCross?: boolean;
  CandleCrossClick?: () => void;
}

const SelectedCurrencyTile = ({ className, currency, hideCross = false, CandleCrossClick = () => { }, ...props }: IProp) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-2 py-2 bg-su_enable_bg text-su_primary rounded-sm",
        className
      )}
      {...props}
    >
      <img src={currency.iconUrl} alt="" className="mt-1 w-4 h-4 object-cover" />

      <div className="w-full leading-tight text-xs">
        <p className="flex items-center justify-between" >
          <span className="text-su_primary font-normal" >{currency.amount} {currency.symbol}</span>

          {!hideCross &&
            <span
              className="p-2 rounded-full hover:bg-su_active_bg cursor-pointer"
              onClick={CandleCrossClick}
            >
              <svg className="w-2" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.47177 1.58902L8.00207 1.05866L6.94137 -0.00195312L6.41106 0.528399L4.00006 2.9396L1.58906 0.528399L1.05875 -0.00195312L-0.00195312 1.05866L0.528355 1.58902L2.93944 4.0003L0.528356 6.41159L-0.00195312 6.94194L1.05875 8.00256L1.58906 7.47221L4.00006 5.06101L6.41106 7.47221L6.94137 8.00256L8.00207 6.94194L7.47176 6.41159L5.06068 4.0003L7.47177 1.58902Z" fill="#B6B6BD" />
              </svg>
            </span>
          }
        </p>

        <span className="text-su_secondary"  >$ {currency.usdAmount}</span>
      </div>
    </div>
  );
};

export default SelectedCurrencyTile;