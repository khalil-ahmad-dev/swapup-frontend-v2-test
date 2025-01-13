import { cn, getDefaultNftImageOnError, getShortenWalletAddress } from '@/lib/utils';
import CopyTile from '../../tiles/CopyTile';
import { Separator } from '@/components/ui/separator';
import { SUI_TrendingToken } from '@/types/analytics.types';

interface IProp {
  className?: string;
  item: SUI_TrendingToken;
}

const TrendingTokenCardItem = ({ className, item }: IProp) => {
  return (
    <div className={cn(
      "px-3 py-6 rounded-md bg-su_card_secondary flex flex-col gap-4 w-[320px]",
      className
    )}>
      <header className='flex items-center gap-4' >

        <img
          className='h-10 w-10'
          src={item.image_url || item.additionalData?.iconUrl}
          alt=""
          loading='lazy'
          onError={(e: any) => {
            e.currentTarget.className = "h-10 w-10 rounded-full object-cover";
            getDefaultNftImageOnError(e);
          }}
        />

        <div className='flex flex-col gap-1' >
          <h3 className='text-base text-su_primary font-semibold line-clamp-1' >{item.additionalData?.name || item.symbol}</h3>
          <p className='flex items-center gap-10 text-sm font-normal' >
            <span className='text-su_ternary' >{item.additionalData?.price ? `$ ${Number(item.additionalData.price).toFixed(6)}` : 'N/A'}</span>
            <span className={cn(
              "text-xs font-semibold",
              (item.additionalData?.change || "").includes('-') ? "text-su_negative" : "text-su_positive"
            )}>
              {item.additionalData?.change ? (item.additionalData.change.includes('-') ? "<" : "+") : ''}
              {item.additionalData?.change ? `${item.additionalData.change.replace('-', '')}%` : ''}
            </span>
          </p>
        </div>
      </header>

      {/* Divider */}
      <Separator orientation='horizontal' />

      <div className='flex flex-col gap-4' >
        <p className='flex items-center justify-between' >
          <span className='text-xs text-su_ternary'>Contract Address</span>

          <CopyTile className='dark:bg-transparent p-0 text-base font-normal dark:text-su_primary' textToCopy={item.address} >{getShortenWalletAddress(item.address)}</CopyTile>
        </p>

        <p className='flex items-center justify-between' >
          <span className='text-xs text-su_ternary'>24H Volume</span>

          <span className='text-base font-semibold' > {Number(item.additionalData?.['24hVolume'] || 0).toLocaleString('en-us')}</span>
        </p>
      </div>
    </div>
  );
};

export default TrendingTokenCardItem;