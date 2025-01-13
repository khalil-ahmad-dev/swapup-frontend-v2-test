import { getDefaultNftImageOnError } from "@/lib/utils";
import { SUI_SwapToken } from "@/types/swap-market.types";

const nftsImageMapper = (
  nfts: SUI_SwapToken[],
  showMaxNumberOfNfts: number,
  showMaxNumberOfNftsSm: number
) => {
  return (
    <div className="flex gap-2 w-full">
      {nfts.map((nft, index) => {
        const maxNumberOfNfts =
          window.innerWidth <= 640 ? showMaxNumberOfNftsSm : showMaxNumberOfNfts;
        if (index < maxNumberOfNfts) {
          return (
            <div className="relative w-16 h-16 md:w-28 md:h-28" key={nft.id}>
              <img
                className="w-full h-full object-cover rounded-lg border-[1.5px] border-white/20"
                src={nft.image_url}
                alt="nft"
                onError={getDefaultNftImageOnError}
              />
              {index === maxNumberOfNfts - 1 && nfts.length > maxNumberOfNfts && (
                <div className="absolute w-full h-full rounded-xs bg-black/50 top-0 flex justify-center items-center font-semibold">
                  +{nfts.length - maxNumberOfNfts}
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default nftsImageMapper;
