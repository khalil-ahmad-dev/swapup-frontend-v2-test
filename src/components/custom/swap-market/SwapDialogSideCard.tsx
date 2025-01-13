import { cn, getDefaultNftImageOnError } from "@/lib/utils";
import WalletAddressTile from "../tiles/WalletAddressTile";
import ChainTile from "../tiles/ChainTile";
import { IPrivateRoomsLayoutSide } from "@/types/swap-market-store.types";
import { SUI_NFTItem } from "@/types/global.types";
import CustomCardLayout from "../shared/CustomCardLayout";

interface IProp {
  className?: string;
  data: IPrivateRoomsLayoutSide;
  showEscroTile?: boolean;
  useNfts?: boolean;
  layoutType?: "sender" | "receiver";
}

const SwapDialogSideCard = ({ className, data, showEscroTile = false, useNfts = false, layoutType = "sender", ...props }: IProp) => {

  const nftsImageMapper = (nfts: SUI_NFTItem[],) => (
    nfts.map((nft) => (
      <div
        className="group relative w-8 h-8 rounded-xs lg:w-12 lg:h-12 object-cover lg:rounded-sm border-[1.5px] border-white/20"
        key={nft.tokenId}>
        <img
          className="w-full h-full object-cover rounded-xs lg:rounded-sm"
          src={nft.media[0].gateway}
          onError={getDefaultNftImageOnError}
          alt="nft"
        />
      </div>
    ))
  );

  const getConvertedAmount = (usdAmount: number | string, chainAmount: number | string) => {
    return (Number(usdAmount) * Number(chainAmount));
  };

  return (
    <CustomCardLayout
      title={`You ${layoutType === "sender" ? "send" : "receive"}`}
      className={cn(
        "",
        className
      )}
    >

      {/* Wallet info */}
      <WalletAddressTile walletAddress={data.profile.wallet.address} className="text-2xs lg:text-xs" containerClassName="px-2 text-su_secondary">
        <div className="flex items-center gap-2" >
          <ChainTile imageSrc={data.profile.wallet.network.iconUrl} title={data.profile.wallet.network.name} showChainTitleOnMobileScreen className="text-2xs lg:text-xs text-su_secondary px-2" />
          {
            showEscroTile &&
            <span className=" flex items-center gap-2 p-2 bg-su_enable_bg text-su_primary font-semibold text-2xs lg:text-xs rounded-xs" >
              <span className="rounded-full w-2 h-2 bg-su_positive" ></span>

              Escrow
            </span>
          }
        </div>
      </WalletAddressTile>

      {/*Crypto assets  */}
      {data.addedAmount?.amount &&
        <div className="space-y-2" >
          <h3 className="text-sm text-su_ternary font-normal" >Cryptocurrency:</h3>

          <div className="flex flex-col gap-2" >

            {/* Crypto card item */}
            <div className="bg-su_least_bg py-1 px-2 rounded-xs text-sm" >
              <p className="flex items-center justify-between text-su_primary font-semibold" >
                <span className="" >{data.addedAmount?.amount}</span>

                <span className="flex items-center gap-1" >
                  {
                    data.addedAmount?.coin.iconUrl &&
                    <img
                      className="w-4"
                      src={data.addedAmount.coin.iconUrl}
                      alt=""
                    />
                  }

                  {
                    data.addedAmount?.coin.symbol
                  }
                </span>
              </p>

              <p className="text-su_ternary">
                $ {data.addedAmount?.amount
                  ? parseFloat(getConvertedAmount(data.addedAmount.coin.price, data.addedAmount.amount).toFixed(6))
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      }

      {/*NFT assets  */}
      {(data.nftsSelectedForSwap.length > 0 || (useNfts && (data.nfts || []).length > 0)) &&
        <div className="text-xs lg:text-sm text-su_secondary space-y-2" >
          <h3 className="text-sm text-su_ternary font-normal" >NFT:</h3>

          <div className="flex items-center gap-1.5 flex-wrap" >
            {nftsImageMapper((useNfts && data.nfts) ? data.nfts : data.nftsSelectedForSwap)}
          </div>
        </div>
      }

    </CustomCardLayout>
  );
};

export default SwapDialogSideCard;