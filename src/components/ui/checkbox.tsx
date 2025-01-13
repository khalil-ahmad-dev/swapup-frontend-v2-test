import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  isError?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, isError, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "group flex items-center justify-center peer h-4 w-4 shrink-0 rounded-[2px] border-2 border-su_ternary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-su_disabled disabled:bg-su_disabled disabled:data-[state=checked]:disabled-gradient data-[state=checked]:border-none data-[state=checked]:bg-gradient-primary data-[state=checked]:text-primary-foreground",
      className,
      isError && "border-su_negative data-[state=checked]:bg-su_negative"
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    />
    <svg className="w-2.5 text-transparent group-data-[state=checked]:text-su_secondary_bg" viewBox="0 0 12 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.19632 8L0 4.2079L1.04908 3.25988L4.19632 6.10395L10.9509 0L12 0.948025L4.19632 8Z" fill="currentColor" />
    </svg>

  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
