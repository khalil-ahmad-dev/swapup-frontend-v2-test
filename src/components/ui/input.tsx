import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
  suffix?: React.ReactElement | string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, suffix, ...props }, ref) => {
    return (
      <div className={cn(
        "relative flex items-center gap-3 rounded-md text-xs lg:text-sm ring-offset-su_active_bg focus-within:ring-1 focus-within:ring-su_active_bg focus-within:ring-offset-1",
        error && "ring-2 ring-su_negative focus-within:ring-1 focus-within:ring-su_negative",
        className,
      )}>
        {icon}
        <input
          type={type}
          className={cn(
            "w-full caret-su_brand placeholder:text-su_secondary dark:text-su_primary focus-visible:outline-none disabled:cursor-not-allowed bg-transparent",
            type === 'number' && "hide-number-input-buttons"
          )

          }
          ref={ref}
          {...props}
          autoComplete="off"
        />

        {
          suffix &&
          <span
            className="absolute h-full top-0 right-0 bg-su_enable_bg text-xs lg:text-sm px-4 flex items-center rounded-tr-sm rounded-br-sm"
          >
            {suffix}
          </span>
        }
      </div>

    );
  }
);
Input.displayName = "Input";

export { Input };
