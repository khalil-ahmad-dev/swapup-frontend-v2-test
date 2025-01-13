import { create } from 'zustand';
import { IPrivateRoom, IOpenRoom, ISwapMarketStore, SUT_GridViewType, IOpenMarketSwapFilters, IPrivateMarketSwapFilters, IOpenCreatedSwapFilters, } from '../../types/swap-market-store.types';
import { SUI_NFTItem, SUI_RarityRankItem } from '@/types/global.types';
import { Environment } from '@/config';

import {
  toggleGridViewHelper,
  setSelectedNftsForSwapHelper,
  setFilteredNftsBySearchHelper,
  setFilteredNftsByFiltersHelper,
  removeAllFiltersHelper,
  setAddedAmountHelper,
  setValuesOnCreatingPrivateRoomHelper,
  setNftsDatasetHelper,
  setValuesOnCreateOpenSwapRoomHelper,
  createOpenSwapHelper,
  createPrivateMarketSwapHelper,
  setSwapEncodedMsgAndSignPrivateHelper,
  resetPrivateRoomDataHelper,
  setSwapPreferencesHelper,
  resetOpenSwapCreationRoomHelper,
  setOpenSwapsDataHelper,
  setOpenMarketAvailableSwapsBySearchHelper,
  setValuesOnProposeOpenSwapRoomHelper,
  setPrivateSwapsDataHelper,
  setPrivateMarketAvailableSwapsBySearchHelper,
  setFilteredNftsBySwapTokensHelper,
  resetOpenSwapProposeRoomHelper,
  createProposeOpenSwapHelper,
  setSwapEncodedMsgAndSignOpenHelper,
  setValuesOnViewSwapRoomHelper,
  resetViewSwapRoomHelper,
  setOpenCreatedSwapsDataHelper,
  createCounterSwapOfferHelper,
  setOpenMarketAvailableSwapsByFiltersHelper,
  resetAllOpenMarketFiltersHelper,
  resetAllPrivateMarketFiltersHelper,
  setPrivateMarketAvailableSwapsByFiltersHelper,
  setOpenCreatedSwapsBySearchHelper,
  resetAllCreatedSwapsHelper,
  setOpenCreatedSwapsByFiltersHelper,
} from './swap-market-helpers';

import { SUI_OpenSwap, SUI_Swap, SUI_SwapPreferences, SUT_SwapOfferType } from '@/types/swap-market.types';
import { SUE_SWAP_MODE } from '@/constants/enums';
import { getInitialProfile } from '../profile/profile-helpers';
import { IProfile, IWallet } from '@/types/profile.types';


export const openMarketRoomInitialState: IOpenRoom = {
  chainId: Environment.CHAIN_ID,
  uniqueTradeId: '',
  sign: '',
  swapEncodedMsg: '',
  sender: {
    activeGridView: 'detailed',
    toggleGridView: () => { },
    profile: getInitialProfile("sender"),
    collections: [],
    nfts: [],
    filteredNfts: [],
    nftsSelectedForSwap: [],
    setSelectedNftsForSwap: () => { },
    setFilteredNftsBySearch: () => { },
    setFilteredNftsByFilters: () => { },
    removeAllFilters: () => { },
    setAddedAmount: () => { },
    setNftsDataset: () => { },
    setFilteredNftsBySwapTokens: () => { }
  },
  receiver: {
    activeGridView: 'detailed',
    toggleGridView: () => { },
    profile: getInitialProfile("receiver"),
    collections: [],
    nfts: [],
    filteredNfts: [],
    nftsSelectedForSwap: [],
    setSelectedNftsForSwap: () => { },
    setFilteredNftsBySearch: () => { },
    setFilteredNftsByFilters: () => { },
    removeAllFilters: () => { },
    setAddedAmount: () => { },
    setNftsDataset: () => { },
    setFilteredNftsBySwapTokens: () => { }
  },
  swap: {
    accept_address: '',
    init_address: '',
    accept_sign: '',
    init_sign: '',
    metadata: {
      accept: {
        tokens: []
      },
      init: {
        tokens: []
      }
    },
    swap_mode: SUE_SWAP_MODE.OPEN,
    trade_id: '',
    offer_type: 0,
    open_trade_id: '',
    trading_chain: '',
    swap_preferences: {
      expiration_date: '',
      preferred_asset: {
        type: 'any',
        parameters: {}
      }
    }
  },
  setValuesOnCreateOpenSwapRoom: () => { },
  setValuesOnProposeOpenSwapRoom: () => { },
  createOpenSwap: () => { },
  createProposeOpenSwap: () => { },
  setSwapEncodedMsgAndSign: () => { },
  setSwapPreferences: () => { },
  resetOpenSwapCreationRoom: () => { },
  resetOpenSwapProposeRoom: () => { },
  setValuesOnViewSwapRoom: () => { },
  resetViewSwapRoom: () => { },
  createCounterSwapOffer: () => { }
};

export const privateMarketRoomInitialState: IPrivateRoom = {
  chainId: Environment.CHAIN_ID,
  uniqueTradeId: '',
  sign: '',
  swapEncodedMsg: '',
  sender: {
    activeGridView: 'detailed',
    toggleGridView: () => { },

    profile: getInitialProfile("sender"),
    collections: [],
    nfts: [],
    filteredNfts: [],
    nftsSelectedForSwap: [],
    setSelectedNftsForSwap: () => { },
    setFilteredNftsBySearch: () => { },
    setFilteredNftsByFilters: () => { },
    removeAllFilters: () => { },
    setAddedAmount: () => { },
    setNftsDataset: () => { },
    setFilteredNftsBySwapTokens: () => { }
  },
  receiver: {
    activeGridView: 'detailed',
    toggleGridView: () => { },
    profile: getInitialProfile("receiver"),
    collections: [],
    nfts: [],
    filteredNfts: [],
    nftsSelectedForSwap: [],
    setSelectedNftsForSwap: () => { },
    setFilteredNftsBySearch: () => { },
    setFilteredNftsByFilters: () => { },
    removeAllFilters: () => { },
    setAddedAmount: () => { },
    setNftsDataset: () => { },
    setFilteredNftsBySwapTokens: () => { }
  },
  setValuesOnCreatingPrivateRoom: () => { },
  createPrivateMarketSwap: () => { },
  setSwapEncodedMsgAndSign: () => { },
  resetPrivateRoom: () => { },
  setValuesOnViewSwapRoom: () => { },
  resetViewSwapRoom: () => { },
  createCounterSwapOffer: () => { }
};

const initialState: ISwapMarketStore = {
  openMarket: {
    availableOpenSwapCollections: [],
    availableOpenSwapsSearchApplied: false,
    availableOpenSwapsFiltersApplied: false,
    createdSwapsFiltersApplied: false,
    createdSwapCollections: [],
    createdSwapsSearchApplied: false,
    openMarketSwapsFilters: {
      offersFromCurrentChain: false,
      preferredAsset: {
        from: 1,
        to: 100
      }
    },
    createdSwapsFilters: {
      offersFromCurrentChain: false,
      preferredAsset: {
        from: 1,
        to: 100
      }
    },
    openRoom: openMarketRoomInitialState,
    setOpenSwapsData: () => { },
    setOpenCreatedSwapsData: () => { },
    setOpenMarketAvailableSwapsBySearch: () => { },
    setOpenMarketAvailableSwapsByFilters: () => { },
    setOpenCreatedSwapsBySearch: () => { },
    setOpenCreatedSwapsByFilters: () => { },
    resetAllOpenMarketFilters: () => { },
    resetAllCreatedSwaps: () => { }
  },
  privateMarket: {
    availablePrivateSwapsFiltersApplied: false,
    availablePrivateSwapsSearchApplied: false,
    privateMarketSwapsFilters: {
      offersFromCurrentChain: false,
      swapRequestStatus: 'all'
    },
    privateRoom: privateMarketRoomInitialState,
    setPrivateSwapsData: () => { },
    setPrivateMarketAvailableSwapsBySearch: () => { },
    setPrivateMarketAvailableSwapsByFilters: () => { },
    resetAllPrivateMarketFilters: () => { }
  },
};

export const useSwapMarketStore = create<ISwapMarketStore>((set, get) => ({
  ...initialState,
  openMarket: {
    ...initialState.openMarket,
    openRoom: {
      ...openMarketRoomInitialState,
      sender: {
        ...openMarketRoomInitialState.sender,
        toggleGridView: (value: SUT_GridViewType) => set((state) => toggleGridViewHelper(state, 'openMarket', 'openRoom', 'sender', value)),
        setSelectedNftsForSwap: (selectedNfts: SUI_NFTItem[] | []) => set((state) => setSelectedNftsForSwapHelper(state, 'openMarket', 'openRoom', 'sender', selectedNfts)),
        setFilteredNftsBySearch: (searchValue: string) => set((state) => setFilteredNftsBySearchHelper(state, 'openMarket', 'openRoom', 'sender', searchValue)),
        setFilteredNftsByFilters: (collectionTitle: string, selectedRarityRank: SUI_RarityRankItem) => set((state) => setFilteredNftsByFiltersHelper(state, 'openMarket', 'openRoom', 'sender', collectionTitle, selectedRarityRank)),
        removeAllFilters: () => set((state) => removeAllFiltersHelper(state, 'openMarket', 'openRoom', 'sender')),
        setAddedAmount: (selectedAmount: string, selectedCoin: string) => set((state) => setAddedAmountHelper(state, 'openMarket', 'openRoom', 'sender', selectedAmount, selectedCoin)),
        setNftsDataset: (dataset: SUI_NFTItem[]) => set((state) => setNftsDatasetHelper(state, 'openMarket', 'openRoom', 'sender', dataset)),
        setFilteredNftsBySwapTokens: (dataset: SUI_NFTItem[]) => set((state) => setFilteredNftsBySwapTokensHelper(state, dataset, 'openMarket', 'openRoom', 'sender')),
      },
      receiver: {
        ...openMarketRoomInitialState.receiver,
        toggleGridView: (value: SUT_GridViewType) => set((state) => toggleGridViewHelper(state, 'openMarket', 'openRoom', 'receiver', value)),
        setSelectedNftsForSwap: (selectedNfts: SUI_NFTItem[] | []) => set((state) => setSelectedNftsForSwapHelper(state, 'openMarket', 'openRoom', 'receiver', selectedNfts)),
        setFilteredNftsBySearch: (searchValue: string) => set((state) => setFilteredNftsBySearchHelper(state, 'openMarket', 'openRoom', 'receiver', searchValue)),
        setFilteredNftsByFilters: (collectionTitle: string, selectedRarityRank: SUI_RarityRankItem) => set((state) => setFilteredNftsByFiltersHelper(state, 'openMarket', 'openRoom', 'receiver', collectionTitle, selectedRarityRank)),
        removeAllFilters: () => set((state) => removeAllFiltersHelper(state, 'openMarket', 'openRoom', 'receiver')),
        setAddedAmount: (selectedAmount: string, selectedCoin: string) => set((state) => setAddedAmountHelper(state, 'openMarket', 'openRoom', 'receiver', selectedAmount, selectedCoin)),
        setNftsDataset: (dataset: SUI_NFTItem[]) => set((state) => setNftsDatasetHelper(state, 'openMarket', 'openRoom', 'receiver', dataset)),
        setFilteredNftsBySwapTokens: (dataset: SUI_NFTItem[]) => set((state) => setFilteredNftsBySwapTokensHelper(state, dataset, 'openMarket', 'openRoom', 'receiver')),
      },
      resetOpenSwapCreationRoom: () => set(state => resetOpenSwapCreationRoomHelper(state)),
      resetOpenSwapProposeRoom: () => set(state => resetOpenSwapProposeRoomHelper(state)),
      resetViewSwapRoom: () => set(state => resetViewSwapRoomHelper(state, 'openMarket', 'openRoom')),
      setValuesOnCreateOpenSwapRoom: (tradeId: string, senderProfile: IProfile) => set((state) => setValuesOnCreateOpenSwapRoomHelper(state, tradeId, senderProfile)),
      setValuesOnProposeOpenSwapRoom: async (tradeId: string, swap: SUI_OpenSwap, senderProfile: IProfile) => {
        const state = get();
        const newState = await setValuesOnProposeOpenSwapRoomHelper(state, tradeId, swap, senderProfile);
        set(newState);
      },
      setValuesOnViewSwapRoom: async (tradeId: string, swap: SUI_OpenSwap) => {
        const state = get();
        const newState = await setValuesOnViewSwapRoomHelper(state, tradeId, 'openMarket', 'openRoom', swap);
        set(newState);
      },
      createOpenSwap: async (initWalletAddress: string) => {
        const state = get();
        const newState = await createOpenSwapHelper(state, initWalletAddress);
        set(newState);
      },
      createProposeOpenSwap: async (initWalletAddress: string) => {
        const state = get();
        const newState = await createProposeOpenSwapHelper(state, initWalletAddress);
        set(newState);
      },
      createCounterSwapOffer: async () => {
        const state = get();
        const newState = await createCounterSwapOfferHelper(state, 'openMarket', 'openRoom');
        set(newState);
      },
      setSwapEncodedMsgAndSign: async (swapEncodedMsg: string, sign: string) => {
        const state = get();
        const newState = await setSwapEncodedMsgAndSignOpenHelper(state, swapEncodedMsg, sign);
        set(newState);
      },
      setSwapPreferences: (preferences: SUI_SwapPreferences) => set((state) => setSwapPreferencesHelper(state, preferences))
    },
    setOpenSwapsData: async (swapsData: SUI_OpenSwap[], wallet: IWallet) => {
      const state = get();
      const newState = await setOpenSwapsDataHelper(state, swapsData, wallet);
      set(newState);
    },
    setOpenCreatedSwapsData: async (createdSwaps: SUI_OpenSwap[], wallet: IWallet) => {
      const state = get();
      const newState = await setOpenCreatedSwapsDataHelper(state, createdSwaps, wallet);
      set(newState);
    },
    setOpenMarketAvailableSwapsBySearch: (searchValue: string) => set(state => setOpenMarketAvailableSwapsBySearchHelper(state, searchValue)),
    setOpenMarketAvailableSwapsByFilters: (filters: IOpenMarketSwapFilters) => set(state => setOpenMarketAvailableSwapsByFiltersHelper(state, filters)),
    setOpenCreatedSwapsBySearch: (searchValue: string) => set(state => setOpenCreatedSwapsBySearchHelper(state, searchValue)),
    setOpenCreatedSwapsByFilters: (filters: IOpenCreatedSwapFilters) => set(state => setOpenCreatedSwapsByFiltersHelper(state, filters)),
    resetAllOpenMarketFilters: () => set(state => resetAllOpenMarketFiltersHelper(state)),
    resetAllCreatedSwaps: () => set(state => resetAllCreatedSwapsHelper(state)),
  },
  privateMarket: {
    ...initialState.privateMarket,
    privateRoom: {
      ...privateMarketRoomInitialState,
      sender: {
        ...privateMarketRoomInitialState.sender,
        toggleGridView: (value: SUT_GridViewType) => set((state) => toggleGridViewHelper(state, 'privateMarket', 'privateRoom', 'sender', value)),
        setSelectedNftsForSwap: (selectedNfts: SUI_NFTItem[] | []) => set((state) => setSelectedNftsForSwapHelper(state, 'privateMarket', 'privateRoom', 'sender', selectedNfts)),
        setFilteredNftsBySearch: (searchValue: string) => set((state) => setFilteredNftsBySearchHelper(state, 'privateMarket', 'privateRoom', 'sender', searchValue)),
        setFilteredNftsByFilters: (collectionTitle: string, selectedRarityRank: SUI_RarityRankItem) => set((state) => setFilteredNftsByFiltersHelper(state, 'privateMarket', 'privateRoom', 'sender', collectionTitle, selectedRarityRank)),
        removeAllFilters: () => set((state) => removeAllFiltersHelper(state, 'privateMarket', 'privateRoom', 'sender')),
        setAddedAmount: (selectedAmount: string, selectedCoin: string) => set((state) => setAddedAmountHelper(state, 'privateMarket', 'privateRoom', 'sender', selectedAmount, selectedCoin)),
        setNftsDataset: (dataset: SUI_NFTItem[]) => set((state) => setNftsDatasetHelper(state, 'privateMarket', 'privateRoom', 'sender', dataset)),
        setFilteredNftsBySwapTokens: (dataset: SUI_NFTItem[]) => set((state) => setFilteredNftsBySwapTokensHelper(state, dataset, 'privateMarket', 'privateRoom', 'sender')),
      },
      receiver: {
        ...privateMarketRoomInitialState.receiver,
        toggleGridView: (value: SUT_GridViewType) => set((state) => toggleGridViewHelper(state, 'privateMarket', 'privateRoom', 'receiver', value)),
        setSelectedNftsForSwap: (selectedNfts: SUI_NFTItem[] | []) => set((state) => setSelectedNftsForSwapHelper(state, 'privateMarket', 'privateRoom', 'receiver', selectedNfts)),
        setFilteredNftsBySearch: (searchValue: string) => set((state) => setFilteredNftsBySearchHelper(state, 'privateMarket', 'privateRoom', 'receiver', searchValue)),
        setFilteredNftsByFilters: (collectionTitle: string, selectedRarityRank: SUI_RarityRankItem) => set((state) => setFilteredNftsByFiltersHelper(state, 'privateMarket', 'privateRoom', 'receiver', collectionTitle, selectedRarityRank)),
        removeAllFilters: () => set((state) => removeAllFiltersHelper(state, 'privateMarket', 'privateRoom', 'receiver')),
        setAddedAmount: (selectedAmount: string, selectedCoin: string) => set((state) => setAddedAmountHelper(state, 'privateMarket', 'privateRoom', 'receiver', selectedAmount, selectedCoin)),
        setNftsDataset: (dataset: SUI_NFTItem[]) => set((state) => setNftsDatasetHelper(state, 'privateMarket', 'privateRoom', 'receiver', dataset)),
        setFilteredNftsBySwapTokens: (dataset: SUI_NFTItem[]) => set((state) => setFilteredNftsBySwapTokensHelper(state, dataset, 'privateMarket', 'privateRoom', 'receiver')),
      },
      resetViewSwapRoom: () => set(state => resetViewSwapRoomHelper(state, 'privateMarket', 'privateRoom')),
      setValuesOnCreatingPrivateRoom: async (tradeId: string, counterPartyWalletAddress: string, senderProfile: IProfile) => {
        const state = get();
        const newState = await setValuesOnCreatingPrivateRoomHelper(state, 'privateMarket', 'privateRoom', tradeId, counterPartyWalletAddress, senderProfile);
        set(newState);
      },
      setValuesOnViewSwapRoom: async (tradeId: string, swap: SUI_Swap) => {
        const state = get();
        const newState = await setValuesOnViewSwapRoomHelper(state, tradeId, 'privateMarket', 'privateRoom', swap);
        set(newState);
      },
      createPrivateMarketSwap: async (offer_type: SUT_SwapOfferType, initWalletAddress: string) => {
        const state = get();
        const newState = await createPrivateMarketSwapHelper(state, offer_type, initWalletAddress);
        set(newState);
      },
      createCounterSwapOffer: async () => {
        const state = get();
        const newState = await createCounterSwapOfferHelper(state, 'privateMarket', 'privateRoom');
        set(newState);
      },
      setSwapEncodedMsgAndSign: async (swapEncodedMsg: string, sign: string) => {
        const state = get();
        const newState = await setSwapEncodedMsgAndSignPrivateHelper(state, swapEncodedMsg, sign);
        set(newState);
      },
      resetPrivateRoom: () => set((state) => resetPrivateRoomDataHelper(state)),

    },
    setPrivateSwapsData: async (data: SUI_Swap[]) => {
      const state = get();
      const newState = await setPrivateSwapsDataHelper(state, data);
      set(newState);
    },
    setPrivateMarketAvailableSwapsBySearch: (searchValue: string) => set(state => setPrivateMarketAvailableSwapsBySearchHelper(state, searchValue)),
    setPrivateMarketAvailableSwapsByFilters: (filters: IPrivateMarketSwapFilters, loginWalletAddress: string) => set(state => setPrivateMarketAvailableSwapsByFiltersHelper(state, filters, loginWalletAddress)),
    resetAllPrivateMarketFilters: () => set(state => resetAllPrivateMarketFiltersHelper(state)),
  },

}));
