import React from 'react';

interface WalletCardProps {
  walletImage: string;
  walletAddress: string;
  copy: string;
}

const WalletCard: React.FC<WalletCardProps> = ({ walletImage, walletAddress, copy }) => {
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(walletAddress)
    }
  return (
    <div className="mt-2 w-1/2 rounded-sm bg-su_secondary_bg p-2 border-[1px] border-white/20">
      <img src={walletImage} alt="Wallet" />
      <div className="flex mt-2 items-center">
        <p className="text-sm mr-1 font-Urbanist">{walletAddress}</p>
        <img className="cursor-pointer" src={copy} alt="Copy" onClick={handleCopyToClipboard} />
      </div>
    </div>
  );
};

export default WalletCard;
