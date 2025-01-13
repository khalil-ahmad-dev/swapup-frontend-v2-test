import { useEffect, useState } from "react";
import RoomLayoutCard from "@/components/custom/swap-market/RoomLayoutCard";
import { Button } from "@/components/ui/button";
import { useSwapMarketStore } from "@/store/swap-market";
import { useNavigate, useParams } from "react-router-dom";
import { isValidTradeId, isValidWalletAddress } from "@/lib/utils";
import { getWalletProxy } from "@/lib/walletProxy";
import { useCreatePrivateSwapOffer } from "@/service/queries/swap-market.query";
import { SUE_SWAP_OFFER_TYPE } from "@/constants/enums";
import SwapDetailsDialog from "@/components/custom/swap-market/SwapDetailsDialog";
import { SUI_CurrencyChainItem, SUI_SwapCreation } from "@/types/global.types";
import { useProfileStore } from "@/store/profile";
import LoadingDataset from "@/components/custom/shared/LoadingDataset";
import { useQuery } from "@tanstack/react-query";
import { useGlobalStore } from "@/store/global-store";
import { handleShowNotificationToast } from "@/lib/helpers";
import CustomRoomHeader from "@/components/custom/swap-market/CustomRoomHeader";
import RoomHeaderSide from "@/components/custom/swap-market/RoomHeaderSide";
import ExitPageDialog from "@/components/custom/shared/ExitPageDialog";
import { defaults } from "@/constants/defaults";
import { createSwapThroughSmartContractApi, getCurrenciesByChainIdApi } from "@/service/api";


const PrivateRoom = () => {

  const state = useSwapMarketStore(state => state.privateMarket.privateRoom);
  const [wallet, profile] = useProfileStore(state => [state.profile.wallet, state.profile]);
  const [setAvailableCurrencies] = useGlobalStore(state => [state.setAvailableCurrencies]);

  const [enableApproveButtonCriteria, setEnableApproveButtonCriteria] = useState(false);
  const [swapCreation, setSwapCreation] = useState<SUI_SwapCreation>({ isLoading: false, created: false });

  const { counterPartyWallet, privateTradeId } = useParams();
  const navigate = useNavigate();

  const { mutateAsync: createSwapOffer } = useCreatePrivateSwapOffer();

  const { isSuccess, isLoading } = useQuery({
    queryKey: [`getCurrenciesByChainIdApi`],
    queryFn: async () => {
      try {
        const response = await getCurrenciesByChainIdApi();
        // console.log("getCurrenciesByChainIdApi: ", response.data.data);
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
    retry: false
  });

  const handleCreatePrivatePartySwap = async () => {
    try {
      setSwapCreation(prev => ({ ...prev, isLoading: true }));

      await state.createPrivateMarketSwap(SUE_SWAP_OFFER_TYPE.PRIMARY, wallet.address);
      const createdSwap = useSwapMarketStore.getState().privateMarket.privateRoom.swap;

      if (!createdSwap) {
        throw new Error("Failed to create swap.");
      }
      const userSignMessage = defaults.userSignMessages.private.create;
      const sign = await getWalletProxy().getUserSignature(createdSwap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }

      await state.setSwapEncodedMsgAndSign("swapEncodedBytes", sign);

      const approval = await getWalletProxy().getUserApproval(createdSwap, true);
      if (!approval) {
        throw new Error("User approval not granted.");
      }
      const updatedSwap = await useSwapMarketStore.getState().privateMarket.privateRoom.swap;

      // console.log("Updated swap: ", updatedSwap);

      let transactionRes, offerResult;

      if (updatedSwap) {
        const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(updatedSwap);
        transactionRes = await createSwapThroughSmartContractApi({
          signerAddress: wallet.address,
          initiatorAddress: updatedSwap.init_address,
          responderAddress: updatedSwap.accept_address,
          initiatorAssets: initAssets,
          responderAssets: acceptAssets,
          signature: sign,
          userSignMessage,
          swapMode: updatedSwap.swap_mode,
          tradeId: updatedSwap.trade_id,
        });

        offerResult = await createSwapOffer(updatedSwap!);
      }

      console.log("TransactionRes: ", transactionRes);
      console.log("OfferRes: ", offerResult);

      if (offerResult) {
        handleShowNotificationToast(
          "success",
          `Offer sent successfully`,
          `You will receive a notification upon your counterparty's response.`
        );

        setSwapCreation(prev => ({ ...prev, created: true }));
        state.resetPrivateRoom();
        setTimeout(() => {
          navigate("/swap-up/swap-market/private");
        }, 3000);
      }

    } catch (error: any) {
      console.log("Create private swap error: ", error);
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
    state.resetPrivateRoom();

    handleShowNotificationToast(
      "info",
      `Private party room reset!`,
      `Room data deleted for both parties.`
    );
  };

  useEffect(() => {
    if (
      (state.sender.nftsSelectedForSwap.length || state.sender.addedAmount?.amount) &&
      (state.receiver.nftsSelectedForSwap.length || state.receiver.addedAmount?.amount)
    ) {
      setEnableApproveButtonCriteria(true);
    } else {
      setEnableApproveButtonCriteria(false);
    }

  }, [state.sender.nftsSelectedForSwap, state.receiver.nftsSelectedForSwap, state.sender.addedAmount, state.receiver.addedAmount]);

  useEffect(() => {

    if ((counterPartyWallet && !isValidWalletAddress(counterPartyWallet)) || (privateTradeId && !isValidTradeId(privateTradeId))) {
      handleShowNotificationToast(
        'warning',
        `Invalid ${!isValidWalletAddress(counterPartyWallet!) ? "wallet address" : "trade id"}!`,
        ''
      );

      navigate(-1);
    }

    if (counterPartyWallet?.toLocaleLowerCase() === wallet.address.toLocaleLowerCase()) {
      handleShowNotificationToast(
        'warning',
        `Wallet addresses must be different!`,
        "Both party's wallet address cannot be same."
      );

      navigate(-1);
    }

    const handleSetValuesOnCreatingPrivateRoom = async () => {
      state.resetPrivateRoom();
      await state.setValuesOnCreatingPrivateRoom(privateTradeId!, counterPartyWallet!, profile);
    };

    if (counterPartyWallet && privateTradeId && profile) {
      handleSetValuesOnCreatingPrivateRoom();
    }
  }, [counterPartyWallet, privateTradeId]);

  return (
    <section className="room-layout-container" >
      {/*Room header section  */}
      <CustomRoomHeader
        title="Private Room for"
        tardeId={state.uniqueTradeId}
      >
        <RoomHeaderSide
          layoutType="sender"
          roomKey="privateRoom"
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
          roomKey="privateRoom"
          counterPartyWallet={state.receiver.profile.wallet.address}
        />

      </CustomRoomHeader>

      {/*Room content section  */}
      <section className="room-content-section" >
        {
          (state.sender.profile.wallet.address && isSuccess) ?
            <RoomLayoutCard
              layoutType={"sender"}
              roomKey="privateRoom"
              senderWallet={state.sender.profile.wallet.address}
            />
            :
            <div className="rounded-sm border-none w-full h-full flex items-center justify-center dark:bg-su_secondary_bg p-2 lg:p-6" >
              <LoadingDataset
                isLoading={!state.sender.profile.wallet.address || isLoading}
                title="Loading wallet connected wallet information"
              />
            </div>
        }

        {(state.receiver.profile.wallet.address && isSuccess) ?
          <RoomLayoutCard
            layoutType={"receiver"}
            counterPartyWallet={state.receiver.profile.wallet.address}
            roomKey="privateRoom"
          />
          :
          <div className="rounded-sm border-none w-full h-full flex items-center justify-center dark:bg-su_secondary_bg p-2 lg:p-6" >
            <LoadingDataset
              isLoading={!state.receiver.profile.wallet.address || isLoading}
              title="Loading wallet counter party wallet information"
            />
          </div>
        }
      </section>

      {/* Room footer section */}
      <footer className="room-footer" >

        <ExitPageDialog
          title={"Are you sure you want to exit the trade?"}
          description={"By leaving the room, you will close it for both parties."}
          redirectPath={null}
          resetData={handleResetData}
          buttonClassName="button-varient-outline"
        >
          Go Back
        </ExitPageDialog>

        <SwapDetailsDialog
          state={state}
          enableApproveButtonCriteria={enableApproveButtonCriteria}
          swapCreation={swapCreation}
          handleSwapCreation={handleCreatePrivatePartySwap}
        >
          <Button
            variant={"default"}
            type="submit"
            disabled={!enableApproveButtonCriteria}
          >
            Confirm Trade
          </Button>
        </SwapDetailsDialog>
      </footer >
    </section>
  );

};

export default PrivateRoom;