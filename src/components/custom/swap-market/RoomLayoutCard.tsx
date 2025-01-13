import { ChangeEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FilterButton from "../shared/FilterButton";
import GridToggleButton from "../shared/GridToggleButton";
import { Input } from "@/components/ui/input";
import NftCard from "../shared/NftCard";
import EmptyDataset from "../shared/EmptyDataset";
import PrivateRoomFilterDrawer from "./private-party/PrivateRoomFilterDrawer";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { SUT_PrivateRoomLayoutType, SUT_RoomKeyType } from "@/types/swap-market-store.types";
import { useSwapMarketStore } from "@/store/swap-market";
import LoadingDataset from "../shared/LoadingDataset";
import { useNFTsByWallet } from "@/service/queries/swap-market.query";
import { SUI_NFTItem } from "@/types/global.types";
import { SUI_SwapToken, SUT_SwapRoomViewType } from "@/types/swap-market.types";
import { defaults } from "@/constants/defaults";
import { useGlobalStore } from "@/store/global-store";
import { handleShowNotificationToast } from "@/lib/helpers";
import RoomSelectCryptoSectionSide from "./RoomSelectCryptoSectionSide";
import { ChevronDown } from "lucide-react";
import RoomSelectedAssetsSection from "./RoomSelectedAssetsSection";

interface IProp {
  layoutType: SUT_PrivateRoomLayoutType;
  counterPartyWallet?: string;
  senderWallet?: string;
  roomKey: SUT_RoomKeyType;
  swapRoomViewType?: SUT_SwapRoomViewType;
  setDataSavedInStore?: React.Dispatch<React.SetStateAction<{
    sender: boolean;
    receiver: boolean;
  }>>;
}

const RoomLayoutCard = ({ layoutType, counterPartyWallet, senderWallet, roomKey, setDataSavedInStore, swapRoomViewType = 'default' }: IProp) => {

  const {
    activeGridView,
    toggleGridView,
    filteredNfts,
    setSelectedNftsForSwap,
    nftsSelectedForSwap,
    setFilteredNftsBySearch,
    setFilteredNftsByFilters,
    filters,
    removeAllFilters,
    collections,
    setNftsDataset,
    setFilteredNftsBySwapTokens,
    setAddedAmount,
    addedAmount,
    nfts
  } = useSwapMarketStore((state) =>
    roomKey === 'privateRoom' ?
      (layoutType === "sender" ? state.privateMarket.privateRoom.sender : state.privateMarket.privateRoom.receiver)
      : (layoutType === "sender" ? state.openMarket.openRoom.sender : state.openMarket.openRoom.receiver)
  );

  const [disableDeselectionCriteria, setDisableDeselectionCriteria] = useState(false);

  const [filteredAvailableCurrencies] = useGlobalStore(state => [state.filteredAvailableCurrencies]);
  const swap = useSwapMarketStore(state => roomKey === 'privateRoom' ? state.privateMarket.privateRoom.swap : state.openMarket.openRoom.swap);

  const handleSearchNfts = (searchValue: string) => { setFilteredNftsBySearch(searchValue); };


  const walletAddress = ((layoutType === "receiver") && (counterPartyWallet)) ? counterPartyWallet : senderWallet!;
  const { isLoading, data, isSuccess, isError, error } = useNFTsByWallet(walletAddress);

  const getCurrencyChainByAddress = (tokenAddress: string) => {
    const foundCurrency = filteredAvailableCurrencies.find(currency => currency.contractAddresses.find(address => address.includes(tokenAddress)));
    return foundCurrency;
  };

  useEffect(() => {

    if (data && isSuccess) {
      const resNfts = (data.data as SUI_NFTItem[]).map(item => ({
        ...item,
        rarityRank: Number(item.tokenId),
        media: item.media.length > 0 ? item.media : [
          {
            gateway: defaults.fallback.nftImageUrl,
            raw: defaults.fallback.nftImageUrl
          }
        ]
      }));


      if (setDataSavedInStore && swap) {

        const allInitSwapTokens: SUI_SwapToken[] = swap.metadata.init.tokens;
        //Check for accept:  As accept side tokens are optional in new created open swap
        const allAcceptSwapTokens: SUI_SwapToken[] = swap.metadata.accept ? swap.metadata.accept.tokens : [];

        let initErc20Token: SUI_SwapToken | null = null;
        let acceptErc20Token: SUI_SwapToken | null = null;
        let initFilteredNftSwapTokens: SUI_SwapToken[] = [];
        let acceptFilteredNftSwapTokens: SUI_SwapToken[] = [];

        // Filtering init swap tokens
        if (allInitSwapTokens.length > 0) {
          for (const swapToken of allInitSwapTokens) {

            if (swapToken.type === 'ERC20') {
              initErc20Token = swapToken;
            } else {
              initFilteredNftSwapTokens.push(swapToken);
            }

          }
        }

        // Filtering accept swap tokens
        if (allAcceptSwapTokens.length > 0) {
          for (const swapToken of allAcceptSwapTokens) {

            if (swapToken.type === 'ERC20') {
              acceptErc20Token = swapToken;
            } else {
              acceptFilteredNftSwapTokens.push(swapToken);
            }

          }
        }

        // Setting data in store for sender side
        if (allInitSwapTokens.length > 0) {

          // Propose Room: type open swap --> receiver
          if (roomKey === 'openRoom' && layoutType === "receiver" && swapRoomViewType === 'propose') {

            if (initErc20Token) {
              const foundCurrency = getCurrencyChainByAddress(initErc20Token.address);
              setAddedAmount(String(initErc20Token.value?.amount!), JSON.stringify(foundCurrency));
            }

            if (initFilteredNftSwapTokens.length > 0) {
              const filteredNfts: SUI_NFTItem[] = resNfts.filter(nft =>
                initFilteredNftSwapTokens.some(token => (token.id === nft.tokenId && token.address === nft.contract.address))
              );
              setFilteredNftsBySwapTokens(filteredNfts);
            }

            setTimeout(() => {
              setDataSavedInStore(prev => ({ ...prev, receiver: true }));
            }, 200);
          }

          // View Room: --> sender
          if (layoutType === "sender" && swapRoomViewType === 'view') {

            if (initErc20Token) {
              const foundCurrency = getCurrencyChainByAddress(initErc20Token.address);
              setAddedAmount(String(initErc20Token.value?.amount!), JSON.stringify(foundCurrency));
            }

            if (initFilteredNftSwapTokens.length > 0) {
              const filteredNfts: SUI_NFTItem[] = resNfts.filter(nft =>
                initFilteredNftSwapTokens.some(token => (token.id === nft.tokenId && token.address === nft.contract.address))
              );
              setFilteredNftsBySwapTokens(filteredNfts);
            }

            setTimeout(() => {
              setDataSavedInStore(prev => ({ ...prev, sender: true }));
            }, 200);
          }

          // Counter Room: --> sender
          if (layoutType === "sender" && swapRoomViewType === 'counter') {

            if (initErc20Token) {
              const foundCurrency = getCurrencyChainByAddress(initErc20Token.address);
              setAddedAmount(String(initErc20Token.value?.amount!), JSON.stringify(foundCurrency));
            }

            if (initFilteredNftSwapTokens.length > 0) {
              const filteredNfts: SUI_NFTItem[] = resNfts.filter(nft =>
                initFilteredNftSwapTokens.some(token => (token.id === nft.tokenId && token.address === nft.contract.address))
              );
              setSelectedNftsForSwap([...filteredNfts]);
            }

            setNftsDataset(resNfts);
            setTimeout(() => {
              setDataSavedInStore(prev => ({ ...prev, sender: true }));
            }, 200);
          }

        }

        // Setting data for in store for receiver side
        if (allAcceptSwapTokens.length > 0) {

          // View Room: --> receiver
          if (layoutType === "receiver" && swapRoomViewType === 'view') {

            if (acceptErc20Token) {
              const foundCurrency = getCurrencyChainByAddress(acceptErc20Token.address);
              setAddedAmount(String(acceptErc20Token.value?.amount!), JSON.stringify(foundCurrency));
            }

            if (acceptFilteredNftSwapTokens.length > 0) {
              const filteredNfts: SUI_NFTItem[] = resNfts.filter(nft =>
                acceptFilteredNftSwapTokens.some(token => (token.id === nft.tokenId && token.address === nft.contract.address))
              );
              setFilteredNftsBySwapTokens(filteredNfts);
            }

            setTimeout(() => {
              setDataSavedInStore(prev => ({ ...prev, receiver: true }));
            }, 200);
          }

          // Counter Room: --> receiver
          if (layoutType === "receiver" && swapRoomViewType === 'counter') {

            if (acceptErc20Token) {
              const foundCurrency = getCurrencyChainByAddress(acceptErc20Token.address);
              setAddedAmount(String(acceptErc20Token.value?.amount!), JSON.stringify(foundCurrency));
            }

            if (acceptFilteredNftSwapTokens) {
              const filteredNfts: SUI_NFTItem[] = resNfts.filter(nft =>
                acceptFilteredNftSwapTokens.some(token => (token.id === nft.tokenId && token.address === nft.contract.address))
              );
              setSelectedNftsForSwap([...filteredNfts]);
            }

            setNftsDataset(resNfts);
            setTimeout(() => {
              setDataSavedInStore(prev => ({ ...prev, receiver: true }));
            }, 200);
          }
        }

      }

      if (swapRoomViewType === "default") {
        setNftsDataset(resNfts);
      }

    }

    if (isError) {
      setNftsDataset([]);
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.message}`
      );
    }

  }, [data, isSuccess, isError, roomKey, layoutType, setDataSavedInStore]);

  // To set disable criteria
  useEffect(() => {
    if ((swapRoomViewType === 'propose' && layoutType === 'receiver') || swapRoomViewType === 'view') {
      setDisableDeselectionCriteria(true);
    } else {
      setDisableDeselectionCriteria(false);
    }

  }, [swapRoomViewType, layoutType, swapRoomViewType]);

  return (
    <Card className="border border-su_enable_bg bg-transparent flex flex-col gap-4 p-2 lg:p-6 rounded-3xl" >
      <CardHeader className="flex flex-col p-0 gap-4 font-semibold text-su_secondary" >
        {/* Layout heading section */}
        <h2 className="border-b-[1px] border-b-su_enable_bg pb-2" >
          You {layoutType === 'sender' ? "send" : "receive"}
        </h2>

        {/* Selected assets section */}
        <RoomSelectedAssetsSection
          setSelectedNftsForSwap={setSelectedNftsForSwap}
          nftsSelectedForSwap={nftsSelectedForSwap}
          nfts={nfts}
          layoutType={layoutType}
          swapRoomViewType={swapRoomViewType}
          setAddedAmount={setAddedAmount}
          addedAmount={addedAmount}
          disableDeselection={disableDeselectionCriteria}
        />

        {/* Select crypto section */}
        {(filteredAvailableCurrencies && filteredAvailableCurrencies.length > 0) &&
          <RoomSelectCryptoSectionSide
            setAddedAmount={setAddedAmount}
            addedAmount={addedAmount}
            availableCurrencies={filteredAvailableCurrencies}
            className={disableDeselectionCriteria ? "hidden" : "block"}
            walletForTotalBalance={walletAddress}
          />
        }

        {/*NFT asset heading section*/}
        <div className="flex flex-col gap-4" >
          <div className="flex items-center justify-between" >
            <h2>Select NFT Assets</h2>

            {/*Hidden: This view collection option is not confirmed yet... */}
            {/* <button className="p-3 rounded-sm flex items-center gap-2 bg-su_enable_bg" >
              <svg className="w-3.5" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 6.5V4.83333H12.4998V6.5H0.5ZM0.500163 2.16667V0.5H12.5V2.16667H0.500163Z" fill="#868691" />
              </svg>

              <span className="text-su_ternary font-normal text-sm" >View Collections</span>

              <ChevronDown className={`h-4 w-4 text-su_primary`} />
            </button> */}
          </div>

          <div className={`flex gap-4 items-center`} >
            <Input
              className="w-3/4 !p-3.5 bg-su_enable_bg"
              placeholder="Search by asset name or ID"
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleSearchNfts(event.target.value)}
              icon={
                <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 14.6154L11.2277 9.84231C11.9968 8.78544 12.4105 7.5117 12.4092 6.20462C12.4092 2.78346 9.62577 0 6.20462 0C2.78346 0 0 2.78346 0 6.20462C0 9.62577 2.78346 12.4092 6.20462 12.4092C7.5117 12.4105 8.78544 11.9968 9.84231 11.2277L14.6154 16L16 14.6154ZM6.20462 10.4496C5.36493 10.4497 4.54407 10.2008 3.84586 9.7343C3.14765 9.26784 2.60345 8.60481 2.28208 7.82905C1.96071 7.05329 1.8766 6.19965 2.0404 5.37609C2.2042 4.55253 2.60854 3.79604 3.20229 3.20229C3.79604 2.60854 4.55253 2.2042 5.37609 2.0404C6.19965 1.8766 7.05329 1.96071 7.82905 2.28208C8.60481 2.60345 9.26784 3.14765 9.7343 3.84586C10.2008 4.54407 10.4497 5.36493 10.4496 6.20462C10.4483 7.33005 10.0006 8.40902 9.20482 9.20482C8.40902 10.0006 7.33005 10.4483 6.20462 10.4496Z" fill="#868691" />
                </svg>
              }
            />

            <div
              className={`flex items-center gap-2`}
            >
              <GridToggleButton activeGridView={activeGridView} toggleView={toggleGridView} />

              <PrivateRoomFilterDrawer setFilteredNftsByFilters={setFilteredNftsByFilters} removeAllFilters={removeAllFilters} collections={collections} >
                <FilterButton filterApplied={filters ? true : false} />
              </PrivateRoomFilterDrawer>

            </div>
          </div>
        </div>
      </CardHeader>

      {
        filters &&
        <ScrollArea className="w-[300px] md:w-auto overflow-x-scroll md:overflow-hidden py-2 mx-auto md:mx-0" >
          <div className="w-[500px] md:w-auto flex justify-between items-start " >
            <div className="flex items-center gap-2 lg:gap-6">
              <p className="text-xs text-text dark:text-su_secondary flex items-center gap-2" >
                Preferred rarity rank:
                <span className="flex gap-2 items-center bg-su_enable_bg rounded-xs px-3 py-2 capitalize text-primary font-semibold" >
                  <svg className="w-3" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.7175 2.85714L6 0L4.2825 2.85714H7.7175ZM1.7175 7.14286L0 10H12L10.2825 7.14286H1.7175ZM9.855 6.42857L8.145 3.57143H3.855L2.145 6.42857H9.855Z" fill="white" />
                  </svg>

                  <>{filters.rarityRank.from} - {filters.rarityRank.to}</>
                </span>
              </p>

              <p className="text-xs text-text dark:text-su_secondary flex items-center gap-2 " >
                Collection:
                <span className="flex gap-2 items-center bg-su_enable_bg rounded-xs px-3 py-2 capitalize text-primary font-semibold" >
                  {filters.collection}
                </span>
              </p>
            </div>
            <span
              className="text-sm font-semibold py-2 px-3 hover:bg-su_enable_bg cursor-pointer flex items-center gap-2 rounded-xs"
              onClick={() => removeAllFilters()}
            >
              Clear all

              <svg className="w-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.1194 1.94157L11.6497 1.41124L10.5891 0.350586L10.0587 0.880919L6.00069 4.939L1.94265 0.880919L1.41232 0.350586L0.351652 1.41124L0.88198 1.94157L4.94003 5.99967L0.88189 10.0578L0.351562 10.5882L1.41223 11.6488L1.94256 11.1185L6.00069 7.06033L10.0588 11.1185L10.5891 11.6488L11.6498 10.5882L11.1195 10.0578L7.06134 5.99967L11.1194 1.94157Z" fill="#B6B6BD" />
              </svg>
            </span>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      }

      <CardContent
        className={`grid gap-3 lg:gap-4 ${activeGridView === "detailed" ?
          "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 5xl:grid-cols-5 3xl:grid-cols-4" :
          "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 3xl:grid-cols-6 5xl:grid-cols-8"} p-0`}
      >
        {
          filteredNfts && filteredNfts.length > 0
            ? filteredNfts?.map(nft => (
              <NftCard key={nft.tokenId + nft.timeLastUpdated}
                className="col-span-1"
                activeGridView={activeGridView}
                data={nft}
                setSelectedNftsForSwap={setSelectedNftsForSwap}
                nftsSelectedForSwap={nftsSelectedForSwap}
                disableNftSelection={disableDeselectionCriteria}
              />
            ))
            :
            <div className="col-span-full" >
              {isLoading ?
                <LoadingDataset
                  isLoading={isLoading}
                  title="Asset Loading in Progress"
                  description={`Please wait while your ${layoutType === 'receiver' ? "counterparty's" : ""} assets are being loaded.`}
                />
                :
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
      </CardContent>
    </Card >
  );
};

export default RoomLayoutCard;