
import { ReactNode } from "react";
import EmptyDataset from "@/components/custom/shared/EmptyDataset";
import MainLayout from "@/layouts/MainLayout";
import PrivateRoom from "@/pages/PrivateRoom";
import SwapMarketPage from "@/pages/SwapMarketPage";
import MySwapsPage from "@/pages/MySwapsPage";
import UserProfile from "@/pages/UserProfile";
import ManageOpenMarketSwaps from "@/pages/ManageOpenMarketSwaps";
import OpenSwapCreationRoom from "@/pages/OpenSwapCreationRoom";
import OpenSwapProposeRoom from "@/pages/OpenSwapProposeRoom";
import ViewSwapRoom from "@/pages/ViewSwapRoom";
import CounterOfferSwapRoom from "@/pages/CounterOfferSwapRoom";
import SwapUpWebsite from "@/pages/SwapUpWebsite";
import { Navigate } from "react-router-dom";
import OpenMarketTabContent from "@/components/custom/swap-market/open-market/OpenMarketTabContent";
import PrivateMarketTabContent from "@/components/custom/swap-market/private-party/PrivateMarketTabContent";
import { defaults } from "@/constants/defaults";
import ProfileWalletOverviewTabContent from "@/components/custom/profile/wallet-overview/ProfileWalletOverviewTabContent";
import ProfilePointsAndSwappotTabContent from "@/components/custom/profile/points-swappot/ProfilePointsAndSwappotTabContent";
import ProfileAssetsTabContent from "@/components/custom/profile/assets/ProfileAssetsTabContent";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PendingSwapsTabContent from "@/components/custom/my-swaps/PendingSwapsTabContent";
import SwapHistoryTabContent from "@/components/custom/my-swaps/SwapHistoryTabContent";
import ServicesPage from "@/pages/Services";
import SubnameTokenAccess from "@/pages/SubnameTokenAccess";
import MembershipStoreTabContent from "@/components/custom/profile/membership-store/MembershipStoreTabContent";


export interface SUI_RoutesType {
  id: string;
  title: string;
  path: string;
  element?: ReactNode;
  layout?: ReactNode;
  child_routes?: SUI_RoutesType[];
}

const NotFoundPage = () => (
  <div className="min-h-[420px] flex items-center">
    <EmptyDataset navigateTo="/swap-up/swap-market" showBackgroundPicture={false} />
  </div >
);


export const clientSideRoutes: SUI_RoutesType[] = [
  {
    id: 'swapup-website',
    title: "Swapup landing page",
    path: "/",
    element: <SwapUpWebsite />,
  },
  {
    id: 'swapup-services',
    title: "Swapup Services",
    path: "/services",
    element: <ServicesPage />
  },
  {
    id: 'swapup-privacy-policy',
    title: "Swapup Privacy Policy",
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    id: 'swapup-main-layout',
    title: "SwapUp Main layout",
    path: "/swap-up",
    layout: <MainLayout />,
    child_routes: [
      {
        id: 'swapup-layout-home-page',
        title: "swapup layout home page",
        path: "",
        //Navigating to swap market page if user enter hits /swap-up route manually
        element: <Navigate to={defaults.fallback.route} />,
      },
      {
        id: 'swap-market-page',
        title: "Swap Market Page",
        path: "swap-market",
        layout: <SwapMarketPage />,
        child_routes: [
          {
            id: 'swap-market-redirect',
            title: "Swap Market Redirect",
            path: "",
            element: <Navigate to={`${defaults.swapMarket.baseRoute}/${defaults.swapMarket.defaultActiveTab}`} />,
          },
          {
            id: 'swap-market-open-teb',
            title: "Swap Market Open Tab",
            path: "open",
            element: <OpenMarketTabContent />,
          },
          {
            id: 'swap-market-private-tab',
            title: "Swap Market Private Tab",
            path: "private",
            element: <PrivateMarketTabContent />,
          },
        ]
      },
      {
        id: 'my-swaps-page',
        title: "My Swaps Page",
        path: "my-swaps",
        layout: <MySwapsPage />,
        child_routes: [
          {
            id: 'my-swaps-redirect',
            title: "My Swaps Redirect",
            path: "",
            element: <Navigate to={`${defaults.mySwaps.baseRoute}/${defaults.mySwaps.defaultActiveTab}`} />,
          },
          {
            id: 'my-swaps-pending-teb',
            title: "My Swaps Pending Tab",
            path: "pending/?",
            element: <PendingSwapsTabContent />,
          },
          {
            id: 'my-swaps-history-tab',
            title: "My Swaps History Tab",
            path: "history",
            element: <SwapHistoryTabContent />,
          },
        ]
      },
      {
        id: 'user-profile',
        title: "Profile",
        path: "profile",
        layout: <UserProfile />,
        child_routes: [
          {
            id: 'profile-redirect',
            title: "Profile Redirect",
            path: "",
            element: <Navigate to={`${defaults.profile.baseRoute}/${defaults.profile.defaultActiveTab}`} />,
          },
          {
            id: 'wallet-overview-tb',
            title: "Wallet Overview Tab",
            path: "wallet-overview",
            element: <ProfileWalletOverviewTabContent />,
          },
          {
            id: 'assets-tab',
            title: "Assets Tab",
            path: "assets",
            element: <ProfileAssetsTabContent />,
          },
          {
            id: 'points-swappot-tab',
            title: "Points & Swap",
            path: "points-swappot",
            element: <ProfilePointsAndSwappotTabContent />,
          },
          {
            id: 'membership-store-tab',
            title: "Membership Store",
            path: "membership-store",
            element: <MembershipStoreTabContent />,
          },
        ]
      },
      {
        id: 'create-private-swap',
        title: "Create private swap",
        path: "swap-market/private-swap/create/:counterPartyWallet/:privateTradeId",
        element: <PrivateRoom />,
      },
      {
        id: 'create-open-swap',
        title: "Create open market swap",
        path: "swap-market/open-swap/create/:openTradeId",
        element: <OpenSwapCreationRoom />,
      },
      {
        id: 'propose-open-swap',
        title: "Propose open swap room page",
        path: "swap-market/open-swap/propose/:openTradeId/:tradeId",
        element: <OpenSwapProposeRoom />,
      },
      {
        id: 'manage-open-market',
        title: "Manage Open Market Swaps",
        path: "swap-market/open-market/manage-open-market",
        element: <ManageOpenMarketSwaps />,
      },
      {
        id: 'view-swap',
        title: "View swap details",
        path: `swap-market/view-swap/:swapRoomMode/:tradeId`,
        element: <ViewSwapRoom />,
      },
      {
        id: 'counter-offer',
        title: "Counter Offer",
        path: `swap-market/counter-offer/:swapRoomMode/:tradeId`,
        element: <CounterOfferSwapRoom />,
      },
      {
        id: 'subname-access-token',
        title: "Counter Offer",
        path: `swap-market/subname-access-tokens`,
        element: <SubnameTokenAccess />,
      },
      {
        id: 'not-found-page',
        title: "Not found Page",
        path: "*",
        element: <NotFoundPage />,
      }
    ]
  },
  {
    id: 'not-found-page',
    title: "Not found Page",
    path: "*",
    element: <NotFoundPage />,
  }
];