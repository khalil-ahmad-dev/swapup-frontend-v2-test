import { cn, getDefaultNftImageOnError, getBaseScanContractNftUrl, getBloackscoutNftUrl } from "@/lib/utils";
import { SUT_GridViewType } from "@/types/swap-market-store.types";
import { SUI_NFTItem } from "@/types/global.types";
import { Link } from "react-router-dom";
import { defaults } from "@/constants/defaults";
import { useProfileStore } from "@/store/profile";

interface IProp {
  className?: string;
  activeGridView: SUT_GridViewType;
  data: SUI_NFTItem;
}

const ProfileNftCard = ({ className, activeGridView, data, ...props }: IProp) => {

  const network = useProfileStore(state => state.profile.wallet.network);


  const imageURL = data.media.length > 0 ?
    data.media[0].gateway :
    defaults.fallback.nftImageUrl;
  return (

    <div
      className={cn(
        `${activeGridView === "detailed" ? "h-[196px]" : "h-[100px]"} peer bg-su_enable_bg rounded-md cursor-pointer relative hover:scale-105 transition duration-300 ease-in-out`,
        className,
        // (isChecked && !disableNftSelection) ? "opacity-30 backdrop-blur-(2px)" : ""
      )}
      {...props}
    >
      <div className={`relative ${activeGridView === "detailed" ? "h-[132px] rounded-tl-md rounded-tr-md" : "h-full rounded-md"}`}>
        <img
          className={`h-full w-full object-cover ${activeGridView === "detailed" ? "rounded-tl-md rounded-tr-md" : "rounded-md"}`}
          src={imageURL}
          alt=''
          onError={getDefaultNftImageOnError}
          loading="lazy"
        />

        <span className={`absolute peer top-2 ${activeGridView === "detailed" ? "right-3" : "right-1"} w-7 h-7 flex justify-center items-center rounded-full bg-transparent hover:bg-black/30`} >
          <svg className="w-1 " viewBox="0 0 4 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.00078 9.6C2.31904 9.6 2.62427 9.72643 2.84931 9.95147C3.07435 10.1765 3.20078 10.4817 3.20078 10.8C3.20078 11.1183 3.07435 11.4235 2.84931 11.6485C2.62427 11.8736 2.31904 12 2.00078 12C1.68252 12 1.3773 11.8736 1.15225 11.6485C0.927209 11.4235 0.800781 11.1183 0.800781 10.8C0.800781 10.4817 0.927209 10.1765 1.15225 9.95147C1.3773 9.72643 1.68252 9.6 2.00078 9.6ZM2.00078 4.8C2.31904 4.8 2.62427 4.92643 2.84931 5.15147C3.07435 5.37652 3.20078 5.68174 3.20078 6C3.20078 6.31826 3.07435 6.62348 2.84931 6.84853C2.62427 7.07357 2.31904 7.2 2.00078 7.2C1.68252 7.2 1.3773 7.07357 1.15225 6.84853C0.927209 6.62348 0.800781 6.31826 0.800781 6C0.800781 5.68174 0.927209 5.37652 1.15225 5.15147C1.3773 4.92643 1.68252 4.8 2.00078 4.8ZM2.00078 0C2.31904 0 2.62427 0.126428 2.84931 0.351472C3.07435 0.576515 3.20078 0.88174 3.20078 1.2C3.20078 1.51826 3.07435 1.82348 2.84931 2.04853C2.62427 2.27357 2.31904 2.4 2.00078 2.4C1.68252 2.4 1.3773 2.27357 1.15225 2.04853C0.927209 1.82348 0.800781 1.51826 0.800781 1.2C0.800781 0.88174 0.927209 0.576515 1.15225 0.351472C1.3773 0.126428 1.68252 0 2.00078 0Z" fill="white" />
          </svg>
        </span>

        <div className={`absolute hidden peer-hover:flex hover:flex flex-col gap-1.5 z-50 ${activeGridView === "detailed" ? "-left-3 top-9 w-full" : "-left-1 top-8 w-40"} bg-su_least_bg rounded-md p-2`} >

          {/* <button className="w-full hover:cursor-pointer hover:text-su_primary hover:bg-su_active_bg rounded-xs flex items-center gap-2 text-xs text-su_ternary font-medium px-2 py-1.5" >
            <svg className="w-3 mr-1" viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 4L10.1111 0H0.772333C0.567632 -1.06764e-07 0.371304 0.0835856 0.226486 0.232392C0.0816678 0.381197 0.000206144 0.583051 0 0.7936V15.2064C0.00162917 15.4165 0.0835473 15.6175 0.228058 15.766C0.372569 15.9145 0.568072 15.9985 0.772333 16H13.2277C13.4324 16 13.6287 15.9164 13.7735 15.7676C13.9183 15.6188 13.9998 15.4169 14 15.2064V4ZM6.22222 6C6.22222 6.31826 6.09931 6.62348 5.88051 6.84853C5.66172 7.07357 5.36497 7.2 5.05556 7.2C4.74614 7.2 4.44939 7.07357 4.2306 6.84853C4.01181 6.62348 3.88889 6.31826 3.88889 6C3.88889 5.68174 4.01181 5.37652 4.2306 5.15147C4.44939 4.92643 4.74614 4.8 5.05556 4.8C5.36497 4.8 5.66172 4.92643 5.88051 5.15147C6.09931 5.37652 6.22222 5.68174 6.22222 6ZM11.2778 12H3.88889L8.16667 6.4L11.2778 12Z" fill="currenColor" />
            </svg>

            Open asset page
          </button> */}

          {/* <button className="w-full hover:cursor-pointer hover:text-su_primary hover:bg-su_active_bg rounded-xs flex items-center gap-2 text-xs text-su_ternary font-medium px-2 py-1.5" >
            <svg className="w-4" viewBox="0 0 16 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.8 3.5L4.8 -4.89568e-07L-2.29485e-07 5.25L16 5.25L16 3.5L4.8 3.5ZM13.6 8.75L-3.82475e-07 8.75L-4.5897e-07 10.5L11.2 10.5L11.2 14L16 8.75L13.6 8.75Z" fill="currenColor" />
            </svg>


            Select to hide
          </button> */}

          <button className="w-full hover:cursor-pointer hover:text-su_primary hover:bg-su_active_bg rounded-xs flex items-center gap-2 text-xs text-su_ternary font-medium px-2 py-1.5" >
            <svg className="w-4" viewBox="0 0 16 13" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.87636 4.10526L10.1818 6.26737V6.1579C10.1818 5.6135 9.95195 5.09141 9.54278 4.70646C9.13361 4.32152 8.57865 4.10526 8 4.10526H7.87636ZM4.74909 4.65263L5.87636 5.71316C5.84 5.85684 5.81818 6.00053 5.81818 6.1579C5.81818 6.70229 6.04805 7.22438 6.45722 7.60932C6.86639 7.99427 7.42135 8.21053 8 8.21053C8.16 8.21053 8.32 8.19 8.47273 8.15579L9.6 9.21632C9.11273 9.44211 8.57455 9.57895 8 9.57895C7.03558 9.57895 6.11065 9.21852 5.4287 8.57694C4.74675 7.93537 4.36364 7.06521 4.36364 6.1579C4.36364 5.61737 4.50909 5.11105 4.74909 4.65263ZM0.727273 0.868947L2.38545 2.42895L2.71273 2.73684C1.51273 3.62632 0.567273 4.78947 0 6.1579C1.25818 9.16158 4.36364 11.2895 8 11.2895C9.12727 11.2895 10.2036 11.0842 11.1855 10.7147L11.4982 11.0021L13.6218 13L14.5455 12.1311L1.65091 0M8 2.73684C8.96442 2.73684 9.88935 3.09727 10.5713 3.73885C11.2532 4.38042 11.6364 5.25058 11.6364 6.1579C11.6364 6.59579 11.5418 7.02 11.3745 7.40316L13.5055 9.4079C14.5964 8.55263 15.4691 7.43053 16 6.1579C14.7418 3.15421 11.6364 1.02632 8 1.02632C6.98182 1.02632 6.00727 1.19737 5.09091 1.50526L6.66909 2.97632C7.08364 2.82579 7.52727 2.73684 8 2.73684Z" fill="currenColor" />
            </svg>

            Hide
          </button>

          {/* <button className="w-full hover:cursor-pointer hover:text-su_primary hover:bg-su_active_bg rounded-xs flex items-center gap-2 text-xs text-su_ternary font-medium px-2 py-1.5" >
            <svg className="w-3.5" viewBox="0 0 15 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5627 14.6246C14.5628 15.0351 14.473 15.4406 14.2996 15.8127C14.1263 16.1848 13.8735 16.5145 13.5592 16.7785C13.2449 17.0425 12.8766 17.2345 12.4801 17.3411C12.0837 17.4476 11.6687 17.4661 11.2644 17.3952C10.8601 17.3242 10.4762 17.1657 10.1396 16.9306C9.80311 16.6955 9.52212 16.3896 9.3164 16.0344C9.11068 15.6792 8.98522 15.2832 8.94882 14.8743C8.91242 14.4654 8.96597 14.0535 9.10571 13.6675L4.96508 11.0074C4.56962 11.3953 4.06842 11.6578 3.52434 11.7619C2.98027 11.8661 2.41756 11.8072 1.9068 11.5928C1.39604 11.3783 0.959988 11.0178 0.653339 10.5565C0.346691 10.0951 0.183105 9.55352 0.183105 8.99957C0.183105 8.44562 0.346691 7.904 0.653339 7.44267C0.959988 6.98133 1.39604 6.62083 1.9068 6.40638C2.41756 6.19192 2.98027 6.13308 3.52434 6.23722C4.06842 6.34136 4.56962 6.60385 4.96508 6.99176L9.10571 4.33551C8.86861 3.68398 8.87987 2.96793 9.13736 2.32419C9.39484 1.68045 9.88049 1.15414 10.5015 0.845844C11.1225 0.537546 11.8354 0.468872 12.5038 0.652943C13.1722 0.837014 13.7494 1.26092 14.1251 1.84367C14.5007 2.42642 14.6485 3.12715 14.5401 3.81195C14.4318 4.49676 14.0749 5.11764 13.5377 5.55594C13.0005 5.99425 12.3206 6.21925 11.628 6.18795C10.9354 6.15665 10.2785 5.87126 9.78305 5.38629L5.64243 8.04645C5.86621 8.66484 5.86621 9.34211 5.64243 9.96051L9.78305 12.6207C10.1784 12.2338 10.679 11.972 11.2224 11.8682C11.7657 11.7644 12.3276 11.8231 12.8377 12.0369C13.3478 12.2508 13.7836 12.6104 14.0904 13.0706C14.3972 13.5309 14.5615 14.0714 14.5627 14.6246Z" fill="currenColor" />
            </svg>

            Open asset page
          </button> */}
        </div>

      </div>
      {
        activeGridView === "detailed" &&
        <div className="p-3 flex flex-col gap-2" >
          <div className="flex items-center justify-between" >
            <p className="text-xs lg:text-sm font-semibold capitalize w-4/5 line-clamp-1">{data.title}</p>

            <Link to={getBaseScanContractNftUrl(data.contract.address, data.tokenId)} target="_blank" >
              <svg className="w-4" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.83666 6.06934C3.51408 6.06934 3.24863 6.33479 3.24863 6.65793L3.24919 10.3637C3.24919 10.6179 3.06437 10.8375 2.81068 10.8604C2.52282 10.8952 2.29208 10.9181 2.10727 10.9299C1.76117 10.9646 1.43803 10.7916 1.26498 10.4914C1.046 10.1106 0.861192 9.71797 0.722863 9.30242C-0.545618 5.65379 1.39211 1.65961 5.03738 0.389449C8.68266 -0.880713 12.6735 1.05925 13.9425 4.70733C14.0579 5.03047 14.0002 5.37713 13.7924 5.64259C13.1002 6.54313 12.2232 7.29357 11.3697 7.91689V3.67966C11.3697 3.34476 11.1043 3.0793 10.7811 3.0793H9.78929C9.46615 3.0793 9.20069 3.35652 9.20069 3.67966V8.81687C9.20069 9.02521 9.08532 9.19826 8.90051 9.2789C8.65858 9.38251 8.41608 9.48668 8.41608 9.48668V5.18C8.41608 4.8451 8.13942 4.57964 7.81628 4.57964H6.82446C6.49012 4.57964 6.22466 4.85686 6.22466 5.18V9.82102C6.22466 10.0523 6.06281 10.2483 5.84383 10.306C5.68198 10.3407 5.54365 10.3755 5.42829 10.4102V6.66969C5.42829 6.33479 5.15163 6.06934 4.82849 6.06934H3.83666ZM12.9953 11.1145C10.7232 14.2429 6.35104 14.9357 3.22492 12.6613C7.04324 12.1187 11.7615 10.3294 14.3103 6.50823L14.3119 6.53171C14.3226 6.68568 14.3332 6.8392 14.3332 6.99322C14.3332 8.4706 13.8606 9.91381 12.9953 11.1145Z" fill="#B6B6BD" />
              </svg>
            </Link>
          </div>

          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-2" >
              <Link to={getBloackscoutNftUrl(data.contract.address, data.tokenId)} target="_blank" >
                <img src={network.iconUrl} alt="" className="w-4 h-4 rounded-full" />
              </Link>

              {/* <p className="text-xs text-su_secondary uppercase">{data.amount} {data.network.title.slice(0, 3)}</p> */}
            </div>

            <div className="flex items-center gap-2" >
              <svg className="w-4" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.05148 2.85714L6.33398 0L4.61648 2.85714H8.05148ZM2.05148 7.14286L0.333984 10H12.334L10.6165 7.14286H2.05148ZM10.189 6.42857L8.47898 3.57143H4.18898L2.47898 6.42857H10.189Z" fill="#FFC175" />
              </svg>
              <p className="text-xs text-su_secondary">{data.rarityRank}</p>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default ProfileNftCard;;