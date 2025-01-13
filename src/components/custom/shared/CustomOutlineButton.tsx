import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactElement } from "react";
import LoadingIcon from "./LoadingIcon";

interface IProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  containerClasses?: string;
  children?: ReactElement | string | React.ReactNode;
  isLoading?: boolean;
  iconButton?: boolean;
  iconLocation?: "left" | "right";
  icon?: ReactElement;
}

const CustomOutlineButton = ({ className, children, containerClasses, isLoading = false, icon, iconButton = false, iconLocation = "left", ...props }: IProp) => {

  const foundIcon = icon ? icon :
    <svg className="w-3.5" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.3346 0.888021H9.41797L8.58464 0.0546875H4.41797L3.58464 0.888021H0.667969V2.55469H12.3346M1.5013 13.388C1.5013 13.83 1.6769 14.254 1.98946 14.5665C2.30202 14.8791 2.72594 15.0547 3.16797 15.0547H9.83463C10.2767 15.0547 10.7006 14.8791 11.0131 14.5665C11.3257 14.254 11.5013 13.83 11.5013 13.388V3.38802H1.5013V13.388Z" fill="white" />
    </svg>;

  return (
    <button
      className={cn(
        `group bg-gradient-primary p-[2px] rounded-full disabled:text-su_disabled disabled:disabled-gradient cursor-pointer`,
        containerClasses
      )}
      {...props}
    >
      <div
        className={cn(
          `group-disabled:text-su_disabled w-full h-full rounded-full flex justify-center items-center gap-2 bg-background dark:bg-su_secondary_bg text-foreground font-semibold text-sm capitalize cursor-pointer`,
          className
        )}
      >
        {(iconLocation === 'left' && isLoading) && <LoadingIcon />}
        {(iconButton && iconLocation === 'left' && !isLoading) && foundIcon}

        {children}

        {(iconLocation === 'right' && isLoading) && <LoadingIcon />}
        {(iconButton && iconLocation === 'right' && !isLoading) && foundIcon}
      </div>
    </button>
  );
};

export default CustomOutlineButton;