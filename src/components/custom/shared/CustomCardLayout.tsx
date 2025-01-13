import { cn } from '@/lib/utils';
import React from 'react';

interface IProp {
  className?: string;
  title?: string;
  children?: any;
}

const CustomCardLayout = ({ className, title, children, ...props }: IProp) => {
  return (
    <div
      className={cn(
        "custom-border-card space-y-2 w-full lg:w-auto",
        "border-[1px] border-su_enable_bg",
        className
      )}
      {...props}
    >
      {title &&
        <h2 className="text-su_primary font-semibold text-sm border-b border-b-su_enable_bg pb-2">
          {title}
        </h2>
      }

      {children}
    </div>
  );
};

export default CustomCardLayout;