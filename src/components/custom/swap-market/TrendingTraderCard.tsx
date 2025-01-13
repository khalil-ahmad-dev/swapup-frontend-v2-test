import React from 'react';
import CustomAvatar from '../shared/CustomAvatar';
import CustomOutlineButton from '../shared/CustomOutlineButton';
import { showUnderConstructionToast } from '@/lib/helpers';
import BadgeTile from '../tiles/BadgeTile';
import { getNumberToShortScaleFormate, getShortenWalletAddress } from '@/lib/utils';
import moment from 'moment';
import CopyTile from '../tiles/CopyTile';
import { Separator } from '@/components/ui/separator';
import { defaults } from '@/constants/defaults';
import { SUI_TopTrader } from '@/types/analytics.types';


interface IProp {
  trader: SUI_TopTrader;
}

const TrendingTraderCard = ({ trader }: IProp) => {
  return (
    <div className='bg-su_card_secondary p-3 rounded-md w-[458px] h-full flex flex-col gap-4'>
      {/* Top section */}
      <div>
        <div className="h-[134px] relative rounded-sm mb-12">
          <img
            className='rounded-tr-sm rounded-tl-sm w-full h-full object-cover'
            src={trader.images.coverImage ? trader.images.coverImage : defaults.fallback.profileCover}
            alt=""
            loading="lazy"
          />

          <div className='p-1 rounded-full absolute -bottom-10 left-[40%] bg-su_card_secondary w-20 h-20' >
            <CustomAvatar
              className='!w-full !h-full lg:!w-full lg:!h-full'
              imageSrc={trader.images.avatar}
              fallbackName={trader.title || trader.subname || "Swapup User"}
              isPremium={true}
              isPremiumClasses='bg-su_tag_buttermilk w-6 h-6 lg:w-6 lg:h-6'
            />
          </div>
        </div>

        <div className='flex flex-col gap-1 items-center w-full text-sm font-normal' >
          <h3 className='text-base font-semibold capitalize' >{trader.title || "N/A"}</h3>

          <p className='text-su_secondary leading-loose' >{trader.subname}</p>

          <CustomOutlineButton
            className='px-2 py-0.5 capitalize text-sm font-bold '
            iconButton={true}
            iconLocation='right'
            icon={
              <svg className='w-4' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.10156 0.131836L6.77969 1.45371L12.0109 6.69434H0.601562V8.56934H12.0109L6.77969 13.81L8.10156 15.1318L15.6016 7.63184L8.10156 0.131836Z" fill="white" />
              </svg>
            }
            onClick={() => showUnderConstructionToast()}
          >
            View Open Trade
          </CustomOutlineButton>
        </div>

      </div>

      {/* Divider */}
      <Separator orientation='horizontal' />

      {/* Bottom content section */}
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between' >
          <p className='text-sm font-normal text-su_ternary'>Total swaps</p>

          <BadgeTile className='text-sm flex items-center gap-2 font-semibold text-su_warning' >
            <svg className='w-3' viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.66232 4.26039C7.66232 6.15409 6.12719 7.68923 4.2335 7.68923C2.33982 7.68923 0.804688 6.15409 0.804688 4.26039C0.804688 2.36669 2.33982 0.831543 4.2335 0.831543C6.12719 0.831543 7.66232 2.36669 7.66232 4.26039ZM5.90239 8.02083C5.37696 8.25399 4.80849 8.37447 4.23364 8.37449C4.09649 8.37449 3.95934 8.36763 3.82424 8.3546C4.04518 8.86956 4.38894 9.32254 4.82545 9.67391C5.26195 10.0253 5.7779 10.2643 6.32817 10.3702C6.87844 10.476 7.44626 10.4454 7.98195 10.281C8.51765 10.1166 9.00491 9.82349 9.40111 9.42723C9.79731 9.03096 10.0904 8.54365 10.2547 8.00793C10.419 7.4722 10.4495 6.90437 10.3436 6.35412C10.2377 5.80386 9.99853 5.28794 9.6471 4.85149C9.29566 4.41503 8.84264 4.07134 8.32765 3.85047C8.38485 4.42247 8.32155 5.00011 8.14185 5.54615C7.96215 6.09219 7.67002 6.59452 7.2843 7.02075C6.89858 7.44699 6.42783 7.78766 5.90239 8.02083Z" fill="#FFC175" />
            </svg>

            {getNumberToShortScaleFormate(Number(trader.totalSwaps))}
          </BadgeTile>
        </div>

        <div className='flex items-center justify-between' >
          <p className='text-sm font-normal text-su_ternary'>Collections</p>

          <BadgeTile className='text-sm flex items-center gap-2 font-semibold ' >
            <svg className='w-3.5' viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_5879_189381)">
                <path d="M4.97755 12.6309C4.85904 12.6315 4.74316 12.5959 4.64541 12.5289C4.54766 12.4619 4.47269 12.3666 4.43052 12.2559L3.49677 9.82774C3.47786 9.77882 3.44893 9.73438 3.41183 9.69729C3.37474 9.66019 3.33031 9.63127 3.28138 9.61235L0.852549 8.6779C0.74191 8.63544 0.646748 8.56042 0.579623 8.46276C0.512497 8.3651 0.476563 8.24938 0.476562 8.13087C0.476562 8.01236 0.512497 7.89664 0.579623 7.79898C0.646748 7.70131 0.74191 7.6263 0.852549 7.58384L3.28067 6.65009C3.3296 6.63118 3.37404 6.60225 3.41113 6.56515C3.44822 6.52806 3.47715 6.48363 3.49606 6.4347L4.43052 4.00587C4.47298 3.89523 4.54799 3.80007 4.64566 3.73294C4.74332 3.66582 4.85904 3.62988 4.97755 3.62988C5.09606 3.62988 5.21178 3.66582 5.30944 3.73294C5.4071 3.80007 5.48212 3.89523 5.52458 4.00587L6.45833 6.43399C6.47724 6.48292 6.50617 6.52736 6.54326 6.56445C6.58036 6.60154 6.62479 6.63047 6.67372 6.64938L9.08778 7.57821C9.20293 7.62089 9.30212 7.69802 9.37186 7.79909C9.4416 7.90016 9.47851 8.02026 9.47755 8.14306C9.47576 8.2595 9.43906 8.37273 9.37221 8.46808C9.30535 8.56344 9.21141 8.63653 9.10255 8.6779L6.67442 9.61165C6.62549 9.63056 6.58106 9.65949 6.54397 9.69658C6.50687 9.73368 6.47794 9.77811 6.45903 9.82704L5.52458 12.2559C5.48241 12.3666 5.40743 12.4619 5.30968 12.5289C5.21193 12.5959 5.09606 12.6315 4.97755 12.6309Z" fill="white" />
                <path d="M2.16402 4.75702C2.09454 4.75701 2.02669 4.73596 1.96941 4.69663C1.91214 4.6573 1.86812 4.60154 1.84316 4.5367L1.448 3.5092C1.43944 3.48673 1.42622 3.46632 1.40921 3.44932C1.39221 3.43231 1.3718 3.4191 1.34933 3.41053L0.321831 3.01537C0.256998 2.99041 0.201249 2.94639 0.161929 2.88911C0.122609 2.83183 0.101563 2.76399 0.101562 2.69452C0.101563 2.62504 0.122609 2.5572 0.161929 2.49992C0.201249 2.44264 0.256998 2.39862 0.321831 2.37366L1.34933 1.9785C1.37178 1.9699 1.39217 1.95666 1.40917 1.93966C1.42617 1.92266 1.4394 1.90228 1.448 1.87983L1.83964 0.861468C1.86173 0.801516 1.89974 0.748716 1.94958 0.708742C1.99942 0.668769 2.05922 0.643135 2.12253 0.634593C2.19855 0.625352 2.27548 0.641753 2.34112 0.681196C2.40676 0.720639 2.45735 0.780867 2.48488 0.852328L2.88003 1.87983C2.88864 1.90228 2.90187 1.92266 2.91887 1.93966C2.93587 1.95666 2.95626 1.9699 2.97871 1.9785L4.00621 2.37366C4.07104 2.39862 4.12679 2.44264 4.16611 2.49992C4.20543 2.5572 4.22647 2.62504 4.22647 2.69452C4.22647 2.76399 4.20543 2.83183 4.16611 2.88911C4.12679 2.94639 4.07104 2.99041 4.00621 3.01537L2.97871 3.41053C2.95623 3.4191 2.93583 3.43231 2.91882 3.44932C2.90182 3.46632 2.8886 3.48673 2.88003 3.5092L2.48488 4.5367C2.45992 4.60154 2.4159 4.6573 2.35862 4.69663C2.30135 4.73596 2.2335 4.75701 2.16402 4.75702Z" fill="white" />
                <path d="M9.47626 6.63173C9.40047 6.63171 9.32646 6.60872 9.26399 6.56579C9.20152 6.52286 9.15353 6.46201 9.12634 6.39126L8.59103 4.99978C8.58161 4.97526 8.56715 4.95299 8.54857 4.93442C8.53 4.91585 8.50773 4.90138 8.48321 4.89197L7.09173 4.35665C7.02104 4.32941 6.96025 4.2814 6.91738 4.21894C6.87451 4.15648 6.85156 4.08249 6.85156 4.00673C6.85156 3.93097 6.87451 3.85699 6.91738 3.79453C6.96025 3.73206 7.02104 3.68405 7.09173 3.65681L8.48321 3.1215C8.50773 3.11208 8.53 3.09762 8.54857 3.07904C8.56715 3.06047 8.58161 3.0382 8.59103 3.01368L9.12235 1.63204C9.14661 1.56671 9.18812 1.50917 9.24248 1.46555C9.29683 1.42192 9.36199 1.39385 9.43103 1.38431C9.51398 1.37427 9.59792 1.39222 9.6695 1.43532C9.74109 1.47842 9.79624 1.54419 9.82618 1.6222L10.3615 3.01368C10.3709 3.0382 10.3854 3.06047 10.4039 3.07904C10.4225 3.09762 10.4448 3.11208 10.4693 3.1215L11.8608 3.65681C11.9315 3.68405 11.9923 3.73206 12.0351 3.79453C12.078 3.85699 12.101 3.93097 12.101 4.00673C12.101 4.08249 12.078 4.15648 12.0351 4.21894C11.9923 4.2814 11.9315 4.32941 11.8608 4.35665L10.4693 4.89197C10.4448 4.90138 10.4225 4.91585 10.4039 4.93442C10.3854 4.95299 10.3709 4.97526 10.3615 4.99978L9.82618 6.39126C9.79899 6.46201 9.751 6.52286 9.68853 6.56579C9.62607 6.60872 9.55206 6.63171 9.47626 6.63173Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_5879_189381">
                  <rect width="12" height="12" fill="white" transform="translate(0.101562 0.631836)" />
                </clipPath>
              </defs>
            </svg>


            {trader.totalCollections}
          </BadgeTile>
        </div>

        <div className='flex items-center justify-between' >
          <p className='text-sm font-normal text-su_ternary'>Wallet Address</p>

          <CopyTile className='dark:bg-transparent p-0 text-base font-normal dark:text-su_primary' textToCopy={trader.wallet} >{getShortenWalletAddress(trader.wallet)}</CopyTile>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-sm font-normal text-su_ternary'>Wallet created on</p>

          <p className='text-base font-semibold' >{moment(trader.createdAt).format("DD MMM YYYY")}</p>
        </div>
      </div>
    </div>
  );
};

export default TrendingTraderCard;