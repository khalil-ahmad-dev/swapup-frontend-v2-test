import { useProfileStore } from '@/store/profile';
import CopyTile from '../../tiles/CopyTile';
import { getDefaultNftImageOnError, getShortenWalletAddress } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { handleShowNotificationToast, showUnderConstructionToast } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionTokenBalanceApi } from '@/service/api';
import LoadingDataset from '../../shared/LoadingDataset';
import { SUI_SubscriptionTokenBalance } from '@/types/global.types';
import { useNavigate } from 'react-router-dom';

const PlatformWalletSection = () => {
  const navigate = useNavigate();
  const [{ wallet, ...userProfile }, subscriptionTokenBalance, setSubscriptionTokenBalance] = useProfileStore(state => [state.profile, state.overviewTab.subscriptionTokenBalance, state.overviewTab.setSubscriptionTokenBalance]);

  const { isLoading } = useQuery({
    queryKey: [`getSubscriptionTokenBalanceApi-key${wallet.address}`],
    queryFn: async () => {
      try {
        if (wallet.address && wallet.isConnected) {
          const response = await getSubscriptionTokenBalanceApi(wallet.address);
          setSubscriptionTokenBalance(response.data.data as SUI_SubscriptionTokenBalance);
          return response.data.data;
        }

        return null;
      } catch (error: any) {
        handleShowNotificationToast(
          "error",
          `Request failed!`,
          `${error.message}`
        );

        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    enabled: (wallet.address && wallet.isConnected) ? true : false
  });

  return (
    <div className='flex flex-col gap-6 lg:gap-0 h-full' >
      <header className='flex items-center justify-between' >
        <h2 className='text-sm font-semibold'>Platform Wallet</h2>

        {userProfile.details?.smartAccount &&
          <CopyTile textToCopy={userProfile.details.smartAccount}>
            {getShortenWalletAddress(userProfile.details.smartAccount, 'medium')}
          </CopyTile>
        }
      </header>

      {!isLoading &&
        <div className='flex flex-col gap-6 lg:gap-0 lg:justify-between h-full lg:pt-12' >
          <div className='rounded-sm px-6 py-8 bg-white/5 text-sm text-su_secondary font-normal flex items-center gap-20' >

            <p className='flex items-center gap-2' >
              <img
                className='w-5 h-5 mt-0.5'
                src={subscriptionTokenBalance?.iconUrl}
                alt=""
                onError={getDefaultNftImageOnError}
                loading="lazy"
              />

              {subscriptionTokenBalance?.symbol}
            </p>

            <p>{subscriptionTokenBalance ? `${subscriptionTokenBalance.balance} / ${subscriptionTokenBalance.usdBalance} $` : "0"}</p>
          </div>

          <div className='flex justify-center'>
            <Button
              className='px-10 py-3'
              onClick={() => navigate("/swap-up/profile/membership-store")}
            >
              Buy {subscriptionTokenBalance?.symbol} Tokens
            </Button>
          </div>
        </div>
      }

      {isLoading &&
        <div className='flex items-center justify-center w-full h-full' >
          <LoadingDataset
            isLoading={isLoading}
            title="Loading subscription token balance..."
          />
        </div>
      }

    </div>
  );
};

export default PlatformWalletSection;