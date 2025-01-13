import { z } from "zod";
import moment from "moment";
import { isValidURL } from "@/lib/utils";
import { SUI_SubnameRecordAddressItem, SUI_SubnameRecordTextItem } from "@/types/profile.types";
import { defaults } from "@/constants/defaults";


/*====================================*/
/*=== Swap market page schema's ===*/
/*====================================*/

/*=== swap room - footer added amount schema starts ===*/
export const Schema_AmountConversionForm = z.object({
  amount: z.string().optional(),
  chain: z.string().min(1, {
    message: "Chain is required.",
  }),
}).superRefine((data, ctx) => {

  if (data.amount) {
    // if (!isNaN(Number(data.amount))) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     path: ["amount"],
    //     message: "Amount must be a number.",
    //   });
    // }

    if (Number(data.amount) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Amount must be greater than 0!",
      });
    }
  }
});
/*=== swap room - footer added amount schema starts ===*/

/*=== create open swap - parameters schema starts ===*/
export const Schema_OpenSwapParametersForm = z.object({
  expirationDate: z
    .date({
      required_error: "Expiration date is required!",
    })
    .refine(
      (date) =>
        !date || moment(date).isSameOrAfter(moment(), "day"),
      {
        message: "Expiration date cannot be in the past.",
      }
    ),
  preferredAsset: z.enum(["any", "nft", "currency"], {
    required_error: "Please select a preferred asset.",
  }),
  collection: z.string().optional(),
  rarityRank: z.string().optional(),
  usdAmountToReceive: z.string().optional(),
  currencies: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
        iconUrl: z.string(),
        amount: z.string(),
        usdAmount: z.string(),
        symbol: z.string(),
      })
    )
    .optional(),
}).superRefine((data, ctx) => {
  if (data.preferredAsset === "nft") {
    if (!data.collection) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["collection"],
        message: "Please select a preferred collection.",
      });
    }

    if (!data.rarityRank) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rarityRank"],
        message: "Please select a preferred rarity rank.",
      });
    }
  } else if (data.preferredAsset === "currency") {

    if (!data.currencies) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currencies"],
        message: "Please select currencies you want to receive.",
      });
    }

    if (data.usdAmountToReceive && Number(data.usdAmountToReceive) < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["usdAmountToReceive"],
        message:
          "USD amount cannot be negative.",
      });
    }

    if (data.currencies && data.currencies.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currencies"],
        message:
          "Please select at least one currency you want to receive.",
      });
    }

    if (data.currencies && data.currencies.length > defaults.swapParams.maxSelectCurrencies) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currencies"],
        message:
          "You can select upto three currencies you want to receive.",
      });
    }
  }
});

/*=== create open swap - parameters schema ends ===*/

/*=== Swap market - open market filters schema starts ===*/
export const Schema_OpenMarketFiltersForm = z.object({
  offersFromCurrentChain: z.boolean({
    required_error: "Please enable show offers from current chain!",
  }).optional(),
  offeredRarityRank: z.string().optional(),
  preferredAsset: z.enum(["any", "nft", "currency"], {
    required_error: "Please select a preferred asset.",
  }),
  collection: z.string().optional(),
  rarityRank: z.string().optional(),
  amountRangeFrom: z.string().optional(),
  amountRangeTo: z.string().optional(),
  currencies: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
        iconUrl: z.string(),
        amount: z.string(),
        usdAmount: z.string(),
        symbol: z.string()
      })
    )
    .optional(),
}).superRefine((data, ctx) => {
  if (data.preferredAsset === "nft") {
    if (!data.collection) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["collection"],
        message: "Please select a preferred collection you want to filter.",
      });
    }

    if (!data.rarityRank) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rarityRank"],
        message: "Please select a preferred rarity rank you want to filter.",
      });
    }
  } else if (data.preferredAsset === "currency") {

    if (!data.amountRangeFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountRangeFrom"],
        message: "Amount range from.",
      });
    }

    if (!data.amountRangeTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountRangeTo"],
        message: "Amount range to.",
      });
    }

    if (!data.currencies) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currencies"],
        message: "Please select currencies you want to filter.",
      });
    }

    if (data.currencies && data.currencies.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currencies"],
        message:
          "Please select at least one currency you want to filter.",
      });
    }

    if (data.currencies && data.currencies.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currencies"],
        message:
          "You can select upto three currencies you want to filter.",
      });
    }
  }
});
/*=== Swap market - open market filters schema ends ===*/


/*=== Swap market - private market filters schema starts ===*/
export const Schema_PrivateMarketFiltersForm = z.object({
  offersFromCurrentChain: z.boolean({
    required_error: "Please enable show offers from current chain!",
  }).optional(),
  swapRequestStatus: z.enum(["all", "sent", "received"], {
    required_error: "Please select a swap offer status.",
  }),
  dateRangeFrom: z.date().optional(),
  dateRangeTo: z.date().optional(),
}).superRefine((data, ctx) => {

  if (data.dateRangeFrom && !data.dateRangeTo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["dateRangeTo"],
      message: "Select a ending date.",
    });
  }

  if (!data.dateRangeFrom && data.dateRangeTo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["dateRangeFrom"],
      message: "Select starting date.",
    });
  }

});
/*=== Swap market - private market filters schema ends ===*/

/*=== Swap market - Buy Crypto schema starts ===*/
export const Schema_OpenMarketBuyCrypto = z.object({
  currenciesToBuy: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
        iconUrl: z.string(),
        amount: z.string(),
        usdAmount: z.string(),
        symbol: z.string()
      })
    ),
  currenciesToOffer: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
        iconUrl: z.string(),
        amount: z.string(),
        usdAmount: z.string(),
        symbol: z.string()
      })
    ),
}).superRefine((data, ctx) => {
  if (!data.currenciesToBuy || data.currenciesToBuy.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToBuy"],
      message: "Please select currencies you want to buy.",
    });
  }

  if (data.currenciesToBuy && data.currenciesToBuy.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToBuy"],
      message:
        "You can select upto three currencies you want to buy.",
    });
  }

  if (!data.currenciesToOffer || data.currenciesToOffer.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToOffer"],
      message: "Please select currencies you want to offer.",
    });
  }

  if (data.currenciesToOffer && data.currenciesToOffer.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToOffer"],
      message:
        "You can select upto three currencies you want to offer.",
    });
  }
});
/*=== Swap market - Buy Crypto schema starts ===*/

/*=== Swap market - Sell Crypto schema starts ===*/
export const Schema_OpenMarketSellCrypto = z.object({
  currenciesToSell: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
        iconUrl: z.string(),
        amount: z.string(),
        usdAmount: z.string(),
        symbol: z.string()
      })
    ),
  currenciesToReceive: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
        iconUrl: z.string(),
        amount: z.string(),
        usdAmount: z.string(),
        symbol: z.string()
      })
    ),
}).superRefine((data, ctx) => {
  if (!data.currenciesToSell || data.currenciesToSell.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToSell"],
      message: "Please select currencies you want to sell.",
    });
  }

  if (data.currenciesToSell && data.currenciesToSell.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToSell"],
      message:
        "You can select upto three currencies you want to sell.",
    });
  }

  if (!data.currenciesToReceive || data.currenciesToReceive.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToReceive"],
      message: "Please select currencies you want to receive.",
    });
  }

  if (data.currenciesToReceive && data.currenciesToReceive.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["currenciesToReceive"],
      message:
        "You can select upto three currencies you want to receive.",
    });
  }
});
/*=== Swap market - Sell Crypto schema starts ===*/


/*====================================*/
/*=== My Swap page schema's ===*/
/*====================================*/


/*=== My swaps filters schema starts ===*/
export const Schema_PendingMySwapsFiltersForm = z.object({
  offersFromCurrentChain: z.boolean({
    required_error: "Please enable show offers from current chain!",
  }).optional(),
  requestedDate: z.date({
    required_error: "requested date is required!",
  }).optional(),
  swapRequestStatus: z.enum(["all", "sent", "received"], {
    required_error: "Please select a swap offer status.",
  }),
  swapMode: z.enum(["all", "open-market", "private-party"], {
    required_error: "Please select a swap mode.",
  }),
}).superRefine((data, ctx) => {
  if (data.offersFromCurrentChain === false && data.requestedDate === undefined && data.swapMode === 'all' && data.swapRequestStatus === "all") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["requestedDate"],
      message: "Please select at least one filter item to apply filters.",
    });
  }
});

export const Schema_HistoryMySwapsFiltersForm = z.object({
  offersFromCurrentChain: z.boolean({
    required_error: "Please enable show offers from current chain!",
  }).optional(),
  requestedDate: z.date({
    required_error: "requested date is required!",
  }).optional(),
  swapStatus: z.enum(["all", "completed", "declined", "canceled"], {
    required_error: "Please select a swap status.",
  }),
  swapMode: z.enum(["all", "open-market", "private-party"], {
    required_error: "Please select a swap mode.",
  }),
}).superRefine((data, ctx) => {
  if (data.offersFromCurrentChain === false && data.requestedDate === undefined && data.swapMode === 'all' && data.swapStatus === "all") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["requestedDate"],
      message: "Please select at least one filter item to apply filters.",
    });
  }
});
/*=== My swaps filters schema ends ===*/


/*====================================*/
/*=== User Profile schema's ===*/
/*====================================*/

export const Schema_ProfileInfoForm = z.object({
  title: z.string(),
  description: z.string().optional(),
  twitterLink: z.string().optional(),
  warpcastLink: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.title) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["title"],
      message: "Title cannot be empty.",
    });
  }

  if (data.title && (data.title.length < 5 || data.title.length > 20)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["title"],
      message: "Title must be between 5 to 20 characters.",
    });
  }

  if (data.description && (data.description.length < 50)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["description"],
      message: "Description must be at least 50 character.",
    });
  }

  if (data.twitterLink && !isValidURL(data.twitterLink)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["twitterLink"],
      message: "Twitter link must be a valid url.",
    });
  }

  if (data.warpcastLink && !isValidURL(data.warpcastLink)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["warpcastLink"],
      message: "Warpcast link must be a valid url.",
    });
  }

});


export const Schema_ProfileAssetFiltersForm = z.object({
  collection: z.string().optional(),
  rarityRank: z.string().optional()
}).superRefine((data, ctx) => {
  if (!data.collection && !data.rarityRank) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["collection"],
      message: "Please select at least one filter item to apply filters.",
    });
  }
});

/*=== Profile edit avatar form schema ===*/
export const Schema_ProfileEditAvatarForm = z.object({
  profileImage: z
    .instanceof(File).optional(),
}).superRefine((data, ctx) => {
  if (data.profileImage && data.profileImage.type && data.profileImage.size) {
    const allowedExtensions = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB in bytes

    if (!allowedExtensions.includes(data.profileImage.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["profileImage"],
        message: "Only .jpeg, jpg, .png, or .gif allowed",
      });
    }

    if (data.profileImage.size > maxSizeInBytes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["profileImage"],
        message: "File size must be less than 5 MB",
      });
    }
  }
});

/*=== Profile edit cover image form schema ===*/
export const Schema_ProfileEditCoverImageForm = z.object({
  coverImage: z
    .instanceof(File).optional(),
}).superRefine((data, ctx) => {
  if (data.coverImage && data.coverImage.type && data.coverImage.size) {
    const allowedExtensions = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB in bytes

    if (!allowedExtensions.includes(data.coverImage.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["coverImage"],
        message: "Only .jpeg, jpg, .png, or .gif allowed",
      });
    }

    if (data.coverImage.size > maxSizeInBytes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["coverImage"],
        message: "File size must be less than 5 MB",
      });
    }

  }
});

export const Schema_EditSubdomainRecordsForm = z.object({
  recordTab: z.enum(["text", "address", "other"], {
    required_error: "Please select a record tab.",
  }),
  text: z.string().optional(),
  addresses: z
    .array(
      z.string().min(1, { message: "Address is required." })
    )
    .optional(),
  contentHash: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.recordTab === "text") {
    if (!data.text) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["text"],
        message: "Please enter text",
      });
    }

    if (data.text && !isValidURL(data.text)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["text"],
        message: "Text must be a valid URL.",
      });
    }
  } else if (data.recordTab === "address") {
    if (!data.addresses || data.addresses.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["addresses"],
        message: "At least one address is required.",
      });
    } else {
      // Check for unique addresses
      const uniqueAddresses = new Set(data.addresses);
      if (uniqueAddresses.size !== data.addresses.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["addresses"],
          message: "All addresses must be unique.",
        });
      }
    }
  } else if (data.recordTab === "other") {
    const ipfsRegex = /^ipfs:\/\/[a-zA-Z0-9]{30}(\/.*)?$/;

    if (!data.contentHash) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contentHash"],
        message: "Content hash is required.",
      });
    }

    if (data.contentHash && !ipfsRegex.test(data.contentHash)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contentHash"],
        message: "Content is not a valid IPFS path.",
      });
    }
  }
});