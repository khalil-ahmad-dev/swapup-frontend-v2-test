import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface IProp {
  from: string | Number;
  to: string | Number;
  className?: string;
  icon?: any;
}

const RarityRankTile = ({ from, to, className, icon }: IProp) => {
  return (
    <span
      className={cn(
        "flex gap-2 items-center capitalize text-su_primary font-semibold text-xs lg:text-sm",
        className
      )}
    >
      {icon ?
        icon :
        <svg className='w-3' viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.7175 2.85714L6 0L4.2825 2.85714H7.7175ZM1.7175 7.14286L0 10H12L10.2825 7.14286H1.7175ZM9.855 6.42857L8.145 3.57143H3.855L2.145 6.42857H9.855Z" fill="white" />
        </svg>
      }

      <>{from as ReactNode} - {to as ReactNode}</>
    </span>
  );
};

export default RarityRankTile;