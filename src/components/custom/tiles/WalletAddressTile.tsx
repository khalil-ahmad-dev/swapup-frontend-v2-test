import { cn, getShortenWalletAddress } from "@/lib/utils";

interface IProp {
  walletAddress: string;
  className?: string;
  containerClassName?: string;
  children?: any;
  showLongWalletAddressOnLargeScreen?: boolean;
  showLongWalletAddressOnMobileScreen?: boolean;
}

const WalletAddressTile = ({
  walletAddress,
  className,
  children,
  showLongWalletAddressOnLargeScreen = false,
  showLongWalletAddressOnMobileScreen = false,
  containerClassName,
  ...props
}: IProp) => {

  return (
    <div className={cn(
      "flex items-center justify-between dark:bg-su_enable_bg py-1.5 px-3 rounded-xs",
      containerClassName
    )} >
      <div
        className={cn(
          "flex items-center gap-1 lg:gap-2 text-xs lg:text-sm",
          className
        )}
        {...props}
      >
        <svg className="w-3 lg:w-4 mb-0.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6667 8C11.0478 8 10.4543 8.24583 10.0168 8.68342C9.57917 9.121 9.33333 9.71449 9.33333 10.3333C9.33333 10.9522 9.57917 11.5457 10.0168 11.9832C10.4543 12.4208 11.0478 12.6667 11.6667 12.6667H16V16H0V4.66667H16V8H11.6667ZM12.3333 11.3333H11.6667C11.4015 11.3333 11.1471 11.228 10.9596 11.0404C10.772 10.8529 10.6667 10.5985 10.6667 10.3333C10.6667 10.0681 10.772 9.81376 10.9596 9.62623C11.1471 9.43869 11.4015 9.33333 11.6667 9.33333H12.3333C12.5985 9.33333 12.8529 9.43869 13.0404 9.62623C13.228 9.81376 13.3333 10.0681 13.3333 10.3333C13.3333 10.5985 13.228 10.8529 13.0404 11.0404C12.8529 11.228 12.5985 11.3333 12.3333 11.3333ZM10.6667 0L13.3333 3.33333H5.33333L10.6667 0Z" fill="#868691" />
        </svg>

        <span className="hidden lg:inline-block" >{!showLongWalletAddressOnLargeScreen ? getShortenWalletAddress(walletAddress) : walletAddress}</span>
        <span className="lg:hidden" >{!showLongWalletAddressOnMobileScreen ? getShortenWalletAddress(walletAddress) : walletAddress}</span>
      </div>

      {children}
    </div>
  );
};

export default WalletAddressTile;