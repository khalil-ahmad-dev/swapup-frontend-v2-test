import { cn, getDefaultNftImageOnError } from "@/lib/utils";

import { SUI_OpenSwap, SUI_SwapToken, SUT_SwapTokenContractType } from "@/types/swap-market.types";
import { chainsDataset } from "@/constants/data";
import CustomAvatar from "@/components/custom/shared/CustomAvatar";
import ChainTile from "@/components/custom/tiles/ChainTile";
import WalletAddressTile from "@/components/custom/tiles/WalletAddressTile";
import { useEffect, useState } from "react";

interface IProp {
  className?: string;
  swap: SUI_OpenSwap;
  side: "sender" | "receiver";
}

const SwapHistoryDialogSideCard = ({ className, swap, side, ...props }: IProp) => {

  const [isErc20Swap, setErc20Swap] = useState(false);

  const nftsImageMapper = (nfts: SUI_SwapToken[],) => (
    nfts.map((nft) => (
      <div
        className="group relative w-8 h-8 rounded-xs lg:w-12 lg:h-12 object-cover lg:rounded-sm border-[1.5px] border-white/20"
        key={nft.id}>
        <img
          className="w-full h-full object-cover rounded-xs lg:rounded-sm"
          src={nft.image_url}
          onError={getDefaultNftImageOnError}
          alt="nft"
        />
      </div>
    ))
  );

  const getConvertedAmount = (usdAmount: number | string, chainAmount: number | string) => {
    return (Number(usdAmount) * Number(chainAmount));
  };

  const currentChain = chainsDataset.find(chain => chain.uuid === swap.trading_chain) || chainsDataset[1];
  const swapTokens = side === "sender" ? swap.metadata.init.tokens : swap.metadata.accept.tokens;

  useEffect(() => {
    if (swap &&
      ((swapTokens[0].type as SUT_SwapTokenContractType) === 'ERC20')
    ) {
      setErc20Swap(true);
    }

  }, [swap]);

  return (
    <div
      className={cn(
        "custom-border-card space-y-2 w-full lg:w-auto",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1 lg:gap-2">
        <CustomAvatar
          imageSrc={""}
          fallbackName={side}
          sizeClasses="w-4 h-4 lg:w-6 lg:h-6"
          textSizeClasses="text-2xs lg:text-xs"
        />
        <h2 className="font-semibold text-xs lg:text-sm line-clamp-1 w-2/3 lg:w-auto">{side === "sender" ? "sender.swapup.eth" : "receiver.swapup.eth"}</h2>
      </div>

      <WalletAddressTile walletAddress={side === "sender" ? swap.init_address : swap.accept_address} className="text-2xs lg:text-xs">
        <div className="flex items-center gap-2" >
          <ChainTile imageSrc={currentChain.iconUrl} title={currentChain.name} showChainTitleOnMobileScreen className="text-2xs lg:text-xs" />

        </div>
      </WalletAddressTile>

      <div className="text-xs lg:text-sm text-su_secondary flex items-center justify-between" >
        <p>Added amount:</p>

        <div className="flex gap-2" >
          <img
            className="w-4"
            src={isErc20Swap ?
              swapTokens[0].image_url
              : currentChain.iconUrl
            }
            alt=""
          />

          <p className="text-su_primary" >
            {swapTokens[0].value?.amount}
            {' '}
            {swapTokens[0].value?.symbol}
            {' '}
            <span className="text-su_secondary" >
              / {' '}
              ${swapTokens[0].value?.usdAmount.toFixed(5)}
            </span>
          </p>
        </div>
      </div>

      <div className="text-xs lg:text-sm text-su_secondary space-y-1" >
        <p>NFT assets:</p>
        {
          !isErc20Swap &&
          <div className="grid grid-cols-5 gap-2 lg:gap-3" >
            {nftsImageMapper(swapTokens)}
          </div>
        }
      </div>
    </div>
  );
};

export default SwapHistoryDialogSideCard;