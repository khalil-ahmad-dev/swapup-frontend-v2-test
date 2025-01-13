export const abi = {
    nft: `[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "_approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
    ]`,
    swapUp: `[
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "signerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "initiatorAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "initiatorAssets",
                    "type": "tuple[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "responderAssets",
                    "type": "tuple[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "signerStartingMessage",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "cancelType",
                    "type": "string"
                }
            ],
            "name": "cancelSwap",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "initialOwner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_treasuryWalletAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_platformFeeAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_currencyFeeAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_currencyFeeAmountWithSubdomen",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "_priceFeedAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "ECDSAInvalidSignature",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "length",
                    "type": "uint256"
                }
            ],
            "name": "ECDSAInvalidSignatureLength",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "s",
                    "type": "bytes32"
                }
            ],
            "name": "ECDSAInvalidSignatureS",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "InvalidShortString",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "OwnableInvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "str",
                    "type": "string"
                }
            ],
            "name": "StringTooLong",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "length",
                    "type": "uint256"
                }
            ],
            "name": "StringsInsufficientHexLength",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "addressType",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "newAddress",
                    "type": "address"
                }
            ],
            "name": "AddressUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "commissionType",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "CommissionUpdated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "signerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "initiatorAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "initiatorAssets",
                    "type": "tuple[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "responderAssets",
                    "type": "tuple[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "signerStartingMessage",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "tradeId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapStatus",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapType",
                    "type": "string"
                }
            ],
            "name": "completeSwap",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "signerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "initiatorAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "initiatorAssets",
                    "type": "tuple[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "responderAssets",
                    "type": "tuple[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "signerStartingMessage",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "tradeId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapType",
                    "type": "string"
                }
            ],
            "name": "counterSwap",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "signerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "initiatorAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "initiatorAssets",
                    "type": "tuple[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "responderAssets",
                    "type": "tuple[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "signerStartingMessage",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapType",
                    "type": "string"
                }
            ],
            "name": "createSwap",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "EIP712DomainChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "assetAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "party1Address",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "party2Address",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "NFTTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "proposalId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "openSwapId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "proposer",
                    "type": "address"
                }
            ],
            "name": "ProposalCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "signerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "initiatorAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "initiatorAssets",
                    "type": "tuple[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "responderAssets",
                    "type": "tuple[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "signerStartingMessage",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "openSwapId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "proposalId",
                    "type": "string"
                }
            ],
            "name": "proposeToOpenSwap",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_currencyFeeAmount",
                    "type": "uint256"
                }
            ],
            "name": "setCurrencyFeeAmount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_currencyFeeAmountWithSubdomen",
                    "type": "uint256"
                }
            ],
            "name": "setCurrencyFeeAmountWithSubdomen",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_platformFeeAmount",
                    "type": "uint256"
                }
            ],
            "name": "setPlatformFeeAmount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_treasuryWalletAddress",
                    "type": "address"
                }
            ],
            "name": "setTreasuryWalletAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "initiator",
                    "type": "address"
                }
            ],
            "name": "SwapCanceled",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "initiator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "responder",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "status",
                    "type": "string"
                }
            ],
            "name": "SwapCompleted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "initiator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "responder",
                    "type": "address"
                }
            ],
            "name": "SwapCountered",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "initiator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "responder",
                    "type": "address"
                }
            ],
            "name": "SwapCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "assetAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "party1Address",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "party2Address",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "TokenTransferred",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "senderAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "nftAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "senderAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "tokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "currencyFeeAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "currencyFeeAmountWithSubdomen",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "eip712Domain",
            "outputs": [
                {
                    "internalType": "bytes1",
                    "name": "fields",
                    "type": "bytes1"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "version",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "chainId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "verifyingContract",
                    "type": "address"
                },
                {
                    "internalType": "bytes32",
                    "name": "salt",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256[]",
                    "name": "extensions",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFeeInETH",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "signerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "initAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "initiatorAssets",
                    "type": "tuple[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "responderAssets",
                    "type": "tuple[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "signerStartingMessage",
                    "type": "string"
                }
            ],
            "name": "getSignString",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "platformFeeAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "proposals",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "initiatorAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "initiatorApprove",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "responderApprove",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "status",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "platformFee",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "swaps",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "swapId",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "initiatorAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "initiatorApprove",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "responderApprove",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "status",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "swapType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "platformFee",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "treasuryWalletAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "signerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "initAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "responderAddress",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "initiatorAssets",
                    "type": "tuple[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "assetAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOrID",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "assetType",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct SwapUp.Asset[]",
                    "name": "responderAssets",
                    "type": "tuple[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                },
                {
                    "internalType": "string",
                    "name": "signerStartingMessage",
                    "type": "string"
                }
            ],
            "name": "verifySignature",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]`,
    erc20: `[
      {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
              }
          ],
          "name": "Approval",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "delegator",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "fromDelegate",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "toDelegate",
                  "type": "address"
              }
          ],
          "name": "DelegateChanged",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "delegate",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "previousBalance",
                  "type": "uint256"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "newBalance",
                  "type": "uint256"
              }
          ],
          "name": "DelegateVotesChanged",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [],
          "name": "EIP712DomainChanged",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": false,
                  "internalType": "address",
                  "name": "platformFeeRecipient",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "flatFee",
                  "type": "uint256"
              }
          ],
          "name": "FlatPlatformFeeUpdated",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": false,
                  "internalType": "uint8",
                  "name": "version",
                  "type": "uint8"
              }
          ],
          "name": "Initialized",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "platformFeeRecipient",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "platformFeeBps",
                  "type": "uint256"
              }
          ],
          "name": "PlatformFeeInfoUpdated",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": false,
                  "internalType": "enum IPlatformFee.PlatformFeeType",
                  "name": "feeType",
                  "type": "uint8"
              }
          ],
          "name": "PlatformFeeTypeUpdated",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "recipient",
                  "type": "address"
              }
          ],
          "name": "PrimarySaleRecipientUpdated",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "indexed": true,
                  "internalType": "bytes32",
                  "name": "previousAdminRole",
                  "type": "bytes32"
              },
              {
                  "indexed": true,
                  "internalType": "bytes32",
                  "name": "newAdminRole",
                  "type": "bytes32"
              }
          ],
          "name": "RoleAdminChanged",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
              }
          ],
          "name": "RoleGranted",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
              }
          ],
          "name": "RoleRevoked",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "mintedTo",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "quantityMinted",
                  "type": "uint256"
              }
          ],
          "name": "TokensMinted",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "signer",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "mintedTo",
                  "type": "address"
              },
              {
                  "components": [
                      {
                          "internalType": "address",
                          "name": "to",
                          "type": "address"
                      },
                      {
                          "internalType": "address",
                          "name": "primarySaleRecipient",
                          "type": "address"
                      },
                      {
                          "internalType": "uint256",
                          "name": "quantity",
                          "type": "uint256"
                      },
                      {
                          "internalType": "uint256",
                          "name": "price",
                          "type": "uint256"
                      },
                      {
                          "internalType": "address",
                          "name": "currency",
                          "type": "address"
                      },
                      {
                          "internalType": "uint128",
                          "name": "validityStartTimestamp",
                          "type": "uint128"
                      },
                      {
                          "internalType": "uint128",
                          "name": "validityEndTimestamp",
                          "type": "uint128"
                      },
                      {
                          "internalType": "bytes32",
                          "name": "uid",
                          "type": "bytes32"
                      }
                  ],
                  "indexed": false,
                  "internalType": "struct ITokenERC20.MintRequest",
                  "name": "mintRequest",
                  "type": "tuple"
              }
          ],
          "name": "TokensMintedWithSignature",
          "type": "event"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
              }
          ],
          "name": "Transfer",
          "type": "event"
      },
      {
          "inputs": [],
          "name": "CLOCK_MODE",
          "outputs": [
              {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "DEFAULT_ADMIN_ROLE",
          "outputs": [
              {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "DOMAIN_SEPARATOR",
          "outputs": [
              {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
              },
              {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
              }
          ],
          "name": "allowance",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
              }
          ],
          "name": "approve",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "balanceOf",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
              }
          ],
          "name": "burn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
              }
          ],
          "name": "burnFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              },
              {
                  "internalType": "uint32",
                  "name": "pos",
                  "type": "uint32"
              }
          ],
          "name": "checkpoints",
          "outputs": [
              {
                  "components": [
                      {
                          "internalType": "uint32",
                          "name": "fromBlock",
                          "type": "uint32"
                      },
                      {
                          "internalType": "uint224",
                          "name": "votes",
                          "type": "uint224"
                      }
                  ],
                  "internalType": "struct ERC20VotesUpgradeable.Checkpoint",
                  "name": "",
                  "type": "tuple"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "clock",
          "outputs": [
              {
                  "internalType": "uint48",
                  "name": "",
                  "type": "uint48"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "contractType",
          "outputs": [
              {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
              }
          ],
          "stateMutability": "pure",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "contractURI",
          "outputs": [
              {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "contractVersion",
          "outputs": [
              {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
              }
          ],
          "stateMutability": "pure",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "decimals",
          "outputs": [
              {
                  "internalType": "uint8",
                  "name": "",
                  "type": "uint8"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "subtractedValue",
                  "type": "uint256"
              }
          ],
          "name": "decreaseAllowance",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "delegatee",
                  "type": "address"
              }
          ],
          "name": "delegate",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "delegatee",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "nonce",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "expiry",
                  "type": "uint256"
              },
              {
                  "internalType": "uint8",
                  "name": "v",
                  "type": "uint8"
              },
              {
                  "internalType": "bytes32",
                  "name": "r",
                  "type": "bytes32"
              },
              {
                  "internalType": "bytes32",
                  "name": "s",
                  "type": "bytes32"
              }
          ],
          "name": "delegateBySig",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "delegates",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "eip712Domain",
          "outputs": [
              {
                  "internalType": "bytes1",
                  "name": "fields",
                  "type": "bytes1"
              },
              {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
              },
              {
                  "internalType": "string",
                  "name": "version",
                  "type": "string"
              },
              {
                  "internalType": "uint256",
                  "name": "chainId",
                  "type": "uint256"
              },
              {
                  "internalType": "address",
                  "name": "verifyingContract",
                  "type": "address"
              },
              {
                  "internalType": "bytes32",
                  "name": "salt",
                  "type": "bytes32"
              },
              {
                  "internalType": "uint256[]",
                  "name": "extensions",
                  "type": "uint256[]"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "timepoint",
                  "type": "uint256"
              }
          ],
          "name": "getPastTotalSupply",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "timepoint",
                  "type": "uint256"
              }
          ],
          "name": "getPastVotes",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "getPlatformFeeInfo",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              },
              {
                  "internalType": "uint16",
                  "name": "",
                  "type": "uint16"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              }
          ],
          "name": "getRoleAdmin",
          "outputs": [
              {
                  "internalType": "bytes32",
                  "name": "",
                  "type": "bytes32"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "internalType": "uint256",
                  "name": "index",
                  "type": "uint256"
              }
          ],
          "name": "getRoleMember",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              }
          ],
          "name": "getRoleMemberCount",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "getVotes",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "grantRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "hasRole",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "addedValue",
                  "type": "uint256"
              }
          ],
          "name": "increaseAllowance",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "_defaultAdmin",
                  "type": "address"
              },
              {
                  "internalType": "string",
                  "name": "_name",
                  "type": "string"
              },
              {
                  "internalType": "string",
                  "name": "_symbol",
                  "type": "string"
              },
              {
                  "internalType": "string",
                  "name": "_contractURI",
                  "type": "string"
              },
              {
                  "internalType": "address[]",
                  "name": "_trustedForwarders",
                  "type": "address[]"
              },
              {
                  "internalType": "address",
                  "name": "_primarySaleRecipient",
                  "type": "address"
              },
              {
                  "internalType": "address",
                  "name": "_platformFeeRecipient",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "_platformFeeBps",
                  "type": "uint256"
              }
          ],
          "name": "initialize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "forwarder",
                  "type": "address"
              }
          ],
          "name": "isTrustedForwarder",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
              }
          ],
          "name": "mintTo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "components": [
                      {
                          "internalType": "address",
                          "name": "to",
                          "type": "address"
                      },
                      {
                          "internalType": "address",
                          "name": "primarySaleRecipient",
                          "type": "address"
                      },
                      {
                          "internalType": "uint256",
                          "name": "quantity",
                          "type": "uint256"
                      },
                      {
                          "internalType": "uint256",
                          "name": "price",
                          "type": "uint256"
                      },
                      {
                          "internalType": "address",
                          "name": "currency",
                          "type": "address"
                      },
                      {
                          "internalType": "uint128",
                          "name": "validityStartTimestamp",
                          "type": "uint128"
                      },
                      {
                          "internalType": "uint128",
                          "name": "validityEndTimestamp",
                          "type": "uint128"
                      },
                      {
                          "internalType": "bytes32",
                          "name": "uid",
                          "type": "bytes32"
                      }
                  ],
                  "internalType": "struct ITokenERC20.MintRequest",
                  "name": "_req",
                  "type": "tuple"
              },
              {
                  "internalType": "bytes",
                  "name": "_signature",
                  "type": "bytes"
              }
          ],
          "name": "mintWithSignature",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes[]",
                  "name": "data",
                  "type": "bytes[]"
              }
          ],
          "name": "multicall",
          "outputs": [
              {
                  "internalType": "bytes[]",
                  "name": "results",
                  "type": "bytes[]"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "name",
          "outputs": [
              {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
              }
          ],
          "name": "nonces",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "numCheckpoints",
          "outputs": [
              {
                  "internalType": "uint32",
                  "name": "",
                  "type": "uint32"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
              },
              {
                  "internalType": "address",
                  "name": "spender",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "deadline",
                  "type": "uint256"
              },
              {
                  "internalType": "uint8",
                  "name": "v",
                  "type": "uint8"
              },
              {
                  "internalType": "bytes32",
                  "name": "r",
                  "type": "bytes32"
              },
              {
                  "internalType": "bytes32",
                  "name": "s",
                  "type": "bytes32"
              }
          ],
          "name": "permit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "primarySaleRecipient",
          "outputs": [
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "renounceRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes32",
                  "name": "role",
                  "type": "bytes32"
              },
              {
                  "internalType": "address",
                  "name": "account",
                  "type": "address"
              }
          ],
          "name": "revokeRole",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "string",
                  "name": "_uri",
                  "type": "string"
              }
          ],
          "name": "setContractURI",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "_platformFeeRecipient",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "_platformFeeBps",
                  "type": "uint256"
              }
          ],
          "name": "setPlatformFeeInfo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "_saleRecipient",
                  "type": "address"
              }
          ],
          "name": "setPrimarySaleRecipient",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes4",
                  "name": "interfaceId",
                  "type": "bytes4"
              }
          ],
          "name": "supportsInterface",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "symbol",
          "outputs": [
              {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
              }
          ],
          "name": "transfer",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
              },
              {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
              },
              {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
              }
          ],
          "name": "transferFrom",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "components": [
                      {
                          "internalType": "address",
                          "name": "to",
                          "type": "address"
                      },
                      {
                          "internalType": "address",
                          "name": "primarySaleRecipient",
                          "type": "address"
                      },
                      {
                          "internalType": "uint256",
                          "name": "quantity",
                          "type": "uint256"
                      },
                      {
                          "internalType": "uint256",
                          "name": "price",
                          "type": "uint256"
                      },
                      {
                          "internalType": "address",
                          "name": "currency",
                          "type": "address"
                      },
                      {
                          "internalType": "uint128",
                          "name": "validityStartTimestamp",
                          "type": "uint128"
                      },
                      {
                          "internalType": "uint128",
                          "name": "validityEndTimestamp",
                          "type": "uint128"
                      },
                      {
                          "internalType": "bytes32",
                          "name": "uid",
                          "type": "bytes32"
                      }
                  ],
                  "internalType": "struct ITokenERC20.MintRequest",
                  "name": "_req",
                  "type": "tuple"
              },
              {
                  "internalType": "bytes",
                  "name": "_signature",
                  "type": "bytes"
              }
          ],
          "name": "verify",
          "outputs": [
              {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
              },
              {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      }
  ]`,
    namespace: `[
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_treasury",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_verifier",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_nameWrapperProxy",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_nameWrapper",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_namespaceRegistry",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "version",
              "type": "string"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            
          ],
          "name": "ECDSAInvalidSignature",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "length",
              "type": "uint256"
            }
          ],
          "name": "ECDSAInvalidSignatureLength",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "name": "ECDSAInvalidSignatureS",
          "type": "error"
        },
        {
          "inputs": [
            
          ],
          "name": "InvalidShortString",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "node",
              "type": "bytes32"
            }
          ],
          "name": "NameNotListed",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "OwnableInvalidOwner",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "OwnableUnauthorizedAccount",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "str",
              "type": "string"
            }
          ],
          "name": "StringTooLong",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "controller",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "enabled",
              "type": "bool"
            }
          ],
          "name": "ControllerChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            
          ],
          "name": "EIP712DomainChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "parentNode",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "label",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "mintPrice",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "mintFee",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "paymentReceiver",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "subnameOwner",
              "type": "address"
            }
          ],
          "name": "SubnameMinted",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "controllers",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            
          ],
          "name": "eip712Domain",
          "outputs": [
            {
              "internalType": "bytes1",
              "name": "fields",
              "type": "bytes1"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "version",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "chainId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "verifyingContract",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "salt",
              "type": "bytes32"
            },
            {
              "internalType": "uint256[]",
              "name": "extensions",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "parentNode",
                  "type": "bytes32"
                },
                {
                  "internalType": "string",
                  "name": "subnameLabel",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "resolver",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "subnameOwner",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "fuses",
                  "type": "uint32"
                },
                {
                  "internalType": "uint256",
                  "name": "mintPrice",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "mintFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "ttl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "expiry",
                  "type": "uint64"
                }
              ],
              "internalType": "struct MintSubnameContext",
              "name": "context",
              "type": "tuple"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "name": "mint",
          "outputs": [
            
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "parentNode",
                  "type": "bytes32"
                },
                {
                  "internalType": "string",
                  "name": "subnameLabel",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "resolver",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "subnameOwner",
                  "type": "address"
                },
                {
                  "internalType": "uint32",
                  "name": "fuses",
                  "type": "uint32"
                },
                {
                  "internalType": "uint256",
                  "name": "mintPrice",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "mintFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint64",
                  "name": "ttl",
                  "type": "uint64"
                },
                {
                  "internalType": "uint64",
                  "name": "expiry",
                  "type": "uint64"
                }
              ],
              "internalType": "struct MintSubnameContext",
              "name": "context",
              "type": "tuple"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            },
            {
              "internalType": "bytes[]",
              "name": "data",
              "type": "bytes[]"
            }
          ],
          "name": "mintWithData",
          "outputs": [
            
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            },
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "onERC1155BatchReceived",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "name": "onERC1155Received",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            
          ],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            
          ],
          "name": "renounceOwnership",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "controller",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "enabled",
              "type": "bool"
            }
          ],
          "name": "setController",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_nameWrapper",
              "type": "address"
            }
          ],
          "name": "setNameWrapper",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_treasury",
              "type": "address"
            }
          ],
          "name": "setTreasury",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_verifier",
              "type": "address"
            }
          ],
          "name": "setVerifier",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            
          ],
          "name": "withdraw",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
  ]`
};