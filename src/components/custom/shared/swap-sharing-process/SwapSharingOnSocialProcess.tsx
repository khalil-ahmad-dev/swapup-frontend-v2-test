import React, { useEffect, useState } from 'react';
import SwapSharingCompletionOnSocialDialog from './SwapSharingCompletionOnSocialDialog';

import { getSwapDetailsByTradeOrOpenTradeIdApi, getTwitterClientAccessTokenFromCodeApi, postSwapOnTwitterOnBehalfOfCurrentUserApi } from "@/service/api";
import { SUI_CreateTweetOnBehalfOfUserReqParams, SUI_TwitterAuthCodeToAccessTokenReqParams, SUI_TwitterAccessToken, SUI_TwitterUserInformation } from "@/types/third-party.types";
import { useProfileStore } from "@/store/profile";
import { getUserTwitterAccessApi } from "@/service/api/user.service";
import { Environment } from "@/config";
import { useGlobalStore } from '@/store/global-store';
import { SUE_SWAP_MODE } from '@/constants/enums';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PostFromPreviousTwitterAccountConfirmationDialog from './PostFromPreviousTwitterAccountConfirmationDialog';
import TwitterPostFinalDialog from './TwitterPostFinalDialog';
import { getCurrentBaseUrl, getLastCharacters, handleTwitterSharingProcessLocalstorageState } from '@/lib/utils';
import { handleShowNotificationToast } from '@/lib/helpers';
import { SUI_OpenSwap, SUI_Swap } from '@/types/swap-market.types';
import { twitterPostContent, warpcastFrameUrl } from '@/constants/params';

interface IProp {
  startRecentSwapSharingProcess: boolean;
  setStartRecentSwapSharingProcess: (isOpen: boolean) => void;
}

export type SUT_SwapSharingActionType = "TWITTER_ACCESS_EXIST" | "TWITTER_POST" | "WARPCAST_POST" | "EXCHANGE_CODE_WITH_TOKEN" | "NO_GET_NEW_AUTH_CODE" | "YES_POST_FROM_PREVIOUS_ACCOUNT";

const SwapSharingOnSocialProcess = ({ startRecentSwapSharingProcess, setStartRecentSwapSharingProcess }: IProp) => {

  // loading stats start here
  const [isTwitterPostProcessStarted, setIsTwitterPostProcessStarted] = useState(false);
  const [isLoadingFinalTwitterPost, setIsLoadingFinalTwitterPost] = useState(false);
  const [isLoadingSwapData, setIsLoadingSwapData] = useState(false);
  // loading stats end here

  // Twitter sharing dialogs & data state start here
  const [openTwitterPostConfirmationDialog, setOpenTwitterPostConfirmationDialog] = useState(false);
  const [openFinalTwitterPostDialog, setOpenFinalTwitterPostDialog] = useState(false);
  const [previousTwitterUserInfo, setPreviousTwitterUserInfo] = useState<SUI_TwitterUserInformation | null>(null);
  // Twitter sharing dialogs & data state end here

  const [recentAcceptedSwap, setRecentAcceptedSwap] = useGlobalStore(state => [state.recentAcceptedSwap, state.setRecentAcceptedSwap]);
  const [wallet] = useProfileStore(state => [state.profile.wallet.address]);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [URLSearchParams] = useSearchParams();

  const twitterAuthCode = URLSearchParams.get('code');
  const twitterAuthError = URLSearchParams.get('error');


  const baseUrl = getCurrentBaseUrl();
  const fallbackUrl = `${baseUrl}/swap-up/swap-market/open`;

  const handleExchangeCodeWithToken = async () => {
    try {
      const authCodeToTokenPayload: SUI_TwitterAuthCodeToAccessTokenReqParams = {
        code: twitterAuthCode!,
        redirectUri: fallbackUrl,
        walletAddress: wallet
      };

      const accessTokenRes = await getTwitterClientAccessTokenFromCodeApi(authCodeToTokenPayload);
      return accessTokenRes;
    } catch (error) {
      throw error;
    }
  };

  const handlePostTweet = async (currentTradeId: string) => {
    try {
      const twitterPostPayload: SUI_CreateTweetOnBehalfOfUserReqParams = {
        imageProps: {
          tradeId: getLastCharacters(currentTradeId, 6),
          initTokens: recentAcceptedSwap?.metadata.init.tokens!,
          acceptTokens: recentAcceptedSwap?.metadata.accept ? recentAcceptedSwap?.metadata.accept.tokens : [],
          title: twitterPostContent.imageTitle
        },
        appLink: twitterPostContent.appLink,
        postTitle: twitterPostContent.postTitle,
        hashtags: twitterPostContent.hashtags,
        mentions: twitterPostContent.mentions,
        postDescription: twitterPostContent.postDescription,
        walletAddress: wallet
      };

      const postCreated = await postSwapOnTwitterOnBehalfOfCurrentUserApi(twitterPostPayload);
      return postCreated;

    } catch (error) {
      throw error;
    }
  };

  const getTwitterAuthCode = () => {
    const twitterOAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${Environment.TWITTER_CLIENT_ID}&redirect_uri=${fallbackUrl}&scope=tweet.read%20users.read%20follows.read%20offline.access%20tweet.write&state=state&code_challenge=challenge&code_challenge_method=plain`;
    window.location.href = twitterOAuthUrl;
  };

  const handleShareSwapPostOnSocialPlatform = async (platformActionType: SUT_SwapSharingActionType) => {

    const postTitle: string = `Check out my recent ${recentAcceptedSwap?.swap_mode === SUE_SWAP_MODE.OPEN ? "open" : "private"} Swap `;
    let currentTradeId = '';

    if (recentAcceptedSwap) {
      currentTradeId = (recentAcceptedSwap.trade_id ? recentAcceptedSwap.trade_id : (recentAcceptedSwap as SUI_OpenSwap).open_trade_id);
    }

    switch (platformActionType) {

      case 'TWITTER_ACCESS_EXIST':
        let isUserTwitterAccessAlreadyExist: boolean = false;
        // Setting Loading state
        setIsTwitterPostProcessStarted(true);
        handleTwitterSharingProcessLocalstorageState("SET", currentTradeId);

        // Checking if the users twitter access already exist in DB or not
        try {
          const response = await getUserTwitterAccessApi(wallet);

          const twitterAccessRes: SUI_TwitterAccessToken | null = response.data.data.twitter_access;

          if (twitterAccessRes) {
            isUserTwitterAccessAlreadyExist = true;
          }

          if (twitterAccessRes) {
            isUserTwitterAccessAlreadyExist = true;
            setPreviousTwitterUserInfo(twitterAccessRes.userInfo);
            setOpenTwitterPostConfirmationDialog(true);
          }

        } catch (error) {
          console.log(error);
        }

        // Getting twitter auth code id if user's twitter access does't exist
        if (!isUserTwitterAccessAlreadyExist) {
          getTwitterAuthCode();
        }

        break;

      case 'EXCHANGE_CODE_WITH_TOKEN':
        try {
          const exchangeRes = await handleExchangeCodeWithToken();
          // console.log(exchangeRes);
          handleShareSwapPostOnSocialPlatform('YES_POST_FROM_PREVIOUS_ACCOUNT');
        } catch (error) {
          console.log(error);
        }
        break;

      case 'TWITTER_POST':
        try {
          setIsLoadingFinalTwitterPost(true);
          const postRes = await handlePostTweet(currentTradeId);

          if (postRes) {
            handleShowNotificationToast(
              'success',
              "Twitter post created successfully 🎉",
              `Here is you tweet id ${postRes.data.data.id}`
            );

            handleTwitterSharingProcessLocalstorageState('REMOVE');
            setOpenFinalTwitterPostDialog(false);
          }
        } catch (error: any) {
          handleShowNotificationToast(
            'error',
            "Failed to create twitter post!",
            `${error.message}`
          );
        } finally {
          setIsLoadingFinalTwitterPost(false);
        }
        break;

      case 'NO_GET_NEW_AUTH_CODE':
        getTwitterAuthCode();
        break;

      case 'YES_POST_FROM_PREVIOUS_ACCOUNT':
        setOpenTwitterPostConfirmationDialog(false);
        setOpenFinalTwitterPostDialog(true);
        break;

      case 'WARPCAST_POST':
        const frameUrl = warpcastFrameUrl + currentTradeId;
        const warpcastPostUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(postTitle)}&embeds[]=${frameUrl}`;
        window.open(warpcastPostUrl, "_blank");
        break;
    }
  };

  const getAndSetSwapByTradeId = async (tradeId: string) => {
    // Need to get swap by trade id
    try {
      setIsLoadingSwapData(true);

      const response = await getSwapDetailsByTradeOrOpenTradeIdApi(tradeId);
      setRecentAcceptedSwap(response.data.data as SUI_OpenSwap | SUI_Swap);

    } catch (error: any) {

      handleShowNotificationToast(
        'error',
        "Failed to get swap data!",
        `${error.message}`
      );

    } finally {
      setIsLoadingSwapData(false);
    }
  };

  useEffect(() => {
    if (twitterAuthCode && wallet) {
      handleShareSwapPostOnSocialPlatform("EXCHANGE_CODE_WITH_TOKEN");
      navigate(pathname);
    }

    // if user denies auth then ending loading
    if (twitterAuthError) {
      setIsTwitterPostProcessStarted(false);
      handleTwitterSharingProcessLocalstorageState('SET-FALSE');
      handleShowNotificationToast("error", "Access denied!", "Twitter post access denied, Try again authorizing SwapUp to create twitter post!");
    }

  }, [twitterAuthCode, wallet, twitterAuthError]);


  useEffect(() => {

    // Closing loading if all dialogs are closed but localstorage state does not exist
    if (!(openTwitterPostConfirmationDialog && openFinalTwitterPostDialog) && !handleTwitterSharingProcessLocalstorageState('GET').started) {
      setIsTwitterPostProcessStarted(false);
      handleTwitterSharingProcessLocalstorageState('REMOVE');
    }

    if (handleTwitterSharingProcessLocalstorageState('GET').started &&
      handleTwitterSharingProcessLocalstorageState('GET').tradeId
    ) {
      const { tradeId } = handleTwitterSharingProcessLocalstorageState('GET');
      setIsTwitterPostProcessStarted(true);

      if (recentAcceptedSwap === undefined && tradeId) {
        getAndSetSwapByTradeId(tradeId);
      }
    }

  }, [openFinalTwitterPostDialog, openTwitterPostConfirmationDialog]);

  return (
    <>
      <SwapSharingCompletionOnSocialDialog
        open={startRecentSwapSharingProcess}
        setOpen={setStartRecentSwapSharingProcess}
        isTwitterPostProcessStarted={isTwitterPostProcessStarted}
        handleShareSwapPostOnSocialPlatform={handleShareSwapPostOnSocialPlatform}
        isLoadingSwapData={isLoadingSwapData}
        recentAcceptedSwap={recentAcceptedSwap}
      />

      <PostFromPreviousTwitterAccountConfirmationDialog
        open={openTwitterPostConfirmationDialog}
        setOpen={setOpenTwitterPostConfirmationDialog}
        title="Do you want to post from previous saved Twitter account?"
        description=""
        handleConfirm={() => { console.log("Here we need to do some thing...."); }}
        handleShareSwapPostOnSocialPlatform={handleShareSwapPostOnSocialPlatform}
        previousTwitterUserInfo={previousTwitterUserInfo}
      />

      <TwitterPostFinalDialog
        open={openFinalTwitterPostDialog}
        setOpen={setOpenFinalTwitterPostDialog}
        handleShareSwapPostOnSocialPlatform={handleShareSwapPostOnSocialPlatform}
        isLoadingFinalTwitterPost={isLoadingFinalTwitterPost}
        setIsLoadingFinalTwitterPost={setIsLoadingFinalTwitterPost}
      />
    </>
  );
};

export default SwapSharingOnSocialProcess;