import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SUI_OpenSwap } from '@/types/swap-market.types';
import { useProfileStore } from '@/store/profile';

import { useNavigate } from 'react-router-dom';
import { showUnderConstructionToast, showWalletConnectionToast } from '@/lib/helpers';
import CustomPopoverActionButton from '../../shared/CustomPopoverActionButton';

interface IProp {
  swap: SUI_OpenSwap;
  handleSwapCancel: (swap: SUI_OpenSwap) => Promise<void>;
  cardType: "available" | "created";
  handleNavigation: (swap: SUI_OpenSwap) => void;
}


const OpenMarketListItemActionPopover = ({ swap, handleSwapCancel, cardType, handleNavigation }: IProp) => {

  const navigate = useNavigate();
  const wallet = useProfileStore(state => state.profile.wallet);

  return (
    <Popover>
      <PopoverTrigger className='px-3 py-1.5 rounded-xs hover:bg-su_enable_bg cursor-pointer' >
        <svg
          className="w-1 cursor-pointer" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.00039 12.8C2.42474 12.8 2.8317 12.9686 3.13176 13.2686C3.43182 13.5687 3.60039 13.9757 3.60039 14.4C3.60039 14.8243 3.43182 15.2313 3.13176 15.5314C2.8317 15.8314 2.42474 16 2.00039 16C1.57604 16 1.16908 15.8314 0.86902 15.5314C0.568961 15.2313 0.400391 14.8243 0.400391 14.4C0.400391 13.9757 0.568961 13.5687 0.86902 13.2686C1.16908 12.9686 1.57604 12.8 2.00039 12.8ZM2.00039 6.4C2.42474 6.4 2.8317 6.56857 3.13176 6.86863C3.43182 7.16869 3.60039 7.57565 3.60039 8C3.60039 8.42435 3.43182 8.83131 3.13176 9.13137C2.8317 9.43143 2.42474 9.6 2.00039 9.6C1.57604 9.6 1.16908 9.43143 0.86902 9.13137C0.568961 8.83131 0.400391 8.42435 0.400391 8C0.400391 7.57565 0.568961 7.16869 0.86902 6.86863C1.16908 6.56857 1.57604 6.4 2.00039 6.4ZM2.00039 0C2.42474 0 2.8317 0.168571 3.13176 0.468629C3.43182 0.768687 3.60039 1.17565 3.60039 1.6C3.60039 2.02435 3.43182 2.43131 3.13176 2.73137C2.8317 3.03143 2.42474 3.2 2.00039 3.2C1.57604 3.2 1.16908 3.03143 0.86902 2.73137C0.568961 2.43131 0.400391 2.02435 0.400391 1.6C0.400391 1.17565 0.568961 0.768687 0.86902 0.468629C1.16908 0.168571 1.57604 0 2.00039 0Z" fill="#B6B6BD" />
        </svg>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        className="max-w-52 px-2 pr-4 lg:pr-0 lg:px-3 py-3 bg-card dark:bg-su_least_bg lg:dark:bg-su_secondary_bg rounded-sm mr-10"
      >

        {
          cardType === "available" &&
          <CustomPopoverActionButton
            onClick={() => handleNavigation(swap)}
            icon={
              <svg className='w-8' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7284 11L22 15.1586H10.2385V14.0368H19.2184L16.9138 11.7931L17.7284 11ZM21.7615 16.8414V17.9632H12.7816L15.0862 20.2069L14.2716 21L10 16.8414H21.7615Z" fill="white" />
              </svg>
            }
          >
            Propose offer
          </CustomPopoverActionButton>
        }

        {
          cardType === "created" &&
          <div className='flex flex-col gap-1'>

            <CustomPopoverActionButton
              onClick={() => showUnderConstructionToast()}
              icon={
                <svg className="w-12 h-6 cursor-pointer" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 14.8538V17.5556C2 17.8045 2.19553 18 2.44438 18H5.14624C5.26178 18 5.37732 17.9556 5.45731 17.8667L15.1627 8.17022L11.8298 4.83734L2.13332 14.5338C2.04444 14.6227 2 14.7293 2 14.8538ZM17.7401 4.33963L15.6604 2.25991C15.5781 2.17752 15.4805 2.11216 15.373 2.06756C15.2654 2.02296 15.1502 2 15.0338 2C14.9174 2 14.8021 2.02296 14.6946 2.06756C14.5871 2.11216 14.4894 2.17752 14.4072 2.25991L12.7808 3.88636L16.1136 7.21924L17.7401 5.5928C17.8225 5.51057 17.8878 5.41291 17.9324 5.30539C17.977 5.19787 18 5.08261 18 4.96621C18 4.84981 17.977 4.73456 17.9324 4.62704C17.8878 4.51952 17.8225 4.42186 17.7401 4.33963Z" fill="#868691" />
                </svg>
              }
            >
              Edit
            </CustomPopoverActionButton>

            <CustomPopoverActionButton
              onClick={() => { wallet.isConnected ? navigate(`/swap-up/my-swaps/pending/?walletIdToFilterSwaps=${swap.init_address}`) : showWalletConnectionToast(); }}
              icon={
                <svg className="w-12 h-6 cursor-pointer" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 8.3C9.42135 8.3 8.86639 8.53178 8.45722 8.94436C8.04805 9.35695 7.81818 9.91652 7.81818 10.5C7.81818 11.0835 8.04805 11.6431 8.45722 12.0556C8.86639 12.4682 9.42135 12.7 10 12.7C10.5787 12.7 11.1336 12.4682 11.5428 12.0556C11.9519 11.6431 12.1818 11.0835 12.1818 10.5C12.1818 9.91652 11.9519 9.35695 11.5428 8.94436C11.1336 8.53178 10.5787 8.3 10 8.3ZM10 14.1667C9.03558 14.1667 8.11065 13.7804 7.4287 13.0927C6.74675 12.4051 6.36364 11.4725 6.36364 10.5C6.36364 9.52754 6.74675 8.59491 7.4287 7.90728C8.11065 7.21964 9.03558 6.83333 10 6.83333C10.9644 6.83333 11.8893 7.21964 12.5713 7.90728C13.2532 8.59491 13.6364 9.52754 13.6364 10.5C13.6364 11.4725 13.2532 12.4051 12.5713 13.0927C11.8893 13.7804 10.9644 14.1667 10 14.1667ZM10 5C6.36364 5 3.25818 7.28067 2 10.5C3.25818 13.7193 6.36364 16 10 16C13.6364 16 16.7418 13.7193 18 10.5C16.7418 7.28067 13.6364 5 10 5Z" fill="#B6B6BD" />
                </svg>
              }
            >
              View Incoming Offers
            </CustomPopoverActionButton>

            <CustomPopoverActionButton
              onClick={async () => { await handleSwapCancel(swap); }}
              icon={
                <svg className="w-12 h-6 cursor-pointer" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.2222 2H3.77778C3.30628 2 2.8541 2.1873 2.5207 2.5207C2.1873 2.8541 2 3.30628 2 3.77778V16.2222C2 16.6937 2.1873 17.1459 2.5207 17.4793C2.8541 17.8127 3.30628 18 3.77778 18H16.2222C16.6937 18 17.1459 17.8127 17.4793 17.4793C17.8127 17.1459 18 16.6937 18 16.2222V3.77778C18 3.30628 17.8127 2.8541 17.4793 2.5207C17.1459 2.1873 16.6937 2 16.2222 2ZM13.2 14.4444L10 11.2444L6.8 14.4444L5.55556 13.2L8.75556 10L5.55556 6.8L6.8 5.55556L10 8.75556L13.2 5.55556L14.4444 6.8L11.2444 10L14.4444 13.2L13.2 14.4444Z" fill="#FF7585" />
                </svg>
              }
            >
              Close
            </CustomPopoverActionButton>
          </div>
        }

      </PopoverContent>
    </Popover>
  );
};

export default OpenMarketListItemActionPopover;