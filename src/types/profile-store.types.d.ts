import { SUI_NFTItem, SUI_SubscriptionTokenBalance } from "./global.types";
import { IWallet, IProfile, IProfileDetails, SUI_SubnameItem, SUI_SubnameRecordTextItem, SUI_SubnameRecordAddressItem, SUI_CollectionOwnedItem } from "./profile.types";
import { SUT_GridViewType } from "./swap-market-store.types";

export type SUT_VisibilityToggleType = "all" | "hidden";
export type SUT_CreatingNewSubdomainProcessStepType = "advantages" | "enter-name" | "confirmation" | "transaction";
export type SUT_SubdomainTabType = "subnames" | "records";
export type SUT_EditSubdomainRecordsTabType = "text" | "address" | "other";

export interface IProfileAssetsFilters {
  collection?: string;
  rarityRank?: SUI_RarityRankItem;
}

export interface IProfileAssetTab {
  activeGridView: SUT_GridViewType;
  visibility: SUT_VisibilityToggleType;
  collections: string[] | [];
  nfts?: SUI_NFTItem[];
  filteredNfts?: SUI_NFTItem[];
  filters: IProfileAssetsFilters;
  filtersApplied: boolean;
  searchApplied: boolean;
  toggleVisibility: (value: SUT_VisibilityToggleType) => void;
  toggleGridView: (value: SUT_GridViewType) => void;
  setNftsDataset: (selectedNfts: SUI_NFTItem[]) => void;
  setNftsBySearch: (searchValue: string) => void;
  setNftsByFilters: (filters: IProfileAssetsFilters) => void;
  resetAllFilters: () => void;
}

export interface SUI_CreateNewSubdomain {
  steps: SUT_CreatingNewSubdomainProcessStepType[];
  currentStep?: SUT_CreatingNewSubdomainProcessStepType;
  name: string;
  action: string;
  subname: string;
  transactionHash: string;
  setTransactionHash: (hash: string) => void;
  navigateCreateSubdomainStep: (navigationMode: "PREVIOUS" | "NEXT") => void;
  resetSwapCreation: () => void;
  setSubnameValue: (enteredValue: string) => void;
}

export interface SUI_SubdomainStructure {
  createNewSubdomain: SUI_CreateNewSubdomain;
  availableSubnames: SUI_SubnameItem[];
  filteredAvailableSubnames: SUI_SubnameItem[];
  subdomainSectionTabs: SUT_SubdomainTabType[];
  activeTab: SUT_SubdomainTabType;
  records: {
    text?: SUI_SubnameRecordTextItem[];
    addresses?: SUI_SubnameRecordAddressItem[];
    contentHash?: string;
  };
  setActiveTab: (switchTo: SUT_SubdomainTabType) => void;
  setAvailableSubnames: (subnamesData: SUI_SubnameItem[]) => void;
}

export interface SUI_ProfileOverviewTab {
  totalWalletValue: number;
  totalNftsOwned: number;
  subscriptionTokenBalance?: SUI_SubscriptionTokenBalance;
  subdomainSection: SUI_SubdomainStructure;
  collectionsOwned: SUI_CollectionOwnedItem[];
  walletTokenBreakdownData: SUI_TokenBreakdownChartItem[];
  setSubscriptionTokenBalance: (subscriptionTokenBalance: SUI_SubscriptionTokenBalance) => void;
  setWalletTokenBreakdownData: (tokensData: SUI_TokenBreakdownChartItem[], totalUsdAmount: number) => void;
  setCollectionOwned: (collectionData: SUI_CollectionOwnedItem[]) => void;
}

export interface IProfileStore {
  profile: IProfile;
  assetTab: IProfileAssetTab;
  overviewTab: SUI_ProfileOverviewTab;
  setProfileWallet: (connectedWallet: IWallet) => void;
  setProfileAvatar: (avatar: string) => void;
  setProfileCoverImage: (coverImage: string) => void;
  setProfileDetails: (details: IProfileDetails) => void;
  setUserProfile: (userProfile: IProfile) => void;
  setUserSmartWallet: (smartWallet: string) => void;
}

