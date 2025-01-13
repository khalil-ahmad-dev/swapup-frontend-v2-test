import ProfileHeader from "@/components/custom/profile/ProfileHeader";
import CustomTabContainer from "@/components/custom/shared/CustomTabContainer";
import LoadingDataset from "@/components/custom/shared/LoadingDataset";
import { defaults } from "@/constants/defaults";
import { handleShowNotificationToast } from "@/lib/helpers";
import { getActiveTabFromPathname } from "@/lib/utils";
import { getSubscriptionTokenApi, getUserByWalletIdApi } from "@/service/api";
import { useGlobalStore } from "@/store/global-store";
import { useProfileStore } from "@/store/profile";
import { useSwapMarketStore } from "@/store/swap-market";
import { SUI_SubscriptionToken } from "@/types/global.types";
import { IProfile } from "@/types/profile.types";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [wallet, setUserProfile] = useProfileStore(state => [state.profile.wallet, state.setUserProfile]);
  const setSubscriptionToken = useGlobalStore(state => state.setSubscriptionToken);

  const handleResetData = () => {
    // resetRoom('privateMarket', 'privateRoom');
  };

  const queries = useQueries({
    queries: [
      {
        queryKey: [`getUserByWalletIdApi-key${wallet.address}`],
        queryFn: async () => {
          try {
            if (wallet.address && wallet.isConnected) {
              const userResponse = await getUserByWalletIdApi(wallet.address);

              if (userResponse) {
                const { createdAt, description, title, images, tags, social_links, points, smartAccount } = userResponse.data.data;
                const latestProfile = useProfileStore.getState().profile;

                const userProfileDetails: IProfile = {
                  ...latestProfile,
                  avatar: images.avatar,
                  coverImage: images.coverImage,
                  joinDate: createdAt,
                  details: {
                    ...latestProfile.details,
                    title: title,
                    description: description,
                    points: points,
                    tags: tags,
                    twitter: social_links.twitter,
                    warpcast: social_links.warpcast,
                    smartAccount
                  }
                };

                setUserProfile(userProfileDetails);

                // console.log("user details: ", userProfileDetails);
              }
              return userResponse.data.data;
            }
            return null;

          } catch (error: any) {
            handleShowNotificationToast(
              'error',
              "unable to get user profile",
              error.message
            );

            throw error;
          }
        },
        retry: false,
        staleTime: 0,
        refetchOnMount: true,
        enabled: (wallet.address && wallet.isConnected) ? true : false
      },
      {
        queryKey: [`getSubscriptionTokenApi-key${wallet.address}`],
        queryFn: async () => {
          try {
            const subscriptionTokenRes = await getSubscriptionTokenApi();
            // console.log("subscriptionTokenRes: ", subscriptionTokenRes);
            setSubscriptionToken(subscriptionTokenRes.data.data as SUI_SubscriptionToken);
            return subscriptionTokenRes.data.data;
          } catch (error: any) {
            handleShowNotificationToast(
              'error',
              "unable to get subscription token",
              error.message
            );

            throw error;
          }
        },
        retry: false,
        staleTime: 0,
        refetchOnMount: true,
        enabled: (wallet.address && wallet.isConnected) ? true : false
      }
    ]
  });

  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const isSuccess = queries.every(query => query.isSuccess);

  return (
    <>
      <section className="flex flex-col gap-4" >
        <LoadingDataset
          isLoading={isLoading}
          title="Loading user profile"
          description="User profile data is being loaded..."
        />

        {!isLoading &&
          <ProfileHeader
            resetData={handleResetData}
            existDescription="By leaving profile, your changes will not be saved"
            existTitle="Are you sure you want to exit your Profile page?"
          />
        }

        <CustomTabContainer >
          {
            defaults.profile.tabs.map(tab => {
              const activeTab = getActiveTabFromPathname(pathname);
              return (
                <button
                  key={tab.key}
                  onClick={() => navigate(tab.path)}
                  className={`relative flex bg-transparent ${activeTab === tab.key ? "text-su_primary" : "text-muted-foreground"} items-center gap-1 lg:gap-3 text-sm font-bold px-3 `}
                >
                  {tab.title}
                  <span className={`${activeTab === tab.key ? "absolute -bottom-1.5 lg:-bottom-3.5 left-0 border-b-2 border-su_primary w-full" : ""}`} ></span>
                </button>
              );
            })
          }
        </CustomTabContainer>

        <div className="w-full" >
          <Outlet />
        </div>
      </section >
    </>
  );
};

export default UserProfile;