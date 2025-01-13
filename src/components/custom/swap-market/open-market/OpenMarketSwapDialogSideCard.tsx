import { cn } from "@/lib/utils";
import CustomAvatar from "../../shared/CustomAvatar";
import WalletAddressTile from "../../tiles/WalletAddressTile";
import ChainTile from "../../tiles/ChainTile";
import { IOpenMarketLayoutSide } from "@/types/swap-market-store.types";
import { SUI_NFTItem } from "@/types/global.types";

interface IProp {
  className?: string;
  data: IOpenMarketLayoutSide;
}

const OpenMarketSwapDialogSideCard = ({ className, data, ...props }: IProp) => {

  const nftsImageMapper = (nfts: SUI_NFTItem[],) => (
    nfts.map((nft) => (
      <div
        className="group relative w-8 h-8 rounded-xs lg:w-12 lg:h-12 object-cover lg:rounded-sm border-[1.5px] border-white/20"
        key={nft.tokenId}>
        <img className="w-full h-full object-cover rounded-xs lg:rounded-sm" src={nft.media[0].gateway} alt="nft" />
      </div>
    ))
  );

  const getConvertedAmount = (usdAmount: number | string, chainAmount: number | string) => {
    return (Number(usdAmount) * Number(chainAmount));
  };

  return (
    <div
      className={cn(
        "space-y-2 w-full lg:w-auto",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1 lg:gap-2">
        <CustomAvatar
          imageSrc={data.profile.avatar}
          fallbackName={data.profile.details?.title || data.profile.ensAddress || ''}
          sizeClasses="w-4 h-4 lg:w-6 lg:h-6"
          textSizeClasses="text-2xs lg:text-xs"
        />
        <h2 className="font-semibold text-xs lg:text-sm line-clamp-1 w-2/3 lg:w-auto">{data.profile.ensAddress}</h2>
      </div>

      <WalletAddressTile walletAddress={data.profile.wallet.address} className="text-2xs lg:text-xs">
        <ChainTile imageSrc={data.profile.wallet.network.iconUrl} title={data.profile.wallet.network.name} showChainTitleOnMobileScreen className="text-2xs lg:text-xs" />
      </WalletAddressTile>

      <div className="text-xs lg:text-sm text-su_secondary flex items-center justify-between" >
        <p>Added amount:</p>

        <div className="flex gap-2" >
          {
            data.addedAmount?.coin.iconUrl &&
            <img
              className="w-4"
              src={data.addedAmount.coin.iconUrl}
              alt=""
            />
          }

          <p className="text-su_primary" >
            {data.addedAmount?.amount || 0}
            {' '} {data.addedAmount?.coin.symbol} {' '}
            <span className="text-su_secondary" >
              / $ {data.addedAmount?.amount ? getConvertedAmount(data.addedAmount.coin.price, data.addedAmount.amount).toFixed(6) : 0}
            </span>
          </p>
        </div>
      </div>

      <div className="text-xs lg:text-sm text-su_secondary space-y-1" >
        <p>NFT assets:</p>

        <div className="grid grid-cols-5 gap-2 lg:gap-3" >
          {nftsImageMapper(data.nftsSelectedForSwap)}
        </div>
      </div>
    </div>
  );
};

export default OpenMarketSwapDialogSideCard;