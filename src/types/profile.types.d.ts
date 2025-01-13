import { SUI_CurrencyChainItem } from "./global.types";


export type SUT_ProfileTagsVariantType = "normie" | "premium" | "trader" | "collector" | "community-member";
export type SUT_BlobStorageImageType = "profile-avatar" | "profile-cover";
export type SUT_AvailablePointSystemKeysType = 'created-open-trade' | 'completed-open-trade' | 'completed-private-trade' | 'created-social-post' | 'minted-subname' | 'total';
export type SUT_AvailablePointSystemPointsType = 500 | 2000 | 20000 | 0;
export type SUT_PointSystemType = { [K in SUT_AvailablePointSystemKeysType]: SUT_AvailablePointSystemPointsType; };

export type SUT_PointsWithTotal = {
    [K in Exclude<SUT_AvailablePointSystemKeysType, 'total'>]?: SUT_AvailablePointSystemPointsType;
} & {
    total: number;
};

export interface INetwork {
    id: string;
    name: string;
    symbol: string;
    iconUrl: string;
};

export interface IWallet {
    isConnected: boolean;
    address: string;
    network: INetwork;
}

export interface IProfileDetails {
    title: string,
    description: string;
    twitter?: string;
    warpcast?: string;
    tags?: SUT_ProfileTagsVariantType[];
    points?: SUT_PointsWithTotal;
    smartAccount?: string;
    privateKey?: string;
};

export interface IProfile {
    wallet: IWallet;
    ensAddress: string;
    avatar: string,
    coverImage: string;
    isPremium: boolean,
    joinDate: string;
    details?: IProfileDetails;
}

export interface SUI_TokenBreakdownChartItem {
    key: string,
    network: SUI_DistributionTokenNetwork;
    usdAmount: number;
    percentage: number;
    balance?: number;
}

interface SUI_DistributionTokenNetwork extends Pick<SUI_CurrencyChainItem, "iconUrl" | "name" | "symbol"> { contract: ''; }

export interface SUI_CollectionOwnedItem {
    id: string;
    cover: string;
    collectionName: string;
    ownedAssets: number;
    floorPrice: number;
    highestRankNft: number;
    openApproval: boolean;
    volume: number;
}

export interface SUI_SubnameItem {
    id: string;
    subnameLabel: string;
    fullName: string;
    ownerAddress: string;
    manager: string;
    parent: string;
    expiry: string;
    isPrimary: boolean;
}

export interface SUI_SubnameRecordTextItem {
    id: string;
    title: string;
    iconURL: string;
    text: string;
}

export interface SUI_SubnameRecordAddressItem extends Pick<SUI_CurrencyChainItem, "iconUrl" | "symbol" | "name" | "uuid"> {
    address: string;
}

// Subname minting types start here
export interface SUI_MintNewOffchainSubnameRequestParams {
    label: string;
    domain: string;
    address: string;
}


export interface SUI_CheckSubnameAvailabilityParams {
    network: string;
    subnameLabel: string;
    minterAddress?: string;
    parentLabel?: string;
    owner?: string;
    currentPage?: number;
    pageSize?: number;
}

export interface SUI_UploadProfilePicturePayload {
    file: File;
    pictureType: SUT_BlobStorageImageType;
    walletId: string;
}

export interface SUI_DeleteProfilePicturePayload extends Pick<SUI_UploadProfilePicturePayload, 'pictureType' | 'walletId'> { }

export interface SUI_CreateNewUserPayload {
    points: SUT_PointSystemType,
    tags: SUT_ProfileTagsVariantType[];
    title: string,
    description: string;
}

export interface SUI_UpdateProfilePointsPayload {
    walletId: string;
    counterPartyWalletId?: string;
    pointsToAdd: SUT_AvailablePointSystemPointsType;
    keyType: SUT_AvailablePointSystemKeysType;
    defaultPointSystem: SUT_PointSystemType;
}

export interface SUI_UpdateProfileDetailsPayload {
    walletId: string;
    title: string;
    description: string;
    social_links: {
        warpcast: string,
        twitter: string;
    };
}

export interface SUI_TransferSubscriptionTokensToTreasuryPayload {
    userWalletAddress: string;
    tokenAddress: string;
    amountToTransfer: number | string;
}

export interface SUI_TransferSubscriptionTokensToUserPayload extends Pick<SUI_TransferSubscriptionTokensToTreasuryPayload, 'amountToTransfer' | 'tokenAddress'> {
    transferToAddress: string;
}