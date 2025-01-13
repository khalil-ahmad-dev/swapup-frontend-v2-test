import { toast } from "sonner";
import ToastLookCard from "@/components/custom/shared/ToastLookCard";
import { SUT_ToastVariantType } from "@/types/global.types";
import { SUI_SwapToken, SUT_SwapTokenContractType } from "@/types/swap-market.types";
import { cn, getDefaultNftImageOnError } from "./utils";

export const showWalletConnectionToast = (variant: SUT_ToastVariantType = "error", title?: string, description?: string) => {
  toast.custom(
    (id) => (
      <ToastLookCard
        variant={variant}
        title={title ? title : "Connect to wallet!"}
        description={description ? description : "Please connect to wallet for this feature!"}
        onClose={() => toast.dismiss(id)}
      />
    ),
    {
      duration: 3000,
      className: 'w-full !bg-transparent',
      position: "bottom-left",
    }
  );
};

export const showUnderConstructionToast = (title?: string, description?: string) => {
  toast.info(title ? title : "Under construction", {
    position: 'bottom-left',
    duration: 2000,
    description: `${description ? description : "This feature is under construction!"}`,
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
    className: '!bg-gradient-primary border-none',
    descriptionClassName: '!text-white',
  });
};

// To get normal swapup notification for APIs etc
export const handleShowNotificationToast = (variant: SUT_ToastVariantType = "error", title: string, description: string, duration = 3000) => {
  toast.custom(
    (id) => (
      <ToastLookCard
        variant={variant}
        title={title}
        description={description}
        onClose={() => toast.dismiss(id)}
      />
    ),
    {
      duration,
      className: 'w-full !bg-transparent',
      position: "bottom-left",
    }
  );
};

export const mapSwapTokensHelper = (swapTokens: SUI_SwapToken[], showMaxNumberOfTokensToShow: number, className?: string) => {
  return (
    swapTokens.map((swapToken, index) => {
      if (index < showMaxNumberOfTokensToShow)
        return (
          <div
            key={swapToken.id}
            className={cn(
              "w-8 h-8 relative border-[1.5px] border-white/20 overflow-hidden",
              (swapToken.type as SUT_SwapTokenContractType) === "ERC20" ? "rounded-full" : "rounded-xs",
              className
            )
            }
          >
            <img
              className={"w-full h-full object-cover"}
              src={swapToken.image_url}
              alt="nft"
              onError={getDefaultNftImageOnError}
            />

            {
              ((index === showMaxNumberOfTokensToShow - 1) && swapTokens.length > showMaxNumberOfTokensToShow) ?
                <div className="absolute w-full h-full rounded-xs bg-black/50 top-0 flex justify-center items-center font-semibold" >
                  +{swapTokens.length - showMaxNumberOfTokensToShow}
                </div> : ''
            }
          </div>
        );
    })
  );
};