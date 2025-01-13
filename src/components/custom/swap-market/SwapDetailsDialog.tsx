import { ScrollBar, ScrollArea } from '@/components/ui/scroll-area';
import { getLastCharacters } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CustomOutlineButton from '../shared/CustomOutlineButton';
import CopyTile from '../tiles/CopyTile';
import AvoidingFeeDialog from '../shared/AvoidingFeeDialog';
import StaySafeDialog from './StaySafeDialog';
import SwapDialogSideCard from './SwapDialogSideCard';
import { IOpenRoom, IPrivateRoom } from '@/types/swap-market-store.types';
import { SUI_SwapCreation } from '@/types/global.types';
import CustomAvatar from '../shared/CustomAvatar';
import CustomCardLayout from '../shared/CustomCardLayout';
import ToastLookCard from '../shared/ToastLookCard';

interface IProp {
  children: any;
  enableApproveButtonCriteria: boolean;
  swapCreation?: SUI_SwapCreation;
  handleSwapCreation: () => void;
  state: IOpenRoom | IPrivateRoom;
  isSwapProposeDialog?: boolean;
}

const SwapDetailsDialog = ({ children, enableApproveButtonCriteria, swapCreation, handleSwapCreation, state, isSwapProposeDialog = false }: IProp) => {

  return (
    <Dialog>
      <div className="relative" >
        {children}
        <DialogTrigger className="absolute w-full h-full top-0 left-0 bg-transparent" disabled={!enableApproveButtonCriteria}>
        </DialogTrigger>
      </div>

      <DialogContent className="max-h-[calc(100vh_-_100px)] lg:w-[800px] p-0 overflow-hidden relative" >

        {/* header */}
        <header className="w-full z-50 absolute border-b border-b-su_quaternary_bg top-0 left-0 bg-su_ternary_bg p-4 lg:p-5 space-y-3 flex justify-between items-start">
          <div className="flex items-center gap-4 pt-2 w-full" >
            <h2 className="font-semibold text-xl">Swap Details</h2>

            <CopyTile textToCopy={state.uniqueTradeId} >
              <span className="hidden lg:inline-block" >Unique trade ID:</span> <span className="dark:text-su_primary font-semibold">#{getLastCharacters(state.uniqueTradeId, 7)}</span>
            </CopyTile>

            {/* <div className="flex items-center gap-2 text-xs text-su_secondary" >
              <span className="hidden lg:inline-block" >Etherscan link:</span>

              <svg className="w-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.50268 6.06934C3.1801 6.06934 2.91464 6.33479 2.91464 6.65793L2.9152 10.3637C2.9152 10.6179 2.73039 10.8375 2.47669 10.8604C2.18884 10.8952 1.9581 10.9181 1.77329 10.9299C1.42719 10.9646 1.10405 10.7916 0.930994 10.4914C0.71202 10.1106 0.527208 9.71797 0.388879 9.30242C-0.879603 5.65379 1.05812 1.65961 4.7034 0.389449C8.34867 -0.880713 12.3395 1.05925 13.6085 4.70733C13.7239 5.03047 13.6662 5.37713 13.4584 5.64259C12.7662 6.54313 11.8892 7.29357 11.0357 7.91689V3.67966C11.0357 3.34476 10.7703 3.0793 10.4471 3.0793H9.45531C9.13216 3.0793 8.86671 3.35652 8.86671 3.67966V8.81687C8.86671 9.02521 8.75134 9.19826 8.56653 9.2789C8.32459 9.38251 8.0821 9.48668 8.0821 9.48668V5.18C8.0821 4.8451 7.80544 4.57964 7.4823 4.57964H6.49047C6.15613 4.57964 5.89067 4.85686 5.89067 5.18V9.82102C5.89067 10.0523 5.72882 10.2483 5.50985 10.306C5.348 10.3407 5.20967 10.3755 5.0943 10.4102V6.66969C5.0943 6.33479 4.81765 6.06934 4.4945 6.06934H3.50268ZM12.6613 11.1145C10.3893 14.2429 6.01706 14.9357 2.89093 12.6613C6.70926 12.1187 11.4276 10.3294 13.9763 6.50823L13.9779 6.53171C13.9886 6.68568 13.9993 6.8392 13.9993 6.99322C13.9993 8.4706 13.5266 9.91381 12.6613 11.1145Z" fill="white" />
              </svg>
            </div> */}
          </div>

          <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
            <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </DialogClose>
        </header>

        {/* Content */}
        <ScrollArea className='my-16'>
          <ScrollBar orientation="vertical" />

          <section className="px-4 lg:px-5 py-4 pb-5 lg:py-8 lg:pb-10 bg-transparent space-y-3">

            {/* Sender and Receiver side profile header */}
            <div className='mb-5 border border-su_enable_bg bg-su_tag_periwinkle rounded-sm flex items-center gap-2 p-3'>

              <div className='w-full flex items-center justify-center gap-2' >
                <CustomAvatar
                  imageSrc={state.sender.profile.avatar}
                  fallbackName={state.sender.profile.details?.title || state.sender.profile.ensAddress || ''}
                  textSizeClasses="text-2xs lg:text-xs"
                />

                <h3 className="font-semibold text-xs lg:text-sm line-clamp-1">{state.sender.profile.ensAddress}</h3>
              </div>

              <svg className='min-w-6 h-6 lg:min-w-10 lg:h-10' viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.8833" y="1.09058" width="38" height="38" rx="19" stroke="url(#paint0_linear_346_36665)" strokeWidth="2" />
                <path d="M23.476 12.0906L29.8833 18.7444H12.2411V16.9495H25.7108L22.254 13.3596L23.476 12.0906ZM29.5255 21.4368V23.2317H16.0558L19.5126 26.8216L18.2906 28.0906L11.8833 21.4368H29.5255Z" fill="#7586FF" />
                <defs>
                  <linearGradient id="paint0_linear_346_36665" x1="40.8833" y1="7.69058" x2="-1.44959" y2="18.8051" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#51C0FF" />
                    <stop offset="1" stopColor="#9452FF" />
                  </linearGradient>
                </defs>
              </svg>

              <div className='w-full flex items-center justify-center gap-2' >
                <CustomAvatar
                  imageSrc={state.receiver.profile.avatar}
                  fallbackName={state.receiver.profile.details?.title || state.receiver.profile.ensAddress || ''}
                  textSizeClasses="text-2xs lg:text-xs"
                />

                <h3 className="font-semibold text-xs lg:text-sm line-clamp-1">{state.receiver.profile.ensAddress}</h3>
              </div>
            </div>

            {/* side cards*/}
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2" >
              <SwapDialogSideCard data={state.sender} layoutType='sender' />
              <SwapDialogSideCard data={state.receiver} useNfts={isSwapProposeDialog} layoutType='receiver' />
            </div>

            {/* Fee section*/}
            <CustomCardLayout
              title='Estimated Fees'
              className='gap-2'
            >
              <div className="text-xs lg:text-sm dark:text-su_ternary font-normal flex items-center justify-between" >
                <p>Project royalties:</p>
                <p className="text-text dark:text-su_primary" >5%</p>
              </div>

              <div className="text-xs lg:text-sm dark:text-su_ternary font-normal flex items-center justify-between" >
                <p>Cryptocurrency trading fee:</p>
                <p className="text-text dark:text-su_primary" >$ 100 / 0.01 SOL</p>
              </div>

              <div className="text-xs lg:text-sm dark:text-su_ternary font-normal flex items-center justify-between" >
                <p>Current Gas:</p>
                <p className="text-text dark:text-su_primary" >$ 100 / 50 GWEI</p>
              </div>

              <div className="text-xs lg:text-sm dark:text-su_ternary font-normal flex items-center justify-between" >
                <p>SwapUp platform fees:</p>
                <p className="text-text dark:text-su_primary" >2%</p>
              </div>

              <div className="space-y-1 pt-2 border-t-[1.5px] border-t-su_enable_bg border-dashed" >
                <div className="text-xs lg:text-sm dark:text-su_ternary font-normal flex items-center justify-between" >
                  <p className="text-text " >Total fees:</p>

                  <div className="flex gap-2" >
                    {/* icon will come here in future */}

                    <p className="text-su_primary" >$ 10.00045</p>
                  </div>
                </div>

                <p className="text-xs lg:text-sm dark:text-su_ternary" >
                  Interested in reducing fees?  {' '}
                  <AvoidingFeeDialog>
                    <span className="link-style" >View details</span>
                  </AvoidingFeeDialog>
                </p>
              </div>
            </CustomCardLayout>

            {/* stay safe*/}
            <ToastLookCard
              variant='info'
              title='Stay Safe!'
              hideCloseButton
              description={
                <div>
                  Always use best practices when completing a trade. {' '}
                  <StaySafeDialog>
                    <span className="link-style" >View details</span>
                  </StaySafeDialog>
                </div>
              }
            />
          </section>
        </ScrollArea>

        {/* footer */}
        <footer className="absolute border-t border-t-su_quaternary_bg left-0 bottom-0 p-4 lg:p-5 bg-su_ternary_bg w-full flex justify-between items-center gap-3">
          <div className="relative" >
            <CustomOutlineButton className="px-5 py-2">Cancel</CustomOutlineButton>
            <DialogClose className="absolute w-full h-full top-0 left-0" ></DialogClose>
          </div>

          <Button
            variant={"default"}
            disabled={swapCreation?.created}
            onClick={async () => await handleSwapCreation()}
            isLoading={swapCreation?.isLoading}
            className="py-2"
          >
            Confirm
          </Button>
        </footer>
      </DialogContent>
    </Dialog >
  );
};

export default SwapDetailsDialog;