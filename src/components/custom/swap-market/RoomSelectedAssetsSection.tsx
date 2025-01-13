import { SUI_NFTItem } from "@/types/global.types";
import { cn, getDefaultNftImageOnError } from "@/lib/utils";
import { IAddedAmount, SUT_PrivateRoomLayoutType } from "@/types/swap-market-store.types";
import { SUT_SwapRoomViewType } from "@/types/swap-market.types";
import AppliedFilterSubItemTile from "../tiles/AppliedFilterSubItemTile";


interface IProp {
  swapRoomViewType: SUT_SwapRoomViewType;
  layoutType: SUT_PrivateRoomLayoutType;
  nfts: SUI_NFTItem[] | undefined;
  nftsSelectedForSwap: [] | SUI_NFTItem[];
  setSelectedNftsForSwap: (selectedNfts: SUI_NFTItem[] | []) => void;
  disableDeselection?: boolean;
  addedAmount: IAddedAmount | undefined;
  setAddedAmount: (selectedAmount: string, selectedCoin: string) => void;
}


const RoomSelectedAssetsSection = ({ nfts, nftsSelectedForSwap, setSelectedNftsForSwap, layoutType, swapRoomViewType, disableDeselection = false, addedAmount, setAddedAmount }: IProp) => {

  const removeSelectedNftById = (paramId: string) => {
    const filteredNfts = nftsSelectedForSwap.filter(nft => nft.tokenId !== paramId);
    setSelectedNftsForSwap([...filteredNfts]);
  };

  // const removeAllSelectedNft = () => {
  //   setSelectedNftsForSwap([]);
  // };

  const nftsImageMapper = (nftsForMap: SUI_NFTItem[], lengthToShowParam: number) => {
    const lengthToShow = lengthToShowParam - 1;
    return (
      nftsForMap.map((nft, index) => {
        if (index < lengthToShow || (index === lengthToShow && nftsForMap.length > lengthToShow))
          return (
            <div
              className="group relative w-8 h-8 rounded-xs lg:w-12 lg:h-12 object-cover lg:rounded-sm border-[1.5px] border-white/20 hover:scale-105 transition duration-150 ease-in-out"
              key={nft.tokenId + index}>

              <img
                className="w-full h-full object-cover rounded-xs lg:rounded-sm"
                src={nft.media[0].gateway}
                alt="nft"
                onError={getDefaultNftImageOnError}
              />

              {
                (index === lengthToShow) && nftsForMap.length > lengthToShowParam ?
                  <div className="absolute w-full h-full rounded-xs lg:rounded-sm bg-black/50 top-0 left-0 flex justify-center items-center font-semibold text-xs lg:text-sm" >
                    +{nftsForMap.length - lengthToShowParam}
                  </div> : ''
              }


              {
                !disableDeselection &&
                <div
                  className={cn(
                    "absolute cursor-pointer flex w-full h-full rounded-xs lg:rounded-sm top-0 left-0 justify-end items-start font-semibold",
                  )}
                  onClick={() => removeSelectedNftById(nft.tokenId)}
                >
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-gradient-primary cursor-pointer"
                  >
                    <svg className="w-2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.66271 0.323394L7.96332 0.323364V1.42356L4.6627 1.42359L3.56257 1.4236L0.261963 1.42363L0.261963 0.323431L4.66271 0.323394Z" fill="white" />
                    </svg>

                  </span>
                </div>
              }
            </div>
          );
      })
    );
  };

  const handleResetAddedAmount = () => {
    if (addedAmount && addedAmount.coin) {
      setAddedAmount('', JSON.stringify(addedAmount.coin));
    }
  };


  return (
    <aside className={cn(
      "space-y-4",
      ((nftsSelectedForSwap.length > 0 && (nfts || []).length > 0) || (addedAmount?.amount)) ? "" : 'hidden',
      (swapRoomViewType === 'propose' && layoutType === "receiver") && "block"
    )}
    >
      <h2 className="">Selected Assets</h2>

      <div className="space-y-2" >
        {
          (swapRoomViewType === 'view' || (swapRoomViewType === 'propose' && layoutType === "receiver"))
            ?
            (nfts || []).length === 0 && <p className="text-xs text-su_secondary">No NFTs selected. You can choose up to 20 assets.</p>
            :
            nftsSelectedForSwap.length === 0 ? <p className="text-xs text-su_secondary">No NFTs selected. You can choose up to 20 assets.</p> : <></>
        }

        {
          (swapRoomViewType === 'view' || (swapRoomViewType === 'propose' && layoutType === "receiver")) ?
            <div>
              {
                (nfts && nfts.length > 0) &&
                <>

                  {/* For Desktop */}
                  <div className="hidden 2xl:hidden 3xl:hidden lg:flex items-center gap-2" >
                    {nftsImageMapper(nfts, 10)}
                  </div>

                  <div className="hidden 3xl:hidden 2xl:flex items-center gap-2.5" >
                    {nftsImageMapper(nfts, 12)}
                  </div>

                  <div className="hidden 3xl:flex items-center gap-2.5" >
                    {nftsImageMapper(nfts, 13)}
                  </div>

                  {/* For Mobile */}
                  <div className="lg:hidden flex items-center gap-1.5 lg:gap-2" >
                    {nftsImageMapper(nfts, 9)}
                  </div>
                </>
              }


            </div>
            :
            <div>
              {
                (nftsSelectedForSwap && nftsSelectedForSwap.length > 0) &&
                <>
                  {/* For Desktop */}
                  <div className="hidden 2xl:hidden 3xl:hidden lg:flex items-center gap-2" >
                    {nftsImageMapper(nftsSelectedForSwap, 10)}
                  </div>

                  <div className="hidden 3xl:hidden 2xl:flex items-center gap-2.5" >
                    {nftsImageMapper(nftsSelectedForSwap, 12)}
                  </div>

                  <div className="hidden 3xl:flex items-center gap-2.5" >
                    {nftsImageMapper(nftsSelectedForSwap, 13)}
                  </div>

                  {/* For Mobile */}
                  <div className="lg:hidden flex items-center gap-1.5 lg:gap-2" >
                    {nftsImageMapper(nftsSelectedForSwap, 9)}
                  </div>
                </>
              }
            </div>
        }


        {
          (addedAmount && addedAmount.amount && Number(addedAmount.amount) > 0) &&
          <AppliedFilterSubItemTile
            className="max-w-max"
            handleAction={() => handleResetAddedAmount()}
            hideActionButton={disableDeselection}
          >
            <span className="flex items-center gap-2 text-xs" >
              <img
                className="w-3.5 h-3.5"
                src={addedAmount.coin.iconUrl}
                alt=""
                loading="lazy"
                onError={(e: any) => {
                  e.currentTarget.className = "w-3.5 h-3.5 rounded-full object-cover";
                  getDefaultNftImageOnError(e);
                }}
              />
              <span>
                {addedAmount.amount} {addedAmount.coin.symbol}
              </span>
            </span>

          </AppliedFilterSubItemTile>
        }
      </div>

    </aside>
  );
};

export default RoomSelectedAssetsSection;