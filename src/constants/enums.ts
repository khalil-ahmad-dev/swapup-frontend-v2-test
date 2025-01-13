export enum SUE_SWAP_MODE {
  OPEN = 0,
  PRIVATE = 1,
}

export enum SUE_SWAP_OFFER_TYPE {
  PRIMARY = 0,
  COUNTER = 1
}

export enum SUE_SWAP_COMPLETE_ACTION {
  REJECT = 0,
  COMPLETE = 1
}

export enum SUE_SWAP_MODE_TO_STRING {
  value0 = 'open',
  value1 = 'private',
}

export enum SUE_SWAP_OFFER_TYPE_TO_STRING {
  value0 = 'primary',
  value1 = 'counter',
}

export enum SUE_SWAP_STATUS {
  PENDING = 1,
  COMPLETED = 2,
  DECLINED = 3,
  CANCELED = 4,
}

export enum SUE_SWAP_STATUS_TO_STRING {
  value1 = 'pending',
  value2 = 'completed',
  value3 = 'declined',
  value4 = 'canceled',
}

export enum SUE_SWAP_REQUEST_TO_STRING {
  true = 'sent',
  false = 'received'
}

export enum SUE_PURCHASE_TYPE {
  CRYPTO = 1,
  SUBNAME = 2,
  SUBSCRIPTION = 3
}

export enum SUE_PURCHASE_TYPE_TO_STRING {
  value1 = 'crypto',
  value2 = 'subname',
  value3 = 'subscription',
}

export enum SUE_SWAP_ASSET_TYPE {
  ERC20 = 0,
  ERC721 = 1,
  ERC1155 = 2
}

export enum SUE_CHAIN_ID {
  MAINNET = 1,
  SEPOLIA = 11155111,
  BASE = 8453,
  BASE_SEPOLIA = 84532
}


export enum SUE_PaymentMode {
  SUBSCRIPTION_TOKENS = 1,
  CRYPTO_OR_CARD = 2
};