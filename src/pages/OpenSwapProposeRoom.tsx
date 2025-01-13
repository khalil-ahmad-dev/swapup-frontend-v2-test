import EmptyDataset from "@/components/custom/shared/EmptyDataset";
import LoadingDataset from "@/components/custom/shared/LoadingDataset";
import RoomLayoutCard from "@/components/custom/swap-market/RoomLayoutCard";
import SwapDetailsDialog from "@/components/custom/swap-market/SwapDetailsDialog";
import { Button } from "@/components/ui/button";
import { getWalletProxy } from "@/lib/walletProxy";
import { cn, isValidTradeId } from "@/lib/utils";
import { useProposeOpenSwapOffer } from "@/service/queries/swap-market.query";
import { useSwapMarketStore } from "@/store/swap-market";
import { SUI_OpenSwap, SUI_SwapPreferences } from "@/types/swap-market.types";
import { SUI_CurrencyChainItem, SUI_SwapCreation } from "@/types/global.types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileStore } from "@/store/profile";
import { useQueries } from "@tanstack/react-query";
import { getCurrenciesByChainIdApi, getSwapDetailsByTradeOrOpenTradeIdApi, proposeSwapThroughSmartContractApi } from "@/service/api";
import { useGlobalStore } from "@/store/global-store";
import { handleShowNotificationToast } from "@/lib/helpers";
import CustomRoomHeader from "@/components/custom/swap-market/CustomRoomHeader";
import RoomHeaderSide from "@/components/custom/swap-market/RoomHeaderSide";
import ExitPageDialog from "@/components/custom/shared/ExitPageDialog";
import { defaults } from "@/constants/defaults";

const OpenSwapProposeRoom = () => {
  const [enableApproveButtonCriteria, setEnableApproveButtonCriteria] = useState(false);
  const [dataSavedInStore, setDataSavedInStore] = useState({ sender: false, receiver: false });
  const [swapCreation, setSwapCreation] = useState<SUI_SwapCreation>({ isLoading: false, created: false });

  const { openTradeId, tradeId } = useParams();
  const navigate = useNavigate();

  const [wallet, profile] = useProfileStore(state => [state.profile.wallet, state.profile]);
  const state = useSwapMarketStore(state => state.openMarket.openRoom);
  const [setAvailableCurrencies] = useGlobalStore(state => [state.setAvailableCurrencies]);
  const swapPreferences: SUI_SwapPreferences | null = useSwapMarketStore(state => state.openMarket.openRoom.swap.swap_preferences);

  const { mutateAsync: proposeOpenSwapOffer } = useProposeOpenSwapOffer();

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
        queryKey: [`getSwapDetailsByTradeOrOpenTradeIdApi-${openTradeId}-${profile.wallet.address}`],
        queryFn: async () => {
          try {
            if (openTradeId && tradeId) {
              const response = await getSwapDetailsByTradeOrOpenTradeIdApi(openTradeId);
              // console.log("Response data: ", response.data.data);
              await state.setValuesOnProposeOpenSwapRoom(tradeId, response.data.data as SUI_OpenSwap, profile);
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
        enabled: !!tradeId && !!openTradeId,
        staleTime: 0,
        refetchOnMount: true,
        retry: false
      }
    ]
  });

  const handlePurposeOpenSwap = async () => {
    try {
      setSwapCreation(prev => ({ ...prev, isLoading: true }));

      await state.createProposeOpenSwap(wallet.address);
      const createdSwap = useSwapMarketStore.getState().openMarket.openRoom.proposeSwap;

      if (!createdSwap) {
        throw new Error("Failed to create swap.");
      }

      const userSignMessage = defaults.userSignMessages.open.propose;
      const sign = await getWalletProxy().getUserSignature(createdSwap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }

      await state.setSwapEncodedMsgAndSign("swapEncodedBytes", sign);

      const approval = await getWalletProxy().getUserApproval(createdSwap, true);
      if (!approval) {
        throw new Error("User approval not granted.");
      }

      const updatedSwap = await useSwapMarketStore.getState().openMarket.openRoom.proposeSwap;
      if (!updatedSwap) {
        throw new Error("Updated swap not found!");
      }

      if (updatedSwap) {
        const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(updatedSwap);
        const transactionRes = await proposeSwapThroughSmartContractApi({
          signerAddress: wallet.address,
          initiatorAddress: updatedSwap.init_address,
          responderAddress: updatedSwap.accept_address,
          initiatorAssets: initAssets,
          responderAssets: acceptAssets,
          signature: sign,
          userSignMessage,
          tradeId: updatedSwap.trade_id,
          openTradeId: updatedSwap.open_trade_id
        });

        console.log("transactionRes: ", transactionRes);
        const offerResult = await proposeOpenSwapOffer({ ...updatedSwap!, init_sign: sign });

        if (offerResult) {
          handleShowNotificationToast(
            "success",
            `Propose swap offer sent successfully`,
            `You will receive a notification upon your counterparty's response.`
          );

          setSwapCreation(prev => ({ ...prev, created: true }));
          state.resetOpenSwapProposeRoom();
          setTimeout(() => {
            navigate('/swap-up/swap-market');
          }, 3000);
        }
      }

    } catch (error: any) {
      console.log("Propose swap error: ", error);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setSwapCreation(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleResetData = () => {
    state.resetOpenSwapProposeRoom();
    state.resetViewSwapRoom();
  };

  useEffect(() => {
    if (
      (state.sender.nftsSelectedForSwap.length || state.sender.addedAmount?.amount) &&
      (state.receiver.nftsSelectedForSwap.length || state.receiver.nfts?.length || state.receiver.addedAmount?.amount)
    ) {
      setEnableApproveButtonCriteria(true);
    } else {
      setEnableApproveButtonCriteria(false);
    }

  }, [state.sender.nftsSelectedForSwap.length, state.receiver.nftsSelectedForSwap.length, state.receiver.nfts?.length, state.sender.addedAmount, state.receiver.addedAmount]);

  useEffect(() => {
    if ((openTradeId && !isValidTradeId(openTradeId)) || (tradeId && !isValidTradeId(tradeId))) {
      navigate(-1);
    }
  }, [openTradeId, tradeId]);


  return (
    <section className="room-layout-container" >
      {/*Room header section  */}
      <CustomRoomHeader
        title="Propose offer for"
        tardeId={state.uniqueTradeId}
        swapPreferences={swapPreferences}
        showOpenMarketTile
      >
        <RoomHeaderSide
          layoutType="sender"
          roomKey={'openRoom'}
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
          roomKey={'openRoom'}
          counterPartyWallet={state.receiver.profile.wallet.address}
        />

      </CustomRoomHeader>

      {/*Room content section  */}
      <section
        className={cn(
          "room-content-section",
          swapPreferences && "!mt-12"
        )}
      >
        {
          (queries[0] && queries[1]).isSuccess && (state.sender.profile.wallet.address) ?
            <RoomLayoutCard
              layoutType={"sender"}
              roomKey="openRoom"
              // swapRoomViewType="counter"
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
            roomKey="openRoom"
            setDataSavedInStore={setDataSavedInStore}
            swapRoomViewType="propose"
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
      <footer className="room-footer" >
        <ExitPageDialog
          title={"Are you sure you want to exit the trade?"}
          description={"By leaving the room, you will close it for both parties."}
          redirectPath={null}
          resetData={handleResetData}
          buttonClassName="button-varient-outline py-2"
        >
          Go Back
        </ExitPageDialog>

        {/* Swap Details Dialog */}
        <SwapDetailsDialog
          state={state}
          enableApproveButtonCriteria={enableApproveButtonCriteria}
          swapCreation={swapCreation}
          handleSwapCreation={handlePurposeOpenSwap}
          isSwapProposeDialog={true}
        >
          <Button
            variant={"default"}
            type="submit"
            disabled={!enableApproveButtonCriteria}
            className="py-2"
          >
            Propose
          </Button>
        </SwapDetailsDialog>
      </footer >
    </section>
  );
};

export default OpenSwapProposeRoom;