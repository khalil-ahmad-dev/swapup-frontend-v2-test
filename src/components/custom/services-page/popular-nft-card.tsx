import React from 'react';

interface PopularNftCardProps {
  imageSrc: string;
  title: string;
  currencyAmount: string;
  currencyImageSrc: string;
  ranking?: string
}

const PopularNftCard: React.FC<PopularNftCardProps> = ({ imageSrc, title, currencyAmount, currencyImageSrc, ranking }) => {
  return (
    <div className="rounded-3xl bg-su_secondary_bg relative">
      <img
        className="max-h-[186px] max-w-[200px] md:max-h-[268px] md:max-w-[288px] "
        src={imageSrc}
        alt={"NFT"}
      />
      {ranking?
      <div className="flex items-center absolute pt-2 pr-3 pb-2 pl-2 bg-white top-2 left-2 cursor-pointer rounded-md min-h-[32px] min-w-[52px]">
      <img className='mr-2' src="/assets/services-page/ranking.png"/>
      <p className='text-black font-Urbanist text-xs font-semibold'>{ranking}</p>
      
    </div> : ''}
      
      <div className="p-4 md:p-8">
        <div>
          <p className="font-Urbanist text-base md:text-xl">{title}</p>
        </div>
        <div className="flex mt-2">
          <img className="w-5 h-5 md:w-6 md:h-6" src={currencyImageSrc} alt="Currency" />
          <p className="font-Urbanist ml-2 text-sm md:text-base text-su_ternary">{currencyAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default PopularNftCard;
