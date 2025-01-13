import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import CopyTile from "@/components/custom/tiles/CopyTile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CustomOutlineButton from "@/components/custom/shared/CustomOutlineButton";
import StaySafeDialog from "@/components/custom/swap-market/StaySafeDialog";
import AvoidingFeeDialog from "@/components/custom/shared/AvoidingFeeDialog";
import { useSwapMarketStore } from "@/store/swap-market";
import RoomLayoutCard from "@/components/custom/swap-market/RoomLayoutCard";
import SwapParametersCard from "@/components/custom/swap-market/open-market/SwapParametersCard";
import { useNavigate, useParams } from "react-router-dom";
import { cn, getLastCharacters, isValidTradeId } from "@/lib/utils";
import SwapDialogSideCard from "@/components/custom/swap-market/SwapDialogSideCard";
import SwapParameterTile from "@/components/custom/tiles/SwapParameterTile";
import moment from "moment";
import ChainTile from "@/components/custom/tiles/ChainTile";
import { SUP_CreateOpenSwap } from "@/types/swap-market.types";
import { SUE_SWAP_MODE, SUE_SWAP_OFFER_TYPE } from "@/constants/enums";
import { useCreateOpenSwapOffer } from "@/service/queries/swap-market.query";
import { useProfileStore } from "@/store/profile";
import LoadingDataset from "@/components/custom/shared/LoadingDataset";
import { useQueries } from "@tanstack/react-query";
import { createSwapThroughSmartContractApi, getAvailableCollectionsApi, getCurrenciesByChainIdApi } from "@/service/api";
import { useGlobalStore } from "@/store/global-store";
import { SUI_CollectionItem, SUI_CurrencyChainItem } from "@/types/global.types";
import EmptyDataset from "@/components/custom/shared/EmptyDataset";
import { getWalletProxy } from "@/lib/walletProxy";
import { updatedUserProfilePointsApi } from "@/service/api/user.service";
import { defaults } from "@/constants/defaults";
import { SUI_UpdateProfilePointsPayload } from "@/types/profile.types";
import { handleShowNotificationToast } from "@/lib/helpers";
import CustomRoomHeader from "@/components/custom/swap-market/CustomRoomHeader";
import RoomHeaderSide from "@/components/custom/swap-market/RoomHeaderSide";
import ExitPageDialog from "@/components/custom/shared/ExitPageDialog";
import CustomAvatar from "@/components/custom/shared/CustomAvatar";
import CustomCardLayout from "@/components/custom/shared/CustomCardLayout";
import ToastLookCard from "@/components/custom/shared/ToastLookCard";
import WalletAddressTile from "@/components/custom/tiles/WalletAddressTile";

interface ISwapCreation {
  isLoading: boolean;
  created: boolean;
}

const OpenSwapCreationRoom = () => {
  const [enableApproveButtonCriteria, setEnableApproveButtonCriteria] = useState(false);
  const [isValidParametersForm, setIsValidParametersForm] = useState(false);
  const [swapCreation, setSwapCreation] = useState<ISwapCreation>({ isLoading: false, created: false });

  const state = useSwapMarketStore(state => state.openMarket.openRoom);
  const [wallet, profile] = useProfileStore(state => [state.profile.wallet, state.profile]);

  const [filteredAvailableCurrencies, setAvailableCurrencies, availableCollections, setAvailableCollections, setStartRecentSwapSharingProcess, setRecentAcceptedSwap] = useGlobalStore(state => [
    state.filteredAvailableCurrencies,
    state.setAvailableCurrencies,
    state.availableCollections,
    state.setAvailableCollections,
    state.setStartRecentSwapSharingProcess,
    state.setRecentAcceptedSwap
  ]);

  const { expiration_date, preferred_asset } = state.swap.swap_preferences;
  const navigate = useNavigate();
  const { openTradeId } = useParams();

  const { mutateAsync: createOpenSwapOffer } = useCreateOpenSwapOffer();

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
        queryKey: [`getAvailableCollectionsApi`],
        queryFn: async () => {
          try {
            const response = await getAvailableCollectionsApi();
            // console.log("Collections dataset: ", response.data.collections);
            setAvailableCollections(response.data.collections as SUI_CollectionItem[]);
            return response.data.collections;
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
      }
    ]
  });

  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const isSuccess = queries.every(query => query.isSuccess);

  const handleResetData = () => {
    state.resetOpenSwapCreationRoom();

    handleShowNotificationToast(
      "info",
      `Open market room reset!`,
      `Room data cleared.`
    );
  };

  const handleCreateOpenMarketSwap = async () => {
    try {
      setSwapCreation(prev => ({ ...prev, isLoading: true }));
      const createdSwap = useSwapMarketStore.getState().openMarket.openRoom.swap;
      if (!createdSwap) {
        throw new Error("Failed to create swap.");
      }

      console.log("Created Swap: ", createdSwap);

      const userSignMessage = defaults.userSignMessages.open.createOriginal;
      const sign = await getWalletProxy().getUserSignature(createdSwap, userSignMessage);

      if (!sign) {
        throw new Error("Failed to obtain swap signature.");
      }

      const approval = await getWalletProxy().getUserApproval(createdSwap, true);
      if (!approval) {
        throw new Error("User approval not granted.");
      }

      const { initAssets, acceptAssets } = await getWalletProxy().getFormattedAssetsBySwap(createdSwap);

      const transactionRes = await createSwapThroughSmartContractApi({
        signerAddress: wallet.address,
        initiatorAddress: createdSwap.init_address,
        responderAddress: createdSwap.accept_address,
        initiatorAssets: initAssets,
        responderAssets: acceptAssets,
        signature: sign,
        userSignMessage,
        swapMode: createdSwap.swap_mode,
        tradeId: createdSwap.open_trade_id
      });

      console.log("transactionRes: ", transactionRes);

      const swapPayload: SUP_CreateOpenSwap = {
        init_address: createdSwap.init_address,
        offer_type: SUE_SWAP_OFFER_TYPE.PRIMARY || createdSwap.offer_type,
        open_trade_id: createdSwap.open_trade_id,
        swap_mode: createdSwap.swap_mode || SUE_SWAP_MODE.OPEN,
        trading_chain: createdSwap.trading_chain,
        swap_preferences: createdSwap.swap_preferences,
        init_sign: sign,
        metadata: {
          init: createdSwap.metadata.init
        }
      };

      const pointsApiPayload: SUI_UpdateProfilePointsPayload = {
        walletId: wallet.address,
        pointsToAdd: defaults.pointSystem['created-open-trade'],
        keyType: 'created-open-trade',
        defaultPointSystem: defaults.userSettings.newUser.points
      };

      const offerResult = await createOpenSwapOffer(swapPayload);
      const pointsUpdateResult = await updatedUserProfilePointsApi(pointsApiPayload);

      if (offerResult && pointsUpdateResult) {
        handleShowNotificationToast(
          "success",
          `Offer created successfully!`,
          `Your open offer is successfully created.`
        );

        setSwapCreation(prev => ({ ...prev, created: true }));
        setRecentAcceptedSwap(createdSwap);
        setStartRecentSwapSharingProcess(true);

        state.resetOpenSwapCreationRoom();
        setTimeout(() => {
          navigate('/swap-up/swap-market');
        }, 3000);
      }

    } catch (error: any) {
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.response ? error.response.data.message : error.message}`
      );
    } finally {
      setSwapCreation(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (openTradeId && !isValidTradeId(openTradeId)) {
    handleShowNotificationToast(
      "warning",
      `Trade id is required!`,
      `A valid trade id is required fo this page!`
    );
    setTimeout(() => {
      navigate(-1);
    }, 300);
  }

  useEffect(() => {
    if (
      ((state.sender.nftsSelectedForSwap.length) && isValidParametersForm) ||
      ((state.sender.addedAmount?.amount) && isValidParametersForm)
    ) {
      setEnableApproveButtonCriteria(true);
    } else {
      setEnableApproveButtonCriteria(false);
    }
  }, [state.sender.nftsSelectedForSwap, isValidParametersForm, state.sender.addedAmount]);

  useEffect(() => {
    if (openTradeId && isValidTradeId(openTradeId) && profile) {
      state.resetOpenSwapCreationRoom();
      state.setValuesOnCreateOpenSwapRoom(openTradeId, profile);
    }
  }, [openTradeId, profile]);


  return (
    <section className="room-layout-container" >
      <CustomRoomHeader
        title="Open Market Room for"
        tardeId={state.uniqueTradeId}
      >
        <RoomHeaderSide
          layoutType="sender"
          roomKey="openRoom"
          senderWallet={wallet.address}
        />
      </CustomRoomHeader>

      {/* Room content section */}
      <section className="room-content-section" >
        {
          (wallet.address && isSuccess) ?
            <RoomLayoutCard layoutType={"sender"} roomKey="openRoom" senderWallet={wallet.address} />
            :
            <div className="rounded-sm border-none w-full h-full flex items-center justify-center dark:bg-su_secondary_bg p-2 lg:p-6" >
              <LoadingDataset
                isLoading={!wallet.address || isLoading}
                title="Loading wallet connected wallet information"
              />
            </div>
        }

        {
          (isSuccess && filteredAvailableCurrencies) ?
            <SwapParametersCard
              setIsValidParametersForm={setIsValidParametersForm}
              availableCurrencies={filteredAvailableCurrencies}
              availableCollections={availableCollections}
            />
            :
            <div className="rounded-sm border-none w-full h-full flex items-center justify-center dark:bg-su_secondary_bg p-2 lg:p-6" >
              <LoadingDataset
                isLoading={isLoading}
                title="Loading available currencies data."
              />

              {isError &&
                <EmptyDataset
                  showBackgroundPicture={false}
                  className="lg:h-[200px]"
                  title="No Results Found"
                  description="We couldn't find any results. Please check you network and try again."
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

      {/* Room footer section */}
      <footer className="room-footer" >
        <ExitPageDialog
          title={"Are you sure you want to exit the trade?"}
          description={"By closing the open market swap, your changes would not be saved."}
          redirectPath={null}
          resetData={handleResetData}
          buttonClassName="button-varient-outline"
        >
          Go Back
        </ExitPageDialog>

        {/* Swap Details Dialog */}
        <Dialog>
          <div
            className="relative"
            onClick={async () => await state.createOpenSwap(wallet.address)}
          >
            <Button
              variant={"default"}
              type="submit"
              disabled={!enableApproveButtonCriteria}
            >
              Confirm Trade
            </Button>
            <DialogTrigger
              className="absolute w-full h-full top-0 left-0 bg-transparent"
              disabled={!enableApproveButtonCriteria}>
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

                <div className="flex items-center gap-2" >
                  <aside className='w-full mb-5 border border-su_enable_bg bg-su_tag_periwinkle rounded-sm flex items-center justify-between p-3'>
                    <aside className='w-full flex items-center justify-center gap-2' >
                      <CustomAvatar
                        imageSrc={profile.avatar}
                        fallbackName={profile.details?.title || profile.ensAddress || ''}
                        textSizeClasses="text-2xs lg:text-xs"
                      />

                      <h3 className="font-semibold text-xs lg:text-sm line-clamp-1">{profile.ensAddress}</h3>
                    </aside>

                    <aside className="flex items-center gap-2" >
                      <WalletAddressTile walletAddress={profile.wallet.address} className="text-2xs lg:text-xs" />
                      <ChainTile imageSrc={profile.wallet.network.iconUrl} title={profile.wallet.network.name} showChainTitleOnMobileScreen className="min-w-max text-2xs lg:text-xs text-su_secondary px-2" />
                    </aside>
                  </aside>

                  <svg className="mb-4" width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.88281" y="1.58984" width="38" height="38" rx="19" stroke="url(#paint0_linear_5961_173928)" strokeWidth="2" />
                    <path d="M23.4755 12.5898L29.8828 19.2436H12.2406V17.4487H25.7104L22.2535 13.8589L23.4755 12.5898ZM29.525 21.936V23.731H16.0553L19.5122 27.3208L18.2901 28.5898L11.8828 21.936H29.525Z" fill="#7586FF" />
                    <defs>
                      <linearGradient id="paint0_linear_5961_173928" x1="40.8828" y1="8.18985" x2="-1.45008" y2="19.3043" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#51C0FF" />
                        <stop offset="1" stopColor="#9452FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>


                <section className="grid grid-cols-1 lg:grid-cols-2 gap-2" >
                  {/* side cards*/}
                  <SwapDialogSideCard data={state.sender} layoutType='sender' />

                  {/* Swap preference parameters */}
                  <CustomCardLayout
                    title="Your Swap Preference Parameters :"
                  >

                    {/* Preferred asset */}
                    <div className="w-full flex items-center justify-between" >
                      <h3 className="text-sm text-su_ternary font-normal">Preferred asset:</h3>

                      <p
                        className={cn("text-sm text-su_primary py-2.5 px-3 rounded-sm bg-su_active_bg",
                          preferred_asset.type === "nft" ? "uppercase" : "capitalize"
                        )}
                      >
                        {preferred_asset.type === "currency" ? "crypto" + preferred_asset.type : preferred_asset.type}
                      </p>
                    </div>

                    {/* Expiration date */}
                    <div className="w-full flex items-center justify-between" >
                      <h3 className="text-sm text-su_ternary font-normal">Expiration date:</h3>

                      <p className="text-su_primary font-semibold text-sm" >{moment.utc(expiration_date).local().format('DD MMMM YYYY')}</p>
                    </div>

                    {/* Swap params currency section */}
                    {(
                      preferred_asset.type === 'currency' &&
                      (preferred_asset.parameters.preferred_currency && preferred_asset.parameters.preferred_currency.length > 0)
                    ) &&
                      <div className="space-y-2" >
                        <h3 className="text-sm text-su_ternary font-normal">Cryptocurrency:</h3>

                        <div className="flex flex-col gap-1" >
                          {preferred_asset.parameters.preferred_currency.map((currency, index) => (
                            <div
                              key={currency + "-" + index}
                              className="bg-su_least_bg py-1 px-2 rounded-xs text-sm"
                            >
                              <p className="flex items-center justify-between text-su_primary font-semibold" >
                                <span className="" >{currency.amount}</span>

                                <span className="flex items-center gap-1" >
                                  {
                                    currency.iconUrl &&
                                    <img
                                      className="w-4"
                                      src={currency.iconUrl}
                                      alt=""
                                    />
                                  }

                                  {
                                    currency.symbol
                                  }
                                </span>
                              </p>

                              <p className="text-su_ternary">
                                $ {currency.usdAmount}
                              </p>
                            </div>
                          ))

                          }
                        </div>
                      </div>
                    }

                    {/* Nft Preferred collection */}
                    {(preferred_asset.type === 'nft' && preferred_asset.parameters.collection) &&
                      <div className="w-full flex items-center justify-between" >
                        <h3 className="text-sm text-su_ternary font-normal">Preferred collection</h3>

                        <p className="text-su_primary font-semibold text-sm line-clamp-1" >{preferred_asset.parameters.collection}</p>
                      </div>
                    }

                    {/* nft Preferred rarity rank */}
                    {(preferred_asset.type === 'nft' && preferred_asset.parameters.rank) &&
                      <div className="w-full flex items-center justify-between" >
                        <h3 className="text-sm text-su_ternary font-normal">Preferred rarity rank:</h3>

                        <SwapParameterTile
                          title="Rarity rank:"
                          value={
                            <span className="flex items-center gap-2" >
                              <svg className="w-3 pb-0.5" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.7175 2.85714L6 0L4.2825 2.85714H7.7175ZM1.7175 7.14286L0 10H12L10.2825 7.14286H1.7175ZM9.855 6.42857L8.145 3.57143H3.855L2.145 6.42857H9.855Z" fill="white" />
                              </svg>

                              <>{preferred_asset.parameters.rank.from} - {preferred_asset.parameters.rank.to}</>
                            </span>
                          }
                        />
                      </div>
                    }
                  </CustomCardLayout>
                </section>

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
                disabled={swapCreation.created}
                isLoading={swapCreation.isLoading}
                onClick={async () => await handleCreateOpenMarketSwap()}
                className="py-2"
              >
                Confirm
              </Button>
            </footer>
          </DialogContent>
        </Dialog>
      </footer >
    </section >
  );
};

export default OpenSwapCreationRoom;