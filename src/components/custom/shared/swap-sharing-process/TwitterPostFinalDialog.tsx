import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SUT_SwapSharingActionType } from "./SwapSharingOnSocialProcess";

import { cn, getDefaultNftImageOnError, getLastCharacters, handleTwitterSharingProcessLocalstorageState } from "@/lib/utils";
import { SUI_OpenSwap, SUI_SwapToken, SUT_SwapTokenContractType } from "@/types/swap-market.types";
import { useGlobalStore } from "@/store/global-store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


interface IProp {
  setOpen: (isOpen: boolean) => void;
  open: boolean;
  handleShareSwapPostOnSocialPlatform: (platformActionType: SUT_SwapSharingActionType, base64Image?: string) => Promise<void>;
  isLoadingFinalTwitterPost: boolean;
  setIsLoadingFinalTwitterPost: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwitterPostFinalDialog = ({ open, setOpen, handleShareSwapPostOnSocialPlatform, isLoadingFinalTwitterPost, setIsLoadingFinalTwitterPost }: IProp) => {

  const [recentAcceptedSwap] = useGlobalStore(state => [state.recentAcceptedSwap]);

  const handleOnOpenChange = (state: boolean) => {
    setOpen(state);

    if (!state) {
      handleTwitterSharingProcessLocalstorageState('REMOVE');
    }
  };

  const swapTokensMapper = (swapTokens: SUI_SwapToken[], showMaxNumberOfTokensToShow: number) => {
    return (
      swapTokens.map((swapToken, index) => {
        if (index < showMaxNumberOfTokensToShow)
          return (
            <div key={swapToken.id} className="text-sm">
              <div className="relative">
                <img
                  className={cn(
                    "w-full h-full object-cover",
                    (swapToken.type as SUT_SwapTokenContractType) === "ERC20" ? "w-20 h-20" : "w-24 h-28 rounded-xs border-[1.5px] border-white/20"
                  )}
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

              {(swapToken.type as SUT_SwapTokenContractType) !== "ERC20" &&
                <p> ID# {swapToken.id}</p>
              }

              {(swapToken.type as SUT_SwapTokenContractType) === "ERC20" &&
                <>
                  <p className="mt-1 text-xs"> Price: {swapToken.value?.amount} {' '} {swapToken.value?.symbol} </p>
                  <p className="text-xs"> USD: {swapToken.value?.usdAmount.toFixed(4)} {' '} $</p>
                </>
              }
            </div >
          );
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange} >
      <DialogContent className="w-[400px] lg:w-[700px] p-4 space-y-3" >

        {/* header */}
        <div className="">
          <div className="flex justify-between items-start">
            <h2 className="font-bold text-xl pt-3" >
              {"Click 'Post' to create post on your twitter account!"}
            </h2>

            <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
              <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </DialogClose>
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-2" >
          {
            recentAcceptedSwap &&
            <div id="capture" className="p-3" >
              <h2 className="flex items-center justify-between" >
                <img src="/assets/logos/swapup-logo-white.svg" alt="swapup" className="h-8" />

                <span className="font-semibold" >
                  Trade ID: {' '}
                  <span className="font-normal">{
                    getLastCharacters((recentAcceptedSwap.trade_id ? recentAcceptedSwap.trade_id : (recentAcceptedSwap as SUI_OpenSwap).open_trade_id),
                      6
                    )}
                  </span>
                </span>
              </h2>

              <p>I am trading</p>

              <div className="flex flex-col gap-4 items-center" >

                <div className="flex items-center gap-3" >
                  {swapTokensMapper(recentAcceptedSwap.metadata.init.tokens, 3)}
                </div>

                <svg
                  className="w-12 h-6 rotate-90"
                  viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="30" height="30" rx="15" stroke="url(#paint0_linear_2344_40905)" strokeWidth="2" />
                  <path d="M17.7284 11L22 15.1586H10.2385V14.0368H19.2184L16.9138 11.7931L17.7284 11ZM21.7615 16.8414V17.9632H12.7816L15.0862 20.2069L14.2716 21L10 16.8414H21.7615Z" fill="white" />
                  <defs>
                    <linearGradient id="paint0_linear_2344_40905" x1="32" y1="6.08" x2="-1.86631" y2="14.9716" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#51C0FF" />
                      <stop offset="1" stopColor="#9452FF" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="flex items-center gap-3" >
                  {recentAcceptedSwap.metadata.accept ? swapTokensMapper(recentAcceptedSwap.metadata.accept.tokens, 3) : "Waiting for proposals!"}
                </div>
              </div>

            </div>
          }

          <ScrollBar orientation="vertical" className="bg-transparent" />
        </ScrollArea>

        <Button
          className="w-full"
          onClick={async () => { await handleShareSwapPostOnSocialPlatform('TWITTER_POST'); }}
          isLoading={isLoadingFinalTwitterPost}
        >
          Post
        </Button>
      </DialogContent>
    </Dialog >
  );
};

export default TwitterPostFinalDialog;