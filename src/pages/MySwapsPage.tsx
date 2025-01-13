import { Input } from "@/components/ui/input";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getActiveTabFromPathname } from "@/lib/utils";
import { defaults } from "@/constants/defaults";
import CustomTabContainer from "@/components/custom/shared/CustomTabContainer";
import { useMySwapStore } from "@/store/my-swaps";
import { SUT_MySwapsTabType } from "@/types/my-swaps-store.types";
import { useProfileStore } from "@/store/profile";

const MySwapsPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [setFilteredMySwapsBySearch, pendingSwapsLength, swapHistoryLength] = useMySwapStore(state => [state.setFilteredMySwapsBySearch, (state.filteredPendingSwaps || []).length, (state.filteredHistorySwaps || []).length]);
  const walletAddress = useProfileStore(state => state.profile.wallet.address);

  const handleSwapsDataBySearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    const tabType: SUT_MySwapsTabType = getActiveTabFromPathname(pathname) as SUT_MySwapsTabType;
    setFilteredMySwapsBySearch(searchValue, tabType, walletAddress);
  };

  return (
    <>
      <section className="space-y-4" >
        {/* Title */}
        <div className="flex items-center justify-between" >
          <h2 className="text-2xl font-semibold" >My Swaps</h2>
          <Input
            className="hidden lg:flex w-1/3 bg-su_enable_bg text-su_secondary !p-3.5 mr-1"
            placeholder="Search by asset name or wallet address..."
            onChange={handleSwapsDataBySearch}
            icon={
              <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 14.6154L11.2277 9.84231C11.9968 8.78544 12.4105 7.5117 12.4092 6.20462C12.4092 2.78346 9.62577 0 6.20462 0C2.78346 0 0 2.78346 0 6.20462C0 9.62577 2.78346 12.4092 6.20462 12.4092C7.5117 12.4105 8.78544 11.9968 9.84231 11.2277L14.6154 16L16 14.6154ZM6.20462 10.4496C5.36493 10.4497 4.54407 10.2008 3.84586 9.7343C3.14765 9.26784 2.60345 8.60481 2.28208 7.82905C1.96071 7.05329 1.8766 6.19965 2.0404 5.37609C2.2042 4.55253 2.60854 3.79604 3.20229 3.20229C3.79604 2.60854 4.55253 2.2042 5.37609 2.0404C6.19965 1.8766 7.05329 1.96071 7.82905 2.28208C8.60481 2.60345 9.26784 3.14765 9.7343 3.84586C10.2008 4.54407 10.4497 5.36493 10.4496 6.20462C10.4483 7.33005 10.0006 8.40902 9.20482 9.20482C8.40902 10.0006 7.33005 10.4483 6.20462 10.4496Z" fill="#868691" />
              </svg>
            }
          />
        </div>

        <CustomTabContainer >
          {
            defaults.mySwaps.tabs.map(tab => {
              const activeTab = getActiveTabFromPathname(pathname);
              return (
                <button
                  key={tab.key}
                  onClick={() => navigate(tab.path)}
                  className={`relative flex bg-transparent ${activeTab === tab.key ? "text-su_primary" : "text-muted-foreground"} items-center gap-3 text-sm font-bold px-3 `}
                >
                  {tab.title}

                  <span className={`bg-text font-semibold rounded-full py-0.5 px-3 text-xs ${activeTab === tab.key ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                    {tab.key === 'pending' && pendingSwapsLength}
                    {tab.key === 'history' && swapHistoryLength}
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
      </section >
    </>
  );
};

export default MySwapsPage;