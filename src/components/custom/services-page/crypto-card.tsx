import React from 'react';

interface CryptoCardProps {
  title: string;
  imageUrl: string;
  amount: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ title, imageUrl, amount }) => {
  return (
    <div className="mt-2 w-1/2 rounded-sm bg-su_secondary_bg p-2 border-[1px] border-white/20">
      <p className="text-xs text-su_ternary font-Urbanist">{title}</p>
      <div className="flex mt-3">
        <img className="mr-1" src={imageUrl} alt="Crypto" />
        <p className="text-sm font-Urbanist">{amount}</p>
      </div>
    </div>
  );
};

export default CryptoCard;