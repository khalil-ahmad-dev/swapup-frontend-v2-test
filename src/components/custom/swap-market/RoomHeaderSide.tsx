import React from 'react';
import CustomAvatar from '../shared/CustomAvatar';
import WalletAddressTile from '../tiles/WalletAddressTile';
import ChainTile from '../tiles/ChainTile';
import { useSwapMarketStore } from '@/store/swap-market';
import { SUT_PrivateRoomLayoutType, SUT_RoomKeyType } from '@/types/swap-market-store.types';
import { cn } from '@/lib/utils';

interface IProp {
  layoutType: SUT_PrivateRoomLayoutType;
  roomKey: SUT_RoomKeyType;
  counterPartyWallet?: string;
  senderWallet?: string;
  isLoading?: boolean;
  className?: string;
}

const RoomHeaderSide = ({ layoutType, roomKey, counterPartyWallet, senderWallet, isLoading, className }: IProp) => {

  const {
    profile,
  } = useSwapMarketStore((state) =>
    roomKey === 'privateRoom' ?
      (layoutType === "sender" ? state.privateMarket.privateRoom.sender : state.privateMarket.privateRoom.receiver)
      : (layoutType === "sender" ? state.openMarket.openRoom.sender : state.openMarket.openRoom.receiver)
  );

  const walletAddress = ((layoutType === "receiver") && (counterPartyWallet)) ? counterPartyWallet : senderWallet!;

  return (
    <aside className={cn(
      "flex justify-between items-center p-2 w-full",
      className
    )}
    >
      <div className="flex items-center gap-2 lg:gap-3">
        <CustomAvatar imageSrc={profile.avatar} fallbackName={profile.details?.title || profile.ensAddress || ''} isPremium={profile?.isPremium} />
        <h2 className="font-semibold text-sm text-su_primary lg:text-lg line-clamp-1 w-2/3 lg:w-auto">{profile.ensAddress}</h2>
      </div>

      <div className="flex items-center gap-2 text-su_secondary">
        <WalletAddressTile walletAddress={walletAddress} />
        <ChainTile
          imageSrc={profile.wallet.network.iconUrl}
          title={profile.wallet.network.name}
          showChainTitleOnMobileScreen
        />
      </div>
    </aside>
  );
};

export default RoomHeaderSide;