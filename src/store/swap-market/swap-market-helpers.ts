import { SUI_Swap, SUI_OpenSwap, SUI_SwapPreferences, SUT_SwapOfferType, SUI_SwapToken } from "@/types/swap-market.types";
import { IAddedAmount, IOpenCreatedSwapFilters, IOpenMarketSwapFilters, IOpenRoom, IPrivateMarketSwapFilters, IPrivateRoom, ISwapMarketStore, SUT_GridViewType } from "../../types/swap-market-store.types";
import { SUI_RarityRankItem, SUI_NFTItem, SUI_SelectedCollectionItem } from "@/types/global.types";
import { SUE_CHAIN_ID, SUE_SWAP_MODE, SUE_SWAP_OFFER_TYPE } from "@/constants/enums";
import { Environment } from "@/config";
import { getInitialProfile } from "../profile/profile-helpers";
import { IProfile, IWallet } from "@/types/profile.types";
import { checkIsDateInRange, compareRarityRankItems, getNormalizeAndCompareTwoStrings } from "@/lib/utils";
import { getWalletProxy } from "@/lib/walletProxy";
import { currentChain } from "@/lib/thirdWebClient";

interface IEnsResponseItem {
  receiverEns: string | null;
  receiverAvatar: string | null;
  senderEns: string | null;
  senderAvatar: string | null;
}

// Shared Room Helper start
export const toggleGridViewHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',
  value: SUT_GridViewType
): ISwapMarketStore => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;
  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          activeGridView: value,
        },
      },
    },
  };
};

export const setSelectedNftsForSwapHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',
  selectedNfts: SUI_NFTItem[] | []
): ISwapMarketStore => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;

  const uniqueSelectedNftsObjects: SUI_NFTItem[] | [] = [...new Set(selectedNfts)];
  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          nftsSelectedForSwap: uniqueSelectedNftsObjects,
        },
      },
    },
  };
};

export const setFilteredNftsBySearchHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',
  searchValue: string
): ISwapMarketStore => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;
  const lowerCaseSearchValue = searchValue.toLowerCase();

  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          filteredNfts: searchValue
            ? room[side].nfts?.filter((nft: SUI_NFTItem) =>
              nft.tokenId.toLowerCase().includes(lowerCaseSearchValue) ||
              nft.title.toLowerCase().includes(lowerCaseSearchValue)
            )
            : room[side].nfts,
        },
      },
    },
  };
};

export const setFilteredNftsByFiltersHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',
  collectionTitle: string,
  selectedRarityRank: SUI_RarityRankItem
): ISwapMarketStore => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;
  const lowerCaseCollectionTitle = collectionTitle.toLowerCase();

  let filteredNfts: SUI_NFTItem[] | undefined = [];

  if (collectionTitle && selectedRarityRank) {
    filteredNfts = room[side].nfts?.filter((nft: SUI_NFTItem) =>
      nft.contract.name.toLowerCase().includes(lowerCaseCollectionTitle) &&
      (nft.rarityRank && (nft.rarityRank >= selectedRarityRank.from && nft.rarityRank <= selectedRarityRank.to))
    );
  }

  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          filteredNfts: (filteredNfts && filteredNfts.length > 0) ? filteredNfts : [],
          filters: {
            collection: collectionTitle,
            rarityRank: {
              from: selectedRarityRank.from,
              to: selectedRarityRank.to
            }
          }
        },
      },
    },
  };
};

export const removeAllFiltersHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',
): ISwapMarketStore => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;
  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          filteredNfts: room[side].nfts,
          filters: undefined,
        },
      },
    },
  };
};

export const setAddedAmountHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',
  selectedAmount: string,
  selectedCoin: string
): ISwapMarketStore => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;

  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          addedAmount: {
            amount: selectedAmount ? parseFloat(selectedAmount) : undefined,
            coin: JSON.parse(selectedCoin)
          },
        },
      },
    },
  };
};

export const setNftsDatasetHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',
  dataset: SUI_NFTItem[] | []
): ISwapMarketStore => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;

  const collections: string[] | [] = [...new Set(dataset.map(item => item.contract.name))];


  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          filteredNfts: dataset.length > 0 ? dataset : [],
          nfts: dataset.length > 0 ? dataset : [],
          collections
        },
      },
    },
  };
};

export const setValuesOnViewSwapRoomHelper = async (
  state: ISwapMarketStore,
  tradeId: string,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  swap: SUI_OpenSwap | SUI_Swap
): Promise<ISwapMarketStore> => {

  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;

  // const { receiverAvatar, receiverEns, senderAvatar, senderEns } = await getBothSideEnsAndAvatarByWalletAddress(swap.init_address, swap.accept_address);


  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        uniqueTradeId: tradeId,
        swap,
        sender: {
          ...room.sender,
          addedAmount: undefined,
          profile: {
            ...room.sender.profile,
            // ensAddress: senderEns ? senderEns : '',
            ensAddress: '',
            // avatar: senderAvatar ? senderAvatar : room.sender.profile.avatar,
            avatar: room.sender.profile.avatar,
            wallet: {
              ...room.sender.profile.wallet,
              address: swap.init_address
            }
          }
        },
        receiver: {
          ...room.receiver,
          addedAmount: undefined,
          profile: {
            ...room.receiver.profile,
            // ensAddress: receiverEns ? receiverEns : '',
            ensAddress: '',
            // avatar: receiverAvatar ? receiverAvatar : room.receiver.profile.avatar,
            avatar: room.receiver.profile.avatar,
            wallet: {
              ...room.sender.profile.wallet,
              address: swap.accept_address
            }
          }
        }
      },
    },
  };
};

export const resetViewSwapRoomHelper = (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
): ISwapMarketStore => {

  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;

  const openRoomInitialSwap = {
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
  };

  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        sign: '',
        uniqueTradeId: '',
        swap: roomKey === 'openRoom' ? { ...openRoomInitialSwap } : undefined,
        swapEncodedMsg: '',
        sender: {
          ...room.sender,
          nfts: undefined,
          filteredNfts: undefined,
          filters: undefined,
          activeGridView: 'detailed',
          profile: getInitialProfile("sender")
        },
        receiver: {
          ...room.receiver,
          collections: [],
          nftsSelectedForSwap: [],
          addedAmount: undefined,
          nfts: undefined,
          filteredNfts: undefined,
          filters: undefined,
          activeGridView: 'detailed',
          profile: getInitialProfile("receiver"),
          network: {
            id: '1',
            image: '/assets/svgs/ethereum.svg',
            title: 'ethereum',
            shortTitle: "eth"
          }
        }
      },
    },
  };
};

export const createCounterSwapOfferHelper = async (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
): Promise<ISwapMarketStore> => {

  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;

  let initSwapTokens: SUI_SwapToken[] = [];
  let acceptSwapTokens: SUI_SwapToken[] = [];

  /*=== Init / Sender side:  Swap generation ===*/
  // If user has selected Currency for sender side
  if (room.sender.addedAmount?.amount && room.sender.addedAmount.coin) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getCurrencyChainSwapTokensFromSelectedChainItems(room.sender.addedAmount)
    ];
  }

  // If user has selected NFTs for sender side
  if (room.sender.nftsSelectedForSwap && room.sender.nftsSelectedForSwap.length > 0) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getNftSwapTokensFromNftItems(room.sender.nftsSelectedForSwap)
    ];
  }

  /*=== Accept / Receiver side:  Swap generation ===*/
  // If user has selected Currency for receiver side
  if (room.receiver.addedAmount?.amount && room.receiver.addedAmount.coin) {
    acceptSwapTokens = [
      ...acceptSwapTokens,
      ...getCurrencyChainSwapTokensFromSelectedChainItems(room.receiver.addedAmount)
    ];
  }

  // If user has selected NFTs for receiver side
  if (room.receiver.nftsSelectedForSwap && room.receiver.nftsSelectedForSwap.length > 0) {
    acceptSwapTokens = [
      ...acceptSwapTokens,
      ...getNftSwapTokensFromNftItems(room.receiver.nftsSelectedForSwap)
    ];
  }

  const swap: SUI_OpenSwap = {
    ...room.swap,
    offer_type: SUE_SWAP_OFFER_TYPE.COUNTER,
    metadata: {
      init: {
        tokens: initSwapTokens
      },
      accept: {
        tokens: acceptSwapTokens
      },
    }
  };


  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        swap,
      },
    },
  };
};

const getBothSideEnsAndAvatarByWalletAddress = async (senderAddress: string, receiverAddress: string) => {

  const ensResponse: IEnsResponseItem = {
    receiverEns: null,
    receiverAvatar: null,
    senderEns: null,
    senderAvatar: null,
  };

  if (senderAddress) {
    try {
      const { avatar, ensName } = await getWalletProxy().getEnsInformationByWalletAddress(senderAddress);
      ensResponse.senderAvatar = avatar;
      ensResponse.senderEns = ensName;
    } catch (error) {
      console.log("Unable to fetch sender ens");
    }
  }

  if (receiverAddress) {
    try {
      const { avatar, ensName } = await getWalletProxy().getEnsInformationByWalletAddress(receiverAddress);
      ensResponse.receiverAvatar = avatar;
      ensResponse.receiverEns = ensName;
    } catch (error) {
      console.log("unable to fetch receiver ens");
    }
  }

  return ensResponse;
};

// Shared Room Helper end


// Private Room helpers start
export const setValuesOnCreatingPrivateRoomHelper = async (
  state: ISwapMarketStore,
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  tradeId: string,
  counterPartyWalletAddress: string,
  senderProfile: IProfile
): Promise<ISwapMarketStore> => {
  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as IPrivateRoom;

  let receiverEns = null;
  let receiverAvatar = null;

  // try {
  //   if (counterPartyWalletAddress) {
  //     const { avatar, ensName } = await getWalletProxy().getEnsInformationByWalletAddress(counterPartyWalletAddress);
  //     receiverAvatar = avatar;
  //     receiverEns = ensName;
  //   }
  // } catch (error) {
  //   console.log("Unable to fetch ens");
  // }


  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        uniqueTradeId: tradeId ? tradeId : room.uniqueTradeId,
        sender: {
          ...room.sender,
          profile: senderProfile
        },
        receiver: {
          ...room.receiver,
          profile: {
            ...room.receiver.profile,
            ensAddress: receiverEns ? receiverEns : '',
            avatar: receiverAvatar ? receiverAvatar : room.receiver.profile.avatar,
            wallet: {
              ...room.receiver.profile.wallet,
              address: counterPartyWalletAddress ? counterPartyWalletAddress : room.receiver.profile.wallet.address,
            }
          },
        },
      },
    },
  };
};
export const createPrivateMarketSwapHelper = async (state: ISwapMarketStore, offer_type: SUT_SwapOfferType, initWalletAddress: string): Promise<ISwapMarketStore> => {
  const room = state.privateMarket.privateRoom as IPrivateRoom;

  let initSwapTokens: SUI_SwapToken[] = [];
  let acceptSwapTokens: SUI_SwapToken[] = [];

  /*=== Init / Sender side:  Swap generation ===*/

  // If user has selected Currency for sender side
  if (room.sender.addedAmount?.amount && room.sender.addedAmount.coin) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getCurrencyChainSwapTokensFromSelectedChainItems(room.sender.addedAmount)
    ];
  }

  // If user has selected NFTs for sender side
  if (room.sender.nftsSelectedForSwap && room.sender.nftsSelectedForSwap.length > 0) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getNftSwapTokensFromNftItems(room.sender.nftsSelectedForSwap)
    ];
  }

  /*=== Accept / Receiver side:  Swap generation ===*/

  // If user has selected Currency for receiver side
  if (room.receiver.addedAmount?.amount && room.receiver.addedAmount.coin) {
    acceptSwapTokens = [
      ...acceptSwapTokens,
      ...getCurrencyChainSwapTokensFromSelectedChainItems(room.receiver.addedAmount)
    ];
  }

  // If user has selected NFTs for receiver side
  if (room.receiver.nftsSelectedForSwap && room.receiver.nftsSelectedForSwap.length > 0) {
    acceptSwapTokens = [
      ...acceptSwapTokens,
      ...getNftSwapTokensFromNftItems(room.receiver.nftsSelectedForSwap)
    ];
  }

  const swap: SUI_Swap = {
    trade_id: state.privateMarket.privateRoom.uniqueTradeId,
    swap_mode: SUE_SWAP_MODE.PRIVATE,
    trading_chain: String(Environment.CHAIN_ID),
    init_address: initWalletAddress,
    accept_address: room.receiver.profile.wallet.address,
    accept_sign: '',
    init_sign: '',
    offer_type,
    metadata: {
      init: {
        tokens: initSwapTokens
      },
      accept: {
        tokens: acceptSwapTokens
      },
    }
  };

  return {
    ...state,
    privateMarket: {
      ...state.privateMarket,
      privateRoom: {
        ...room,
        swap,
      },
    },
  };
};

export const setSwapEncodedMsgAndSignPrivateHelper = async (
  state: ISwapMarketStore,
  swapEncodedMsg: string,
  sign: string,
): Promise<ISwapMarketStore> => {

  return {
    ...state,
    privateMarket: {
      ...state.privateMarket,
      privateRoom: {
        ...state.privateMarket.privateRoom,
        swapEncodedMsg: swapEncodedMsg,
        swap: state.privateMarket.privateRoom.swap && {
          ...state.privateMarket.privateRoom.swap,
          init_sign: sign
        }
      }
    }
  };
};

const getNftSwapTokensFromNftItems = (nfts: SUI_NFTItem[]): SUI_SwapToken[] => {

  return nfts.map(nft => ({
    id: nft.tokenId,
    address: nft.contract.address,
    type: nft.tokenType,
    image_url: nft.media[0].gateway
  }));

};

const getCurrencyChainSwapTokensFromSelectedChainItems = (addedAmount: IAddedAmount): SUI_SwapToken[] => {
  const includesValue = ((currentChain.id || Environment.CHAIN_ID) === SUE_CHAIN_ID.BASE) ? "base" : "ethereum";
  const replaceValue = `${includesValue}/`;
  const tokenAddress: string = addedAmount.coin.contractAddresses.find(address => address.includes(includesValue)).replace(replaceValue, "");

  console.log("token address: ", tokenAddress);

  const formattedObject: SUI_SwapToken = {
    id: tokenAddress,
    address: tokenAddress,
    type: "ERC20",
    image_url: addedAmount.coin.iconUrl,
    value: {
      amount: addedAmount.amount,
      usdAmount: Number(addedAmount.amount) * Number(addedAmount.coin.price),
      symbol: addedAmount.coin.symbol
    }
  };

  return ([formattedObject]);
};

export const resetPrivateRoomDataHelper = (
  state: ISwapMarketStore,
): ISwapMarketStore => {

  return {
    ...state,
    privateMarket: {
      ...state.privateMarket,
      privateRoom: {
        ...state.privateMarket.privateRoom,
        sign: '',
        uniqueTradeId: '',
        swap: undefined,
        swapEncodedMsg: '',
        sender: {
          ...state.privateMarket.privateRoom.sender,
          collections: [],
          nftsSelectedForSwap: [],
          addedAmount: undefined,
          nfts: undefined,
          filteredNfts: undefined,
          filters: undefined,
          activeGridView: 'detailed',
          profile: getInitialProfile('sender')
        },
        receiver: {
          ...state.privateMarket.privateRoom.receiver,
          collections: [],
          nftsSelectedForSwap: [],
          addedAmount: undefined,
          nfts: undefined,
          filteredNfts: undefined,
          filters: undefined,
          activeGridView: 'detailed',
          profile: getInitialProfile('receiver')
        }
      }
    },
  };
};


export const setPrivateSwapsDataHelper = async (
  state: ISwapMarketStore,
  swapsData: SUI_Swap[],
): Promise<ISwapMarketStore> => {

  let availablePrivateSwaps: SUI_Swap[] = [];

  availablePrivateSwaps = swapsData.filter(swap => swap.swap_mode === 1);
  return {
    ...state,
    privateMarket: {
      ...state.privateMarket,
      availablePrivateSwaps: availablePrivateSwaps,
      filteredAvailablePrivateSwaps: availablePrivateSwaps
    },
  };
};

export const setPrivateMarketAvailableSwapsBySearchHelper = (
  state: ISwapMarketStore,
  searchValue: string
): ISwapMarketStore => {
  let searchFilterApplied = false;
  const lowerCaseSearchValue = searchValue.toLowerCase();

  const filteredAvailablePrivateSwaps = state.privateMarket.availablePrivateSwaps?.filter(swap =>
    swap.init_address.includes(lowerCaseSearchValue) ||
    swap.trade_id.includes(lowerCaseSearchValue)
  );

  if (lowerCaseSearchValue.length > 0) {
    searchFilterApplied = true;
  } else {
    searchFilterApplied = false;
  }

  return {
    ...state,
    privateMarket: {
      ...state.privateMarket,
      filteredAvailablePrivateSwaps: filteredAvailablePrivateSwaps ? filteredAvailablePrivateSwaps : state.privateMarket.availablePrivateSwaps,
      availablePrivateSwapsSearchApplied: searchFilterApplied
    }
  };
};

export const setPrivateMarketAvailableSwapsByFiltersHelper = (
  state: ISwapMarketStore,
  filters: IPrivateMarketSwapFilters,
  loginWalletAddress: string
): ISwapMarketStore => {
  let filtersApplied = false;
  const filteredItems = getAvailableFilteredPrivateSwapsByFilter(state, filters, loginWalletAddress);

  if (
    filters.offersFromCurrentChain === true ||
    filters.swapRequestStatus !== "all" ||
    (filters.dateRangeFrom && filters.dateRangeTo)
  ) {
    filtersApplied = true;
  }

  return {
    ...state,
    privateMarket: {
      ...state.privateMarket,
      privateMarketSwapsFilters: filters,
      filteredAvailablePrivateSwaps: filteredItems,
      availablePrivateSwapsFiltersApplied: filtersApplied
    }
  };
};

const getAvailableFilteredPrivateSwapsByFilter = (state: ISwapMarketStore, filters: IPrivateMarketSwapFilters, loginWalletAddress: string) => {
  const filteredItems = state.privateMarket.availablePrivateSwaps?.reduce((filteredSwaps, swap) => {

    if (
      (!filters.offersFromCurrentChain || swap.trading_chain === String(Environment.CHAIN_ID)) &&
      (filters.swapRequestStatus === 'all' ||
        (filters.swapRequestStatus === 'sent' && swap.init_address.toLowerCase() === loginWalletAddress.toLowerCase()) ||
        (filters.swapRequestStatus === 'received' && swap.accept_address.toLowerCase() === loginWalletAddress.toLowerCase())
      ) &&
      ((!filters.dateRangeFrom || !filters.dateRangeTo) || (swap.created_at && checkIsDateInRange(swap.created_at, filters.dateRangeFrom, filters.dateRangeTo)))
    ) {
      filteredSwaps.push(swap);
    }
    return filteredSwaps;
  }, [] as SUI_Swap[]);
  return filteredItems;
};

export const resetAllPrivateMarketFiltersHelper = (state: ISwapMarketStore): ISwapMarketStore => {
  return {
    ...state,
    privateMarket: {
      ...state.privateMarket,
      availablePrivateSwapsFiltersApplied: false,
      filteredAvailablePrivateSwaps: state.privateMarket.availablePrivateSwaps,
      privateMarketSwapsFilters: {
        offersFromCurrentChain: false,
        swapRequestStatus: 'all'
      }
    }
  };
};
// Private Room helpers end



//=== Open Market Room helpers start====
export const setFilteredNftsBySwapTokensHelper = (
  state: ISwapMarketStore,
  dataset: SUI_NFTItem[] | [],
  marketKey: 'openMarket' | 'privateMarket',
  roomKey: 'openRoom' | 'privateRoom',
  side: 'sender' | 'receiver',

): ISwapMarketStore => {

  const market = state[marketKey] as Record<string, any>;
  const room = market[roomKey] as Record<string, any>;


  const collections: string[] | [] = [...new Set(dataset.map(item => item.contract.name))];
  const newNftsDataset = dataset.length ? dataset : [];

  // console.log("Inside setter: ", newNftsDataset);

  return {
    ...state,
    [marketKey]: {
      ...market,
      [roomKey]: {
        ...room,
        [side]: {
          ...room[side],
          filteredNfts: newNftsDataset,
          nfts: newNftsDataset,
          nftsSelectedForSwap: [...newNftsDataset],
          collections,
        }
      }
    }
  };
};
export const setOpenSwapsDataHelper = async (
  state: ISwapMarketStore,
  swapsData: SUI_OpenSwap[],
  wallet: IWallet
): Promise<ISwapMarketStore> => {

  let availableOpenSwaps: SUI_OpenSwap[] = [];
  let createdSwaps: SUI_OpenSwap[] = [];

  if (wallet.address && wallet.isConnected) {
    availableOpenSwaps = swapsData.filter(swap => swap.init_address !== wallet.address);
    createdSwaps = swapsData.filter(swap => swap.init_address === wallet.address);
  } else {
    availableOpenSwaps = swapsData;
  }

  const collectionNames: string[] = ([...new Set(availableOpenSwaps.map(swap => swap.swap_preferences.preferred_asset.parameters.collection))].filter(value => value !== undefined) as string[]);
  const collections: SUI_SelectedCollectionItem[] = collectionNames.map(name => ({ value: name, label: name }));

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      availableOpenSwapCollections: collections ? collections : [],
      availableOpenSwaps,
      createdSwaps,
      filteredAvailableOpenSwaps: availableOpenSwaps
    },
  };
};

export const setOpenCreatedSwapsDataHelper = async (
  state: ISwapMarketStore,
  swapsData: SUI_OpenSwap[],
  wallet: IWallet
): Promise<ISwapMarketStore> => {

  let createdSwaps: SUI_OpenSwap[] = [];

  if (wallet.address && wallet.isConnected) {
    createdSwaps = swapsData.filter(swap => swap.init_address === wallet.address);
  }

  const collectionNames: string[] = ([...new Set(createdSwaps.map(swap => swap.swap_preferences.preferred_asset.parameters.collection))].filter(value => value !== undefined) as string[]);
  const collections: SUI_SelectedCollectionItem[] = collectionNames.map(name => ({ value: name, label: name }));

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      createdSwaps,
      createdSwapCollections: collections ? collections : [],
      filteredCreatedSwaps: createdSwaps
    },
  };
};

export const setOpenCreatedSwapsBySearchHelper = (
  state: ISwapMarketStore,
  searchValue: string
): ISwapMarketStore => {

  let searchFilterApplied = false;
  const lowerCaseSearchValue = searchValue.toLowerCase();

  const filteredCreatedSwaps = state.openMarket.createdSwaps?.filter(swap =>
    swap.init_address.toLowerCase().includes(lowerCaseSearchValue) ||
    swap.open_trade_id.toLowerCase().includes(lowerCaseSearchValue) ||
    swap.swap_preferences.expiration_date.toLowerCase().includes(lowerCaseSearchValue) ||
    swap.swap_preferences.preferred_asset.type.toLowerCase().includes(lowerCaseSearchValue) ||
    swap.swap_preferences.preferred_asset.type === 'currency' && ("crypto-" + swap.swap_preferences.preferred_asset.type.toLowerCase()).includes(lowerCaseSearchValue) ||
    swap.swap_preferences.preferred_asset.parameters.collection?.toLocaleLowerCase().includes(lowerCaseSearchValue)
  );

  if (lowerCaseSearchValue.length > 0) {
    searchFilterApplied = true;
  } else {
    searchFilterApplied = false;
  }
  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      filteredCreatedSwaps: filteredCreatedSwaps ? filteredCreatedSwaps : state.openMarket.createdSwaps,
      createdSwapsSearchApplied: searchFilterApplied
    }
  };
};

export const setOpenMarketAvailableSwapsBySearchHelper = (
  state: ISwapMarketStore,
  searchValue: string
): ISwapMarketStore => {

  let searchFilterApplied = false;
  const lowerCaseSearchValue = searchValue.toLowerCase();

  const filteredAvailableOpenSwaps = state.openMarket.availableOpenSwaps?.filter(swap =>
    swap.init_address.toLowerCase().includes(lowerCaseSearchValue) ||
    swap.open_trade_id.toLowerCase().includes(lowerCaseSearchValue) ||
    swap.swap_preferences.expiration_date.toLowerCase().includes(lowerCaseSearchValue) ||
    swap.swap_preferences.preferred_asset.type.toLocaleLowerCase().includes(lowerCaseSearchValue) ||
    swap.swap_preferences.preferred_asset.type === 'currency' && ("crypto-" + swap.swap_preferences.preferred_asset.type.toLowerCase()).includes(lowerCaseSearchValue) ||
    swap.swap_preferences.preferred_asset.parameters.collection?.toLocaleLowerCase().includes(lowerCaseSearchValue)
  );

  if (lowerCaseSearchValue.length > 0) {
    searchFilterApplied = true;
  } else {
    searchFilterApplied = false;
  }

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      filteredAvailableOpenSwaps: filteredAvailableOpenSwaps ? filteredAvailableOpenSwaps : state.openMarket.availableOpenSwaps,
      availableOpenSwapsSearchApplied: searchFilterApplied

    }
  };
};

export const setOpenMarketAvailableSwapsByFiltersHelper = (
  state: ISwapMarketStore,
  filters: IOpenMarketSwapFilters
): ISwapMarketStore => {

  let filtersApplied = false;
  const filteredItems = getAvailableFilteredOpenSwapsByFilter(state, filters);

  if (
    filters.offersFromCurrentChain === true ||
    filters.offeredRarityRank ||
    (filters.collection && filters.rarityRank) ||
    (filters.amountRangeFrom && filters.amountRangeTo && filters.currencies)
  ) {
    filtersApplied = true;
  }

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openMarketSwapsFilters: filters,
      filteredAvailableOpenSwaps: filteredItems,
      availableOpenSwapsFiltersApplied: filtersApplied
    }
  };
};

export const setOpenCreatedSwapsByFiltersHelper = (
  state: ISwapMarketStore,
  filters: IOpenCreatedSwapFilters
): ISwapMarketStore => {
  let filtersApplied = false;
  const filteredItems = getFilteredOpenCreatedSwapsByFilter(state, filters);

  if (
    filters.offersFromCurrentChain === true ||
    filters.offeredRarityRank ||
    (filters.collection && filters.rarityRank) ||
    (filters.amountRangeFrom && filters.amountRangeTo && filters.currencies)
  ) {
    filtersApplied = true;
  }

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      createdSwapsFilters: filters,
      filteredCreatedSwaps: filteredItems,
      createdSwapsFiltersApplied: filtersApplied
    }
  };
};

const getFilteredOpenCreatedSwapsByFilter = (state: ISwapMarketStore, filters: IOpenCreatedSwapFilters) => {
  const filteredItems = state.openMarket.createdSwaps?.reduce((filteredSwaps, swap) => {

    const { parameters, type } = swap.swap_preferences.preferred_asset;
    const filteredErc20Tokens = swap.metadata.init.tokens.filter(token => token.type === "ERC20");

    if (
      (!filters.offersFromCurrentChain || swap.trading_chain === String(Environment.CHAIN_ID)) &&
      (!filters.offeredRarityRank || (parameters.rank && compareRarityRankItems(parameters.rank, filters.offeredRarityRank))) &&
      // (!filters.preferredAsset ||
      //   ((filters.preferredAsset === "any") && (type.toLowerCase() === filters.preferredAsset.toLowerCase()))
      // ) &&
      (
        (!filters.rarityRank && !filters.collection) ||
        ((parameters.rank && parameters.collection && filters.rarityRank && filters.collection) &&
          (compareRarityRankItems(parameters.rank, filters.rarityRank) && (getNormalizeAndCompareTwoStrings(parameters.collection, filters.collection)))
        )
      ) &&
      (
        (!filters.amountRangeFrom && !filters.amountRangeTo && !filters.currencies) ||
        (
          (filteredErc20Tokens.length && parameters.preferred_currency) &&
          (
            filteredErc20Tokens.some((token) => Number(token.value?.usdAmount) >= Number(filters.amountRangeFrom)) &&
            filteredErc20Tokens.some((token) => Number(token.value?.usdAmount) <= Number(filters.amountRangeTo))
          ) &&
          parameters.preferred_currency.filter(preferredCurrency => (filters.currencies || []).some(currency => (currency.uuid === preferredCurrency.uuid)))
        )
      )
    ) {
      filteredSwaps.push(swap);
    }
    return filteredSwaps;
  }, [] as SUI_OpenSwap[]);
  return filteredItems;
};

const getAvailableFilteredOpenSwapsByFilter = (state: ISwapMarketStore, filters: IOpenMarketSwapFilters) => {
  const filteredItems = state.openMarket.availableOpenSwaps?.reduce((filteredSwaps, swap) => {

    const { parameters, type } = swap.swap_preferences.preferred_asset;
    const filteredErc20Tokens = swap.metadata.init.tokens.filter(token => token.type === "ERC20");

    if (
      (!filters.offersFromCurrentChain || swap.trading_chain === String(Environment.CHAIN_ID)) &&
      (!filters.offeredRarityRank || (parameters.rank && compareRarityRankItems(parameters.rank, filters.offeredRarityRank))) &&
      // (!filters.preferredAsset ||
      //   ((filters.preferredAsset === "any") && (type.toLowerCase() === filters.preferredAsset.toLowerCase()))
      // ) &&
      (
        (!filters.rarityRank && !filters.collection) ||
        ((parameters.rank && parameters.collection && filters.rarityRank && filters.collection) &&
          (compareRarityRankItems(parameters.rank, filters.rarityRank) && (getNormalizeAndCompareTwoStrings(parameters.collection, filters.collection)))
        )
      ) &&
      (
        (!filters.amountRangeFrom && !filters.amountRangeTo && !filters.currencies) ||
        (
          (filteredErc20Tokens.length > 0 && parameters.preferred_currency) &&
          (
            filteredErc20Tokens.some((token) => Number(token.value?.usdAmount) >= Number(filters.amountRangeFrom)) &&
            filteredErc20Tokens.some((token) => Number(token.value?.usdAmount) <= Number(filters.amountRangeTo))
          ) &&
          parameters.preferred_currency.filter(preferredCurrency => (filters.currencies || []).some(currency => (currency.uuid === preferredCurrency.uuid)))
        )
      )
    ) {
      filteredSwaps.push(swap);
    }
    return filteredSwaps;
  }, [] as SUI_OpenSwap[]);
  return filteredItems;
};

export const resetAllOpenMarketFiltersHelper = (state: ISwapMarketStore): ISwapMarketStore => {
  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      filteredAvailableOpenSwaps: state.openMarket.availableOpenSwaps,
      availableOpenSwapsFiltersApplied: false,
      openMarketSwapsFilters: {
        offersFromCurrentChain: false,
        preferredAsset: {
          from: 1,
          to: 100
        }
      }
    }
  };
};

export const resetAllCreatedSwapsHelper = (state: ISwapMarketStore): ISwapMarketStore => {
  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      filteredCreatedSwaps: state.openMarket.createdSwaps,
      createdSwapsFiltersApplied: false,
      createdSwapsFilters: {
        offersFromCurrentChain: false,
        preferredAsset: {
          from: 1,
          to: 100
        }
      }
    }
  };
};

export const setValuesOnCreateOpenSwapRoomHelper = (
  state: ISwapMarketStore,
  tradeId: string,
  senderProfile: IProfile
): ISwapMarketStore => {
  const market = state['openMarket'] as Record<string, any>;
  const room = market['openRoom'] as IOpenRoom;

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...room,
        uniqueTradeId: tradeId ? tradeId : room.uniqueTradeId,
        sender: {
          ...room.sender,
          profile: senderProfile
        }
      },
    },
  };
};

export const setValuesOnProposeOpenSwapRoomHelper = async (
  state: ISwapMarketStore,
  tradeId: string,
  swap: SUI_OpenSwap,
  senderProfile: IProfile
): Promise<ISwapMarketStore> => {
  const room = state.openMarket.openRoom;

  let receiverEns = null;
  let receiverAvatar = null;

  // if (swap.init_address) {
  //   try {
  //     const { avatar, ensName } = await getWalletProxy().getEnsInformationByWalletAddress(swap.init_address);
  //     receiverAvatar = avatar;
  //     receiverEns = ensName;
  //   } catch (error) {
  //     console.log("Unable to fetch ens");
  //   }
  // }


  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...room,
        uniqueTradeId: tradeId,
        swap,
        sender: {
          ...room.sender,
          profile: senderProfile
        },
        receiver: {
          ...room.receiver,
          addedAmount: undefined,
          profile: {
            ...room.receiver.profile,
            avatar: receiverAvatar ? receiverAvatar : '',
            ensAddress: receiverEns ? receiverEns : '',
            wallet: {
              ...room.receiver.profile.wallet,
              address: swap.init_address,
            }
          }
        }
      },
    },
  };
};
export const setSwapPreferencesHelper = (
  state: ISwapMarketStore,
  preferences: SUI_SwapPreferences
): ISwapMarketStore => {

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...state.openMarket.openRoom,
        swap: {
          ...state.openMarket.openRoom.swap,
          swap_preferences: preferences
        }
      }
    }
  };
};

export const createOpenSwapHelper = async (
  state: ISwapMarketStore,
  initWalletAddress: string
): Promise<ISwapMarketStore> => {

  const room = state.openMarket.openRoom as IOpenRoom;
  let initSwapTokens: SUI_SwapToken[] = [];

  /*=== Init / Sender side:  Swap generation ===*/
  // If user has selected Currency for sender side

  if (room.sender.addedAmount?.amount && room.sender.addedAmount.coin) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getCurrencyChainSwapTokensFromSelectedChainItems(room.sender.addedAmount)
    ];
  }

  // If user has selected NFTs for sender side
  if (room.sender.nftsSelectedForSwap && room.sender.nftsSelectedForSwap.length > 0) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getNftSwapTokensFromNftItems(room.sender.nftsSelectedForSwap)
    ];
  }

  const swap: SUI_OpenSwap = {
    ...state.openMarket.openRoom.swap,
    open_trade_id: state.openMarket.openRoom.uniqueTradeId,
    init_address: initWalletAddress,
    swap_mode: SUE_SWAP_MODE.OPEN,
    trading_chain: String(Environment.CHAIN_ID),
    metadata: {
      init: {
        tokens: initSwapTokens
      },
      accept: {
        tokens: []
      },
    },
  };

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...room,
        swap,
      },
    },
  };
};

export const createProposeOpenSwapHelper = async (
  state: ISwapMarketStore,
  initWalletAddress: string
): Promise<ISwapMarketStore> => {

  const room = state.openMarket.openRoom as IOpenRoom;
  let initSwapTokens: SUI_SwapToken[] = [];

  /*=== Init / Sender side:  Swap generation ===*/
  // If user has selected Currency for sender side
  if (room.sender.addedAmount?.amount && room.sender.addedAmount.coin) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getCurrencyChainSwapTokensFromSelectedChainItems(room.sender.addedAmount)
    ];
  }

  // If user has selected NFTs for sender side
  if (room.sender.nftsSelectedForSwap && room.sender.nftsSelectedForSwap.length > 0) {
    initSwapTokens = [
      ...initSwapTokens,
      ...getNftSwapTokensFromNftItems(room.sender.nftsSelectedForSwap)
    ];
  }


  const swap: SUI_OpenSwap = {
    ...state.openMarket.openRoom.swap,
    id: state.openMarket.openRoom.swap.id,
    open_trade_id: state.openMarket.openRoom.swap.open_trade_id,
    trade_id: state.openMarket.openRoom.uniqueTradeId,
    init_address: initWalletAddress,
    accept_address: room.swap.init_address,
    swap_mode: SUE_SWAP_MODE.OPEN,
    trading_chain: String(Environment.CHAIN_ID),
    metadata: {
      init: {
        tokens: initSwapTokens
      },
      accept: {
        tokens: state.openMarket.openRoom.swap.metadata.init.tokens
      }
    },
  };

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...room,
        proposeSwap: swap,
      },
    },
  };
};

export const resetOpenSwapCreationRoomHelper = (
  state: ISwapMarketStore,
): ISwapMarketStore => {

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...state.openMarket.openRoom,
        sign: '',
        uniqueTradeId: '',
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
        swapEncodedMsg: '',
        sender: {
          ...state.openMarket.openRoom.sender,
          collections: [],
          nftsSelectedForSwap: [],
          addedAmount: undefined,
          nfts: undefined,
          filteredNfts: undefined,
          filters: undefined,
          activeGridView: 'detailed'
        },
      }
    },
  };
};

export const resetOpenSwapProposeRoomHelper = (
  state: ISwapMarketStore,
): ISwapMarketStore => {

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...state.openMarket.openRoom,
        sign: '',
        uniqueTradeId: '',
        proposeSwap: undefined,
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
        swapEncodedMsg: '',
        sender: {
          ...state.openMarket.openRoom.sender,
          collections: [],
          nftsSelectedForSwap: [],
          addedAmount: undefined,
          nfts: undefined,
          filteredNfts: undefined,
          filters: undefined,
          activeGridView: 'detailed'
        },
        receiver: {
          ...state.openMarket.openRoom.receiver,
          collections: [],
          nftsSelectedForSwap: [],
          addedAmount: undefined,
          nfts: undefined,
          filteredNfts: undefined,
          filters: undefined,
          activeGridView: 'detailed',
          profile: getInitialProfile('receiver')
        }
      }
    },
  };
};

export const setSwapEncodedMsgAndSignOpenHelper = async (
  state: ISwapMarketStore,
  swapEncodedMsg: string,
  sign: string,
): Promise<ISwapMarketStore> => {

  return {
    ...state,
    openMarket: {
      ...state.openMarket,
      openRoom: {
        ...state.openMarket.openRoom,
        swapEncodedMsg: swapEncodedMsg,
        proposeSwap: state.openMarket.openRoom.proposeSwap && {
          ...state.openMarket.openRoom.proposeSwap,
          init_sign: sign
        }
      }
    }
  };
};