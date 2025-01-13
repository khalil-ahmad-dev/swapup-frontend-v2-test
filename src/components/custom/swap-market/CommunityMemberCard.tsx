import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleShowNotificationToast, showUnderConstructionToast, showWalletConnectionToast } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/store/profile';
import { useNavigate } from 'react-router-dom';
import CreateNewSubdomainProcess from '../profile/wallet-overview/subdomain/CreateNewSubdomainProcess';
import { createUserPlatformWalletApi } from '@/service/api';

type variantTypes = "silver" | "gold" | "bronze";
interface IProp {
  variant: variantTypes;
  className?: string;
}

interface CommunityMemberItem {
  key: variantTypes;
  iconLink: string;
  buttonTitle: string;
  navigateTo?: string;
  handleAction?: () => void | Promise<void>;
  title: string;
  level: number;
  contentList: {
    key: string;
    title: string;
  }[];
}

const communityMembersData: CommunityMemberItem[] = [
  {
    key: 'bronze',
    iconLink: "/assets/svgs/CommuintyBronze.svg",
    buttonTitle: "Get Platform Wallet",
    handleAction: async () => {
      showUnderConstructionToast();
    },
    level: 3,
    title: "Create Platform Wallet",
    contentList: [
      {
        key: "1",
        title: "Open Access to Utility Token"
      },
      {
        key: "2",
        title: "Sponsored Gas Fees"
      }
    ]
  },
  {
    key: 'silver',
    iconLink: "/assets/svgs/CommuintySilver.svg",
    buttonTitle: "Buy SWPUP Tokens",
    navigateTo: "/swap-up/profile/membership-store",
    level: 2,
    title: "Buy SWPUP Tokens",
    contentList: [
      {
        key: "1",
        title: "Receive 50% Discount on Fees"
      },
      {
        key: "2",
        title: "Use Tokens to Cover Fees"
      },
      {
        key: "3",
        title: "Streamline Transaction Execution"
      },
      {
        key: "4",
        title: "Priority Claim wen LP Token Launch"
      },
    ]
  },
  {
    key: 'gold',
    iconLink: "/assets/svgs/CommuintyGolden.svg",
    buttonTitle: "Mint Subdomain",
    navigateTo: "/swap-up/profile/wallet-overview",
    level: 1,
    title: "Register Subdomain",
    contentList: [
      {
        key: "1",
        title: "Full Membership Status"
      },
      {
        key: "2",
        title: "Claim 10,000 SWPUP Tokens Monthly"
      },
      {
        key: "3",
        title: "First Access to Future Releases"
      },
      {
        key: "4",
        title: "Access to Collaborations"
      },
    ]
  },
];

const CommunityMemberCard = ({ variant, className }: IProp) => {
  const [startCreateSubdomainProcess, setStartCreateSubdomainProcess] = useState(false);
  const [isCreatingPlatformWallet, setIsCreatingPlatformWallet] = useState(false);

  const navigate = useNavigate();
  const [wallet, smartAccount, setUserSmartWallet] = useProfileStore((state) => [state.profile.wallet, state.profile.details?.smartAccount, state.setUserSmartWallet]);

  const communityMember = communityMembersData.find(item => item.key === variant);

  const handleCreateNewPlatformWallet = async () => {
    // This logic can be improved later on
    const userSmartAccount = useProfileStore.getState().profile.details?.smartAccount;

    if (userSmartAccount) {
      handleShowNotificationToast(
        "info",
        `Platform wallet already created.`,
        `Don't worry, we've got you covered!`
      );
    } else {
      try {
        setIsCreatingPlatformWallet(true);
        const platformWalletRes = await createUserPlatformWalletApi(wallet.address);
        // console.log("platformWalletRes", platformWalletRes);

        if (platformWalletRes) {
          handleShowNotificationToast(
            "success",
            `Platform wallet created successfully.`,
            `Platform wallet: ${platformWalletRes.data.data.smartAccount}`
          );

          setUserSmartWallet(platformWalletRes.data.data.smartAccount);
        }
      } catch (error: any) {
        handleShowNotificationToast(
          "error",
          `Request failed!`,
          `${error.response ? error.response.data.message : (error.message || 'Something went wrong.')}`
        );
      } finally {
        setIsCreatingPlatformWallet(false);
      }

    }
  };

  const handleAction = async () => {
    if (wallet.isConnected && wallet.address) {

      switch (variant) {
        case 'bronze':
          await handleCreateNewPlatformWallet();
          break;
        case 'silver':
          communityMember?.handleAction ? await communityMember?.handleAction?.() : navigate(communityMember?.navigateTo ?? '');
          break;
        case 'gold':
          setStartCreateSubdomainProcess(true);
          break;
        default:
          break;
      }
    } else {
      showWalletConnectionToast();
    }
  };

  return (
    <div className={cn(
      "p-0.5 rounded-sm w-full h-full",
      variant === "bronze" && "bronze-gradient-bg",
      variant === "silver" && "silver-gradient-bg",
      variant === "gold" && "golden-gradient-bg"
    )}
    >
      <div
        className={cn(
          "h-[390px] lg:h-full w-full rounded-sm p-6 bg-su_primary_bg flex flex-col gap-6",
          className
        )}
      >

        {/* Header section */}
        <div className="flex flex-col gap-4" >
          <div className='flex flex-col lg:flex-row items-center lg:justify-between gap-3' >
            <img className='w-[60px] h-[60px]' src={communityMember?.iconLink} alt={variant} />

            <Button
              isLoading={isCreatingPlatformWallet}
              onClick={handleAction}
              className={cn(
                (smartAccount && variant === "bronze") && "opacity-50"
              )}
            >
              {/* Disconnected State */}
              {(!wallet.isConnected && !wallet.address) && "Login to Access"}

              {/* Connected State */}
              {((wallet.isConnected && wallet.address) && variant !== "bronze") && communityMember?.buttonTitle}

              {/* Connected State */}
              {((wallet.isConnected && wallet.address) && variant === "bronze" && !smartAccount) && communityMember?.buttonTitle}

              {/* Already smart account exists State */}
              {(wallet.isConnected && smartAccount && variant === "bronze") && "Platform Wallet Created"}
            </Button>
          </div>

          <p className='text-center lg:text-start uppercase text-xs text-su_secondary font-normal' >level {communityMember?.level} membership</p>
        </div>

        {/* Body section */}
        <div className="flex flex-col gap-4">
          <h3 className='text-base font-semibold' >{communityMember?.title}</h3>

          <div className='flex flex-col gap-2' >
            {
              communityMember?.contentList.map(item => (
                <p key={variant + "-" + item.key} className='w-full flex items-start gap-2.5' >
                  <img className='w-3 h-3 lg:w-5 lg:h-5 object-cover rounded-full' src="/assets/svgs/CommunityListIcon.svg" alt="" />
                  <span className='text-xs lg:text-sm font-normal text-su_secondary' >{item.title}</span>
                </p>
              ))
            }
          </div>
        </div>

      </div>

      {/* Creating new subname */}
      <CreateNewSubdomainProcess setStartCreateSubdomainProcess={setStartCreateSubdomainProcess} startCreateSubdomainProcess={startCreateSubdomainProcess} />
    </div >
  );
};

export default CommunityMemberCard;