import { SUI_NavItem, SUI_RarityRankItem } from "@/types/global.types";
import { defaults } from "./defaults";

export const navItemsData: SUI_NavItem[] = [
  {
    key: "swap-market",
    title: "Swap Market",
    basePath: `${defaults.swapMarket.baseRoute}`,
    path: `${defaults.swapMarket.baseRoute}/${defaults.swapMarket.defaultActiveTab}`,
    protected: false,
    hash: ''
  },
  {
    key: "my-swaps",
    title: "My Swaps",
    basePath: `${defaults.mySwaps.baseRoute}`,
    path: `${defaults.mySwaps.baseRoute}/${defaults.mySwaps.defaultActiveTab}`,
    protected: true,
    hash: ''
  },
  {
    key: "Profile",
    title: "Profile",
    basePath: `${defaults.profile.baseRoute}`,
    path: `${defaults.profile.baseRoute}/${defaults.profile.defaultActiveTab}`,
    protected: true,
    hash: ''
  }
];

export const landingPageNavData: SUI_NavItem[] = [
  {
    key: "home",
    title: "Home",
    basePath: '/',
    path: "/",
    protected: false,
    hash: '#home'
  },
  {
    key: "services",
    title: "Services",
    basePath: '/',
    path: "/services",
    protected: false,
    hash: ''
  },
  {
    key: "nfts-services",
    title: "Services",
    basePath: '/',
    path: "/services",
    protected: false,
    hash: '#nfts'
  },
  {
    key: "crypto-services",
    title: "Services",
    basePath: '/',
    path: "/services",
    protected: false,
    hash: '#crypto'
  },
  {
    key: "growth",
    title: "Growth",
    basePath: '/',
    path: "/",
    protected: false,
    hash: '#we-are-growing'
  },
  {
    key: "roadmap",
    title: "Roadmap",
    basePath: '/',
    path: "/",
    protected: false,
    hash: '#roadmap-section'
  },
  {
    key: "faq",
    title: "FAQ",
    basePath: '/',
    path: "/",
    protected: false,
    hash: '#faq'
  },

];