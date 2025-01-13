import CustomOutlineButton from "@/components/custom/shared/CustomOutlineButton";
import EmptyDataset from "@/components/custom/shared/EmptyDataset";
import LoadingDataset from "@/components/custom/shared/LoadingDataset";
import RoomLayoutCard from "@/components/custom/swap-market/RoomLayoutCard";
import { Button } from "@/components/ui/button";
import { defaults } from "@/constants/defaults";
import { SUE_SWAP_COMPLETE_ACTION, SUE_SWAP_MODE, SUE_SWAP_OFFER_TYPE } from "@/constants/enums";
import { handleShowNotificationToast } from "@/lib/helpers";
import { cn, isValidTradeId } from "@/lib/utils";
import { getWalletProxy } from "@/lib/walletProxy";
import { cancelSwapThroughSmartContractApi, completeSwapThroughSmartContractApi, getCurrenciesByChainIdApi, getSwapDetailsByTradeOrOpenTradeIdApi } from "@/service/api";
import { updatedUserProfilePointsApi } from "@/service/api/user.service";
import { useCancelSwapOffer, useCompleteOpenSwapOffer, useCompletePrivateSwapOffer, useGetSwapDetails, useRejectSwapOffer } from "@/service/queries/swap-market.query";
import { useGlobalStore } from "@/store/global-store";
import { useProfileStore } from "@/store/profile";
import { useSwapMarketStore } from "@/store/swap-market";
import { SUI_CurrencyChainItem, SUI_SwapCreation } from "@/types/global.types";
import { SUI_UpdateProfilePointsPayload } from "@/types/profile.types";
import { SUI_OpenSwap, SUI_SwapPreferences, SUP_CancelSwap, SUP_CompleteSwap, SUP_RejectSwap } from "@/types/swap-market.types";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomRoomHeader from "@/components/custom/swap-market/CustomRoomHeader";
import RoomHeaderSide from "@/components/custom/swap-market/RoomHeaderSide";
import ExitPageDialog from "@/components/custom/shared/ExitPageDialog";
import RejectConfirmationDialog from "@/components/custom/shared/RejectConfirmationDialog";

const ViewSwapRoom = () => {
  const [dataSavedInStore, setDataSavedInStore] = useState({ sender: false, receiver: false });
  const [swapRejection, setSwapRejection] = useState<SUI_SwapCreation>({ created: false, isLoading: false });
  const [swapAcceptance, setSwapAcceptance] = useState<SUI_SwapCreation>({ created: false, isLoading: false });
  const [swapCancel, setSwapCancel] = useState<SUI_SwapCreation>({ created: false, isLoading: false });

  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const { mutateAsync: completeOpenSwapOffer } = useCompleteOpenSwapOffer();
  const { mutateAsync: completePrivateSwapOffer } = useCompletePrivateSwapOffer();
  const { mutateAsync: rejectSwapOffer } = useRejectSwapOffer();
  const { mutateAsync: cancelSwapOffer } = useCancelSwapOffer();

  const navigate = useNavigate();
  const { tradeId, swapRoomMode } = useParams();
  const swapMode = Number(swapRoomMode);

  const state = useSwapMarketStore(state => swapMode === SUE_SWAP_MODE.OPEN ? state.openMarket.openRoom : state.privateMarket.privateRoom);
  const [filteredAvailableCurrencies, setAvailableCurrencies] = useGlobalStore(state => [state.filteredAvailableCurrencies, state.setAvailableCurrencies]);
  const [setStartRecentSwapSharingProcess, setRecentAcceptedSwap] = useGlobalStore(state => [state.setStartRecentSwapSharingProcess, state.setRecentAcceptedSwap]);

  const queries = useQueries({
    queries: [
      {
        queryKey: [`getCurrenciesByChainIdApi`],
        queryFn: async () => {
          try {
            const response = await getCurrenciesByChainIdApi();
            setAvailableCurrencies(response.data.data as SUI_CurrencyChainItem[]);
            return response.data.data;
          } catch (error: any) {
            handleShowNotificationToast(
              "error",
              `Request failed!`,
              `${error.message}`
            );

            throw error;
          }
        },
        staleTime: 0,
        refetchOnMount: true,
        retry: false
      },
      {
        queryKey: [`useGetSwapDetails`],
        queryFn: async () => {
          try {
            if (tradeId) {
              const response = await getSwapDetailsByTradeOrOpenTradeIdApi(tradeId!);
              // state.resetViewSwapRoom();
              await state.setValuesOnViewSwapRoom(tradeId, response.data.data as SUI_OpenSwap);
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
        enabled: !!tradeId,
        staleTime: 0,
        refetchOnMount: true,
        retry: false
      }
    ]
  });

  const swapPreferences: SUI_SwapPreferences | null = useSwapMarketStore(state => swapMode === SUE_SWAP_MODE.OPEN ? state.openMarket.openRoom.swap.swap_preferences : null);
  const wallet = useProfileStore(state => state.profile.wallet);

  const handleResetData = async () => {
    state.resetViewSwapRoom();

    handleShowNotificationToast(
      "info",
      `View room reset!`,
      `View room data deleted for both parties.`
    );
  };

  const handleCounterSwap = () => {
    const swap = state.swap!;
    state.resetViewSwapRoom();
    navigate(`/swap-up/swap-market/counter-offer/${swap.swap_mode}/${swap.trade_id}`);
  };

  const handleSwapAccept = async () => {
    try {

      setSwapAcceptance(prev => ({ ...prev, isLoading: true }));
      const swap = state.swap!;
      const userSignMessage = (swap.swap_mode === SUE_SWAP_MODE.OPEN) ? defaults.userSignMessages.open.accept : defaults.userSignMessages.private.accept;
      const sign = await getWalletProxy().getUserSignature(swap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }

      swap.accept_sign = sign;

      const approval = await getWalletProxy().getUserApproval(swap, false);

      if (!approval) {
        throw new Error("User approval not granted.");
      }

      const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(swap);

      const transactionRes = await completeSwapThroughSmartContractApi({
        signerAddress: wallet.address,
        initiatorAddress: swap.init_address,
        responderAddress: swap.accept_address,
        initiatorAssets: initAssets,
        responderAssets: acceptAssets,
        signature: sign,
        swapAction: SUE_SWAP_COMPLETE_ACTION.COMPLETE,
        swapMode: swap.swap_mode,
        tradeId: swap.trade_id,
        userSignMessage
      });

      console.log("transactionRes: ", transactionRes);

      const payload: SUP_CompleteSwap = {
        ...swap,
        status: transactionRes.status || 0,
        tx: transactionRes.data.transaction.transactionHash || "",
        notes: transactionRes.data.transaction.chain.id || "",
        timestamp: transactionRes.data.transaction.timestamp || "",
      };

      const pointsApiPayload: SUI_UpdateProfilePointsPayload = {
        pointsToAdd: swap.swap_mode === SUE_SWAP_MODE.OPEN ? defaults.pointSystem['completed-open-trade'] : defaults.pointSystem['completed-private-trade'],
        keyType: swap.swap_mode === SUE_SWAP_MODE.OPEN ? 'completed-open-trade' : 'completed-private-trade',
        walletId: swap.accept_address,
        counterPartyWalletId: swap.init_address,
        defaultPointSystem: defaults.userSettings.newUser.points
      };

      let offerResult;
      let pointsUpdateResult;
      //calling actual api 
      if (swap.swap_mode === SUE_SWAP_MODE.OPEN) {
        offerResult = await completeOpenSwapOffer(payload);
        pointsUpdateResult = await updatedUserProfilePointsApi(pointsApiPayload);
      }

      if (swap.swap_mode === SUE_SWAP_MODE.PRIVATE) {
        offerResult = await completePrivateSwapOffer(payload);
        pointsUpdateResult = await updatedUserProfilePointsApi(pointsApiPayload);
      }

      if (offerResult && pointsUpdateResult) {
        handleShowNotificationToast(
          "success",
          `${swap.swap_mode === SUE_SWAP_MODE.OPEN ? "Open" : "Private"} Swap Completed Successfully`,
          `You will receive a notification on metamask about the transaction.`
        );

        setSwapAcceptance(prev => ({ ...prev, created: true }));
        setRecentAcceptedSwap(swap);
        setStartRecentSwapSharingProcess(true);
        navigate("/swap-up/my-swaps/history");
      }

    } catch (error: any) {
      console.log("Accept swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setSwapAcceptance(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSwapReject = async () => {
    try {

      setSwapRejection(prev => ({ ...prev, isLoading: true }));
      const swap = state.swap!;

      const userSignMessage = (swap.swap_mode === SUE_SWAP_MODE.OPEN) ? defaults.userSignMessages.open.reject : defaults.userSignMessages.private.reject;
      const sign = await getWalletProxy().getUserSignature(swap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }
      swap.accept_sign = sign;

      const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(swap);

      const transactionRes = await completeSwapThroughSmartContractApi({
        signerAddress: wallet.address,
        initiatorAddress: swap.init_address,
        responderAddress: swap.accept_address,
        initiatorAssets: initAssets,
        responderAssets: acceptAssets,
        signature: sign,
        swapAction: SUE_SWAP_COMPLETE_ACTION.REJECT,
        swapMode: swap.swap_mode,
        tradeId: swap.trade_id,
        userSignMessage
      });

      console.log("transactionRes: ", transactionRes);

      if (swap.id) {
        const payload: SUP_RejectSwap = {
          id: Number(swap.id),
          sign_message: sign ? sign : ''
        };
        const offerResult = await rejectSwapOffer(payload);

        if (offerResult) {
          handleShowNotificationToast(
            "success",
            `Swap rejected successfully`,
            `You have successfully rejected the swap offer`
          );

          setSwapRejection(prev => ({ ...prev, created: true }));
          setTimeout(() => {
            navigate("/swap-up/my-swaps/history");
          }, 500);
        }

      }

    } catch (error: any) {
      console.log("Reject swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );

    } finally {
      setSwapRejection(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelSwap = async () => {
    try {
      setSwapCancel(prev => ({ ...prev, isLoading: true }));
      const swap = state.swap!;

      const userSignMessage = (swap.swap_mode === SUE_SWAP_MODE.OPEN) ? defaults.userSignMessages.open.cancelProposal : defaults.userSignMessages.private.cancel;
      // Cancel swap blockchain logic
      const sign = await getWalletProxy().getUserSignature(swap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }

      const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(swap);
      const transactionRes = await cancelSwapThroughSmartContractApi({
        signerAddress: wallet.address,
        initiatorAddress: swap.init_address,
        responderAddress: swap.accept_address,
        initiatorAssets: initAssets,
        responderAssets: acceptAssets,
        signature: sign,
        swapMode: swap.swap_mode,
        tradeId: swap.trade_id,
        userSignMessage
      });

      console.log("transactionRes: ", transactionRes);

      // enforcing swap mode to private because
      // 1.The original open swap can only be canceled through manage page
      // 2.The user can only cancel the private swap and single proposed open swap

      const payload: SUP_CancelSwap = {
        swap_mode: SUE_SWAP_MODE.PRIVATE,
        trade_id: swap.trade_id,
        open_trade_id: swap.swap_mode === SUE_SWAP_MODE.OPEN ? (swap as SUI_OpenSwap).open_trade_id : '',
        sign_message: sign
      };

      const offerResult = await cancelSwapOffer(payload);

      if (offerResult) {
        handleShowNotificationToast(
          "success",
          `Swap closed successfully`,
          `You have successfully closed the swap`
        );

        setSwapCancel(prev => ({ ...prev, created: true }));
        navigate("/swap-up/my-swaps/history");
      }

    } catch (error: any) {
      console.log("Cancel swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );

    } finally {
      setSwapCancel(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if ((tradeId && !isValidTradeId(tradeId)) || (swapMode !== 0 && swapMode !== 1)) {

      handleShowNotificationToast(
        "warning",
        `Redirecting`,
        `Invalid swap room mode.`,
        6000
      );

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  }, [tradeId, swapMode]);

  return (
    <section className="room-layout-container" >
      {/*Room header section  */}
      <CustomRoomHeader
        title="View Swap Room for"
        tardeId={state.uniqueTradeId}
        swapPreferences={swapPreferences}
        showOpenMarketTile={swapMode === SUE_SWAP_MODE.OPEN ? true : false}
      >
        <RoomHeaderSide
          layoutType="sender"
          roomKey={swapMode === SUE_SWAP_MODE.OPEN ? 'openRoom' : 'privateRoom'}
          senderWallet={state.sender.profile.wallet.address}
        />

        <svg className="rotate-90 lg:rotate-0 mx-auto w-8 lg:w-16" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.91992" y="1.57617" width="38" height="38" rx="19" stroke="url(#paint0_linear_1_6150)" strokeWidth="2" />
          <path d="M23.5126 12.5762L29.9199 19.23H12.2777V17.435H25.7475L22.2906 13.8452L23.5126 12.5762ZM29.5621 21.9224V23.7173H16.0924L19.5493 27.3072L18.3273 28.5762L11.9199 21.9224H29.5621Z" fill="#7586FF" />
          <defs>
            <linearGradient id="paint0_linear_1_6150" x1="40.9199" y1="8.17617" x2="-1.41297" y2="19.2907" gradientUnits="userSpaceOnUse">
              <stop stopColor="#51C0FF" />
              <stop offset="1" stopColor="#9452FF" />
            </linearGradient>
          </defs>
        </svg>

        <RoomHeaderSide
          layoutType="receiver"
          roomKey={swapMode === SUE_SWAP_MODE.OPEN ? 'openRoom' : 'privateRoom'}
          counterPartyWallet={state.receiver.profile.wallet.address}
        />
      </CustomRoomHeader>

      {/*Room content section  */}
      <section
        className={cn(
          "room-content-section",
          swapMode === SUE_SWAP_MODE.OPEN && "!mt-[70px]"
        )}
      >
        {
          (queries[0] && queries[1]).isSuccess && state.sender.profile.wallet.address ?
            <RoomLayoutCard
              layoutType={"sender"}
              roomKey={swapMode === SUE_SWAP_MODE.OPEN ? 'openRoom' : 'privateRoom'}
              swapRoomViewType="view"
              setDataSavedInStore={setDataSavedInStore}
              senderWallet={state.sender.profile.wallet.address}
            />
            :
            <div className="rounded-sm border-none w-full h-full flex items-center justify-center dark:bg-su_secondary_bg p-2 lg:p-6" >
              <LoadingDataset
                isLoading={(queries[0] || queries[1]).isLoading || !state.sender.profile.wallet.address}
                title="Loading wallet address"
              />

              {
                queries[1].isError &&
                <EmptyDataset
                  showBackgroundPicture={false}
                  className="lg:h-[200px]"
                  title="No Results Found"
                  description="We couldn't find any results matching your search query. Please try again with a different keyword or refine your search criteria."
                  icon={
                    <svg className="w-8" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10.5706 2.67447L23.7935 8.45832L18.4991 10.7735L5.3523 5.02231C5.64832 4.71198 6.01034 4.46699 6.42237 4.30366L10.5706 2.67447ZM13.2448 1.62509L16.345 0.408294C17.7316 -0.136098 19.2667 -0.136098 20.6533 0.408294L30.5779 4.30366C30.9804 4.46205 31.3447 4.70717 31.6459 5.02231L26.3336 7.34565L13.2448 1.62509ZM32.486 6.87608L19.4992 12.5558V27.7678C19.8934 27.6998 20.2801 27.5917 20.6533 27.4452L30.5779 23.5478C31.1437 23.3254 31.6302 22.9333 31.9733 22.423C32.3165 21.9128 32.5001 21.3084 32.5 20.6895V7.1619C32.5 7.06663 32.4953 6.97135 32.486 6.87608ZM17.4991 12.5579V21.0713C17.4991 15.9979 13.0208 11.8841 7.49844 11.8841C6.44637 11.8841 5.43831 12.0679 4.49825 12.4088V7.1619C4.49964 7.06649 4.50431 6.97116 4.51225 6.87608L17.4991 12.5579ZM11.6907 26.7939C10.5226 27.6861 9.07053 28.2169 7.49844 28.2169C5.92196 28.2165 4.3918 27.6729 3.15569 26.6742C1.91959 25.6754 1.04992 24.2801 0.687503 22.714C0.325087 21.148 0.49114 19.5029 1.15878 18.0452C1.82641 16.5874 2.95655 15.4024 4.36618 14.6819C5.77582 13.9615 7.38243 13.7478 8.92587 14.0754C10.4693 14.4031 11.8592 15.2529 12.8706 16.4873C13.8819 17.7217 14.4554 19.2684 14.4983 20.877C14.5412 22.4856 14.0509 24.0618 13.1068 25.3505L18.2071 30.5566L16.7841 31.9929L11.6907 26.7939ZM3.96268 24.6804C4.90042 25.6376 6.17227 26.1753 7.49844 26.1753C8.8246 26.1753 10.0964 25.6376 11.0342 24.6804C11.9719 23.7232 12.4987 22.425 12.4987 21.0713C12.4987 19.7177 11.9719 18.4194 11.0342 17.4622C10.0964 16.5051 8.8246 15.9673 7.49844 15.9673C6.17227 15.9673 4.90042 16.5051 3.96268 17.4622C3.02494 18.4194 2.49812 19.7177 2.49812 21.0713C2.49812 22.425 3.02494 23.7232 3.96268 24.6804Z" fill="#565665" />
                    </svg>
                  }
                />
              }
            </div>
        }

        {(queries[0] && queries[1]).isSuccess && (state.receiver.profile.wallet.address) ?
          <RoomLayoutCard
            counterPartyWallet={state.receiver.profile.wallet.address}
            layoutType={"receiver"}
            roomKey={swapMode === SUE_SWAP_MODE.OPEN ? 'openRoom' : 'privateRoom'}
            setDataSavedInStore={setDataSavedInStore}
            swapRoomViewType="view"
          />
          :
          <div className="rounded-sm border-none w-full h-full flex items-center justify-center dark:bg-su_secondary_bg p-2 lg:p-6" >
            <LoadingDataset
              isLoading={(queries[0] || queries[1]).isLoading || !state.receiver.profile.wallet.address}
              title="Loading counter-party address"
            />

            {
              queries[1].isError &&
              <EmptyDataset
                showBackgroundPicture={false}
                className="lg:h-[200px]"
                title="No Results Found"
                description="We couldn't find any results matching your search query. Please try again with a different keyword or refine your search criteria."
                icon={
                  <svg className="w-8" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.5706 2.67447L23.7935 8.45832L18.4991 10.7735L5.3523 5.02231C5.64832 4.71198 6.01034 4.46699 6.42237 4.30366L10.5706 2.67447ZM13.2448 1.62509L16.345 0.408294C17.7316 -0.136098 19.2667 -0.136098 20.6533 0.408294L30.5779 4.30366C30.9804 4.46205 31.3447 4.70717 31.6459 5.02231L26.3336 7.34565L13.2448 1.62509ZM32.486 6.87608L19.4992 12.5558V27.7678C19.8934 27.6998 20.2801 27.5917 20.6533 27.4452L30.5779 23.5478C31.1437 23.3254 31.6302 22.9333 31.9733 22.423C32.3165 21.9128 32.5001 21.3084 32.5 20.6895V7.1619C32.5 7.06663 32.4953 6.97135 32.486 6.87608ZM17.4991 12.5579V21.0713C17.4991 15.9979 13.0208 11.8841 7.49844 11.8841C6.44637 11.8841 5.43831 12.0679 4.49825 12.4088V7.1619C4.49964 7.06649 4.50431 6.97116 4.51225 6.87608L17.4991 12.5579ZM11.6907 26.7939C10.5226 27.6861 9.07053 28.2169 7.49844 28.2169C5.92196 28.2165 4.3918 27.6729 3.15569 26.6742C1.91959 25.6754 1.04992 24.2801 0.687503 22.714C0.325087 21.148 0.49114 19.5029 1.15878 18.0452C1.82641 16.5874 2.95655 15.4024 4.36618 14.6819C5.77582 13.9615 7.38243 13.7478 8.92587 14.0754C10.4693 14.4031 11.8592 15.2529 12.8706 16.4873C13.8819 17.7217 14.4554 19.2684 14.4983 20.877C14.5412 22.4856 14.0509 24.0618 13.1068 25.3505L18.2071 30.5566L16.7841 31.9929L11.6907 26.7939ZM3.96268 24.6804C4.90042 25.6376 6.17227 26.1753 7.49844 26.1753C8.8246 26.1753 10.0964 25.6376 11.0342 24.6804C11.9719 23.7232 12.4987 22.425 12.4987 21.0713C12.4987 19.7177 11.9719 18.4194 11.0342 17.4622C10.0964 16.5051 8.8246 15.9673 7.49844 15.9673C6.17227 15.9673 4.90042 16.5051 3.96268 17.4622C3.02494 18.4194 2.49812 19.7177 2.49812 21.0713C2.49812 22.425 3.02494 23.7232 3.96268 24.6804Z" fill="#565665" />
                  </svg>
                }
              />
            }
          </div>
        }

      </section>

      {/*Room footer section  */}
      <footer
        className={cn(
          `room-footer`,
          (wallet.address !== state.sender.profile.wallet.address) && "flex-col-reverse gap-4 lg:gap-0 lg:flex-row"
        )}
      >

        <div className="w-full flex flex-row items-center gap-2 md:gap-0 justify-between" >
          <div className="flex items-center gap-2" >
            <ExitPageDialog
              title={"Are you sure you want to exit the trade?"}
              description={"By leaving the room, you will close it for both parties."}
              redirectPath={null}
              resetData={handleResetData}
            >
              <Button variant={'outline'} className="py-2">
                Go Back
              </Button>
            </ExitPageDialog>

            {(wallet.address !== state.sender.profile.wallet.address) &&
              <Button
                onClick={() => setOpenRejectDialog(true)}
                variant={"reject"}
                isLoading={swapRejection.isLoading}
                disabled={swapRejection.created}
                iconButton={true}
                iconLocation="right"
                className="py-2"
              >
                <span className="hidden md:inline-block normal-case">Reject offer</span>
              </Button>
            }

          </div>

          <div className="flex items-center gap-2" >
            {wallet.address === state.sender.profile.wallet.address &&
              <CustomOutlineButton
                onClick={async () => { await handleCancelSwap(); }}
                className="px-5 py-2"
                isLoading={swapCancel.isLoading}
                disabled={swapCancel.created}
              >
                Cancel Swap
              </CustomOutlineButton>
            }

            {(wallet.address !== state.sender.profile.wallet.address &&
              state.swap?.offer_type === SUE_SWAP_OFFER_TYPE.PRIMARY) &&
              <CustomOutlineButton
                onClick={handleCounterSwap}
                className="px-5 py-2"
              >
                Counter <span className="hidden md:inline-block">Swap</span>
              </CustomOutlineButton>
            }

            {wallet.address !== state.sender.profile.wallet.address &&
              <Button
                onClick={async () => { await handleSwapAccept(); }}
                isLoading={swapAcceptance.isLoading}
                disabled={swapAcceptance.created}
                variant={"default"} type="submit"
              >
                Accept
              </Button>
            }
          </div>
        </div>
      </footer >

      <RejectConfirmationDialog
        title="Reject offer?"
        description="This offer will be declined and cannot be undone."
        isLoading={swapRejection.isLoading}
        handleConfirm={async () => { await handleSwapReject(); }}
        open={openRejectDialog}
        setOpen={setOpenRejectDialog}
      />
    </section >
  );
};

export default ViewSwapRoom;