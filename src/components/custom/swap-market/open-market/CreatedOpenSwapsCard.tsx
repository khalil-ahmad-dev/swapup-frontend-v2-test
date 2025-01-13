import { Card, CardContent } from "@/components/ui/card";
import CopyTile from "../../tiles/CopyTile";
import { SUI_OpenSwap, SUI_SwapToken } from "@/types/swap-market.types";
import { getLastCharacters } from "@/lib/utils";
import { chainsDataset } from "@/constants/data";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/store/profile";
import { mapSwapTokensHelper, showWalletConnectionToast } from "@/lib/helpers";
import ChainTile from "../../tiles/ChainTile";


interface IProp {
  swap: SUI_OpenSwap;
}

const CreatedOpenSwapsCard = ({ swap }: IProp) => {
  const navigate = useNavigate();
  const wallet = useProfileStore(state => state.profile.wallet);

  const currentChain = chainsDataset.find(chain => chain.uuid === swap.trading_chain) || chainsDataset[1];

  return (
    <div
      className="min-w-[343px] lg:min-w-[208px] lg:max-w-[208px] rounded-md bg-card dark:bg-su_secondary_bg p-2 hover:scale-105 transition duration-300 ease-in-out space-y-2"
    >
      <div
        className="flex gap-1 items-center cursor-pointer"
        onClick={() => { wallet.isConnected ? navigate(`/swap-up/swap-market/open-market/manage-open-market`) : showWalletConnectionToast(); }}
      >
        {/* Desktop swap tokens */}
        <div className="hidden lg:flex lg:items-center lg:gap-1 p-1" >
          {mapSwapTokensHelper(swap.metadata.init.tokens, 4)}
        </div>

        {/* Mobile swap tokens */}
        <div className="flex lg:hidden items-center gap-1 p-1" >
          {mapSwapTokensHelper(swap.metadata.init.tokens, 8)}
        </div>
      </div>

      <div className="flex items-center gap-2 lg:justify-center" >
        <CopyTile
          textToCopy={swap.open_trade_id}
          className="flex text-xs lg:text-2xs"
        >
          <span className="dark:text-su_primary">#{getLastCharacters(swap.open_trade_id, 7)}</span>
        </CopyTile>

        <ChainTile
          imageSrc={currentChain.iconUrl}
          title={currentChain.name}
          showChainTitleOnMobileScreen
          titleClassName="text-xs lg:text-2xs"
        />
      </div>
    </div>
  );
};

export default CreatedOpenSwapsCard;