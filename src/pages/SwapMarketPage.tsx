import { cn, getActiveTabFromPathname } from "@/lib/utils";
import { createSearchParams, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSwapMarketStore } from "@/store/swap-market";
import { defaults } from "@/constants/defaults";
import CustomTabContainer from "@/components/custom/shared/CustomTabContainer";
import NewMembersSection from "@/components/custom/swap-market/NewMembersSection";
import CommunityMemberSection from "@/components/custom/swap-market/open-market/CommunityMemberSection";
import CreateNewSwapDropdown from "@/components/custom/shared/CreateNewSwapDropdown";
import TrendingNftCollectionSection from "@/components/custom/swap-market/nft/TrendingNftCollectionSection";
import TrendingNftTradersSection from "@/components/custom/swap-market/nft/TrendingNftTradersSection";
import { useEffect, useState } from "react";
import TrendingCryptoTraderSection from "@/components/custom/swap-market/crypto/TrendingCryptoTraderSection";
import TradeCryptoSection from "@/components/custom/swap-market/crypto/TradeCryptoSection";
import TrendingTokenPairsSection from "@/components/custom/swap-market/crypto/TrendingTokenPairsSection";
import TrendingTokensSection from "@/components/custom/swap-market/crypto/TrendingTokesSection";
import NftCollectionProjectSlider from "@/components/custom/swap-market/nft/NftCollectionProjectSlider";

type swapMarketHeaderTabsType = "digital-assets" | "crypto";
interface swapMarketHeaderTabItem {
  key: swapMarketHeaderTabsType;
  value: string;
}

const swapMarketHeaderTabs: swapMarketHeaderTabItem[] = [
  {
    key: "digital-assets",
    value: "digital assets"
  },
  // {
  //   key: "crypto",
  //   value: 'crypto'
  // }
];

const SwapMarketPage = () => {
  const [swapMarketHeaderTab, setSwapMarketHeaderTab] = useState<swapMarketHeaderTabsType>('digital-assets');

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const swapTabParam = searchParams.get('tab');

  const openMarketSwapLength = useSwapMarketStore(state => (state.openMarket.filteredAvailableOpenSwaps || []).length + (state.openMarket.createdSwaps || []).length);
  const privateSwapLength = useSwapMarketStore(state => (state.privateMarket.filteredAvailablePrivateSwaps || []).length);

  useEffect(() => {
    if (swapTabParam) {
      setSwapMarketHeaderTab(swapTabParam as swapMarketHeaderTabsType);
    }

    if (!swapTabParam) {
      setSwapMarketHeaderTab("digital-assets"); // default tab is nft
    }
  }, [swapTabParam]);


  return (
    <section className="" >
      {/* NFT and Crypto tabs section */}
      <section className="w-full bg-su_disabled_bg absolute left-0 top-32 grid grid-cols-7">
        <CustomTabContainer className="col-span-3 w-full h-full">
          {swapMarketHeaderTabs.map(tab => (
            <button
              className={cn(
                `inline-flex bg-transparent items-center justify-center gap-3 text-xl lg:text-2xl font-bold w-1/2 h-full capitalize`,
                // tab.value === 'digital-assets' ? "uppercase" : "capitalize",
                swapMarketHeaderTab === tab.key ? "text-su_primary" : "text-su_secondary",
                swapMarketHeaderTab === tab.key && "border-b-2 border-su_primary"
              )}
              key={tab.key}
              onClick={() => navigate({
                pathname: pathname,
                search: createSearchParams({ tab: tab.key }).toString()
              })}
            >
              {tab.value}
            </button>
          ))}
        </CustomTabContainer>

        <div className="col-span-4 flex items-center justify-end gap-4 px-3 py-2 lg:px-6" >
          <CreateNewSwapDropdown />
        </div>
      </section>

      <div className="space-y-6 mt-16" >

        {/* NFT tab content section */}
        {swapMarketHeaderTab === "digital-assets" &&
          <section className="space-y-6 pt-10" >
            {/* NFT collection project slider section */}
            <NftCollectionProjectSlider />

            {/* Trending Crypto token pairs section */}
            <TrendingTokenPairsSection />

            {/* Trending Crypto tokens section */}
            <TrendingTokensSection />

            {/* Trending NFT collection section */}
            <TrendingNftCollectionSection />

            {/* Trending NFT Traders section */}
            <TrendingNftTradersSection />
          </section>
        }

        {/* Crypto tab content section */}
        {swapMarketHeaderTab === "crypto" && <></>
          // <section className="space-y-6" >
          //   {/* Crypto Trade section */}
          //   <TradeCryptoSection className="" />

          //   {/* Trending Crypto token pairs section */}
          //   <TrendingTokenPairsSection />

          //   {/* Trending Crypto tokens section */}
          //   <TrendingTokensSection />

          //   {/* Trending Crypto Traders section */}
          //   <TrendingCryptoTraderSection />
          // </section>
        }

        {/* New members section - latest version */}
        <NewMembersSection />

        {/* Community members section */}
        <CommunityMemberSection />

        {/* Swap market page tabs */}
        <CustomTabContainer >
          {
            defaults.swapMarket.tabs.map(tab => {
              const activeTab = getActiveTabFromPathname(pathname);
              return (
                <button
                  key={tab.key}
                  onClick={() => navigate({
                    pathname: tab.path,
                    search: createSearchParams({ tab: swapMarketHeaderTab }).toString()
                  })}
                  className={`relative flex bg-transparent ${activeTab === tab.key ? "text-su_primary" : "text-muted-foreground"} items-center gap-3 text-sm font-bold px-3 `}
                >
                  {tab.title}

                  <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${activeTab === tab.key ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                    {tab.key === 'open' && openMarketSwapLength}
                    {tab.key === 'private' && privateSwapLength}
                  </span>

                  <span className={`${activeTab === tab.key ? "absolute -bottom-3.5 left-0 border-b-2 border-su_primary w-full" : ""}`} ></span>
                </button>
              );
            })
          }
        </CustomTabContainer>

        <div className="w-full" >
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default SwapMarketPage;