import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactElement } from "react";
import LoadingIcon from "./LoadingIcon";

interface IProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactElement | string;
  isLoading?: boolean;
}

const CustomIconButton = ({ className, children, isLoading = false, ...props }: IProp) => {
  return (
    <button
      className={cn(
        `p-2 rounded-full text-su_secondary hover:bg-su_active_bg hover:text-su_primary disabled:text-su_disabled disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer`,
        isLoading && "cursor-not-allowed pointer-events-none",
        className,
      )}
      {...props}
    >

      {isLoading ?
        <LoadingIcon />
        :
        <>{children}</>
      }
    </button>
  );
};

export default CustomIconButton;