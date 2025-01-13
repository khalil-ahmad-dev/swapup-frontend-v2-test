import { cn, getDefaultNftImageOnError, getNumberToShortScaleFormate } from '@/lib/utils';
import BadgeTile from '../../tiles/BadgeTile';
import { SUI_TrendingTokenPair } from '@/types/analytics.types';

interface IProp {
  className?: string;
  pairItem: SUI_TrendingTokenPair;
}

const TokenPairCardItem = ({ pairItem, className }: IProp) => {
  return (
    <div className={cn(
      "p-6 rounded-sm bg-su_enable_bg flex flex-col gap-4 min-w-[210px]",
      className
    )}>
      <div className='flex flex-col gap-2 items-center'>
        <BadgeTile className='px-4 min-w-[70px] text-sm font-semibold text-su_info' >
          {getNumberToShortScaleFormate(pairItem.count)} {(pairItem.count > 1000) && "+"}
        </BadgeTile>
        <p className='text-su_ternary text-xs' >SwapUps</p>
      </div>

      <div className='flex justify-center items-center gap-2' >
        <p className='flex items-center gap-1' >
          <img
            className='w-4 h-4'
            src={pairItem.init.image_url}
            alt=""
            loading='lazy'
            onError={(e: any) => {
              e.currentTarget.className = "w-4 h-4 rounded-full object-cover";
              getDefaultNftImageOnError(e);
            }}
          />
          <span className='text-sm font-semibold text-su_primary capitalize' >{pairItem.init.symbol}</span>
        </p>
        /
        <p className='flex items-center gap-1' >
          <img
            className='w-4 h-4'
            src={pairItem.accept.image_url}
            alt=""
            loading='lazy'
            onError={(e: any) => {
              e.currentTarget.className = "w-4 h-4 rounded-full object-cover";
              getDefaultNftImageOnError(e);
            }}
          />
          <span className='text-sm font-semibold text-su_primary capitalize' >{pairItem.accept.symbol}</span>
        </p>
      </div>
    </div>
  );
};

export default TokenPairCardItem;