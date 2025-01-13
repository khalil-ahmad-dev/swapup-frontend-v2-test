import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import LoadingIcon from "../custom/shared/LoadingIcon";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "gradient-button",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-full border-2 border-su_disabled disabled:text-su_disabled bg-background dark:bg-su_secondary_bg text-foreground font-semibold text-sm capitalize",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "",
        link: "text-primary underline-offset-4 hover:underline",
        reject: "bg-gradient-reject text-su_primary font-semibold text-sm capitalize disabled:text-su_disabled rounded-full",
      },
      size: {
        default: "px-5 py-3",
        sm: "rounded-md px-3",
        lg: "rounded-md px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children: any;
  iconButton?: boolean;
  iconLocation?: "left" | "right";
  icon?: SVGAElement | JSX.IntrinsicElements["svg"] | React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, iconButton = false, iconLocation = 'left', icon, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // if (isLoading) {
    //   props.disabled = true;
    // }

    const foundIcon = icon ? icon :
      <svg className="w-3.5" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.3346 0.888021H9.41797L8.58464 0.0546875H4.41797L3.58464 0.888021H0.667969V2.55469H12.3346M1.5013 13.388C1.5013 13.83 1.6769 14.254 1.98946 14.5665C2.30202 14.8791 2.72594 15.0547 3.16797 15.0547H9.83463C10.2767 15.0547 10.7006 14.8791 11.0131 14.5665C11.3257 14.254 11.5013 13.83 11.5013 13.388V3.38802H1.5013V13.388Z" fill="white" />
      </svg>;

    return (
      <Comp
        className={cn(
          isLoading && "cursor-wait",
          isLoading || iconButton ? "flex items-center gap-2" : "",
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      >
        {(iconLocation === 'left' && isLoading) && <LoadingIcon />}
        {(iconButton && iconLocation === 'left' && !isLoading) && foundIcon}

        {children}

        {(iconLocation === 'right' && isLoading) && <LoadingIcon />}
        {(iconButton && iconLocation === 'right' && !isLoading) && foundIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
