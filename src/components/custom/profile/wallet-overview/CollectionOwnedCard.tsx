import { getDefaultNftImageOnError } from '@/lib/utils';
import { SUI_CollectionOwnedItem } from '@/types/profile.types';
import React from 'react';
import YesNoTile from '../../tiles/YesNoTile';

interface IProp {
  collection: SUI_CollectionOwnedItem;
}
const CollectionOwnedCard = ({ collection }: IProp) => {
  return (
    <div className='border-[1.5px] border-su_enable_bg rounded-[20px] flex flex-col' >

      <div className='p-3 flex items-center gap-2 text-sm font-semibold capitalize' >
        <img
          className="w-8 h-8 object-cover rounded-xs border-[1.5px] border-white/20"
          src={collection.cover}
          alt="nft"
          onError={getDefaultNftImageOnError}
        />
        {collection.collectionName}
      </div>
      <span className='border border-su_enable_bg w-full' ></span>

      <div className='p-3 grid grid-cols-3 gap-y-3' >
        <div className='flex flex-col gap-1' >
          <p className='text-su_secondary font-normal text-2xs' >Assets #</p>
          <p className='text-text dark:text-su_primary text-sm font-semibold' >{collection.ownedAssets}</p>
        </div>
        <div className='flex flex-col gap-1' >
          <p className='text-su_secondary font-normal text-2xs' >Floor price</p>
          <p className='text-text dark:text-su_primary text-sm font-semibold' >{collection.floorPrice} SOL</p>
        </div>
        <div className='flex flex-col gap-1' >
          <p className='text-su_secondary font-normal text-2xs' >Highest rank NFT</p>
          <p className='text-text dark:text-su_primary text-sm font-semibold' >{collection.highestRankNft}</p>
        </div>
        <div className='flex flex-col gap-1' >
          <p className='text-su_secondary font-normal text-2xs' >Volume</p>
          <p className='text-text dark:text-su_primary text-sm font-semibold' >{collection.volume} SOL</p>
        </div>
        <div className='flex flex-col gap-1' >
          <p className='text-su_secondary font-normal text-2xs' >Assets #</p>
          <p className='text-text dark:text-su_primary text-sm font-semibold' >
            <YesNoTile yes={collection.openApproval} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionOwnedCard;