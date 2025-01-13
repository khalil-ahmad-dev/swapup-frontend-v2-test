import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactElement } from "react";
import LoadingIcon from "./LoadingIcon";

interface IProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactElement | string;
  isLoading?: boolean;
  icon?: ReactElement;
}

const CustomPopoverActionButton = ({ className, children, isLoading = false, icon, ...props }: IProp) => {
  return (
    <button
      className={cn(
        `action-popover-action-item`,
        className
      )}
      disabled={isLoading}
      {...props}
    >

      {isLoading &&
        <span className="p-1" ><LoadingIcon /></span>
      }

      {(icon && !isLoading) &&
        icon
      }

      {children}

    </button>
  );
};

export default CustomPopoverActionButton;