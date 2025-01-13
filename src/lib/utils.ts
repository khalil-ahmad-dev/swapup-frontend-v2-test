import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { Environment } from "@/config";
import { chainsDataset } from "@/constants/data";
import { validate as uuidValidate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { defaults } from "@/constants/defaults";
import { SUI_RarityRankItem } from "@/types/global.types";
import moment from "moment";
import { SUI_TwitterPostLocalStorageState } from "@/types/third-party.types";
import { ethers } from "ethers";

type SUT_ShortAddressVariants = 'short' | 'medium' | 'long';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const applyThemeClass = (theme: 'dark' | 'light' | 'system') => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  );
};

export const getIsActiveNav = (path: string, pathname: string, type: "swapup" | "website" = "swapup") => {
  if (type === 'swapup') {
    return pathname.toLowerCase().startsWith(path.toLowerCase());
  } else {
    return pathname.toLowerCase() === path.toLowerCase();
  }
};

export const getActiveTabFromPathname = (pathname: string): string => {
  const parts = pathname.split('/').filter(part => part !== '');
  return parts.length > 0 ? parts[parts.length - 1] : '';
};

export const isValidTradeId = (tradeId: string): boolean => {
  return uuidValidate(tradeId);
};

export const getNameInitials = (name = '') => {
  const nameWords = name.split(' ');
  return `${nameWords[0].charAt(0)}${nameWords[nameWords.length - 1].charAt(0)}`;
};


export const getShortenWalletAddress = (address: string, variant: SUT_ShortAddressVariants = 'short') => {

  const shortAddressVariants: { key: SUT_ShortAddressVariants, value: number; }[] = [
    { key: 'short', value: 6 },
    { key: 'medium', value: 10 },
    { key: 'long', value: 14 }
  ];

  const shortAddressVariant = shortAddressVariants.find(ad => ad.key === variant);

  if (!address || address.length < 12) {
    return address;
  }

  const firstPart = address.slice(0, shortAddressVariant?.value || 6);
  const lastPart = address.slice(-(shortAddressVariant?.value || 6) - 1);

  return `${firstPart}...${lastPart}`;
};

export const getLastCharacters = (value: string, lastCharacters: number) => {
  return (value || []).length ? value.slice(value.length - lastCharacters) : "######";
};


export const generateRandomTradeId = (): string => {
  return uuidv4();
};

export const generateRandomKey = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const getBaseScanContractNftUrl = (token: string, nftId: string) => {
  const baseUrl = Environment.BASESCAN_BASE_URL;
  return `${baseUrl}/nft/${token}/${nftId}`;
};

export const getBaseScanTransactionURL = (tx: string) => {
  const baseUrl = Environment.BASESCAN_BASE_URL;
  return `${baseUrl}/tx/${tx}`;
};

export const getBloackscoutNftUrl = (token: string, nftId: string) => {
  const baseUrl = Environment.BLOCKSCOUT_BASE_URL;

  return `${baseUrl}/token/${token}/instance/${nftId}`;
};
export const isValidWalletAddress = (address: string) => {
  const regex = /^0x[0-9a-fA-F]{40}$/;

  if (regex.test(address)) {
    const isValid = ethers.isAddress(address);
    return isValid;
  } else {
    return false;
  }
};

export const getDefaultNftImageOnError = (e: any) => {
  e.currentTarget.src = defaults.fallback.nftImageUrl;
};

export const getNetworkImageById = (id: string) => {
  const network = chainsDataset.find(chain => chain.uuid === id);

  if (network) {
    return network.iconUrl;
  }

  return "/assets/svgs/ethereum.svg";
};


export const compareRarityRankItems = (item1: SUI_RarityRankItem, item2: SUI_RarityRankItem) => {
  return item1.from === item2.from && item1.to === item2.to;
};

export const getNormalizeAndCompareTwoStrings = (str1: string, str2: string) => {
  const normalize = (str: string) => str.replace(/[\s\-_.]/g, '').toLowerCase();
  const normalizedStr1 = normalize(str1);
  const normalizedStr2 = normalize(str2);

  return normalizedStr1 === normalizedStr2;
};


export const checkIsDateInRange = (dateToCheck: string, dateRangeFrom: string, dateRangeTo: string) => {
  const dateToCheckUTC = moment.utc(dateToCheck);
  const dateRangeFromUTC = moment.utc(dateRangeFrom);
  const dateRangeToUTC = moment.utc(dateRangeTo);

  return dateToCheckUTC.isSameOrAfter(dateRangeFromUTC) && dateToCheckUTC.isSameOrBefore(dateRangeToUTC);
};


export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getAspectRatio = (width: number, height: number) => {
  return width / height;
};

// Localstorage helper functions start here

export const handleTwitterSharingProcessLocalstorageState = (actionType: "SET" | "REMOVE" | "GET" | "SET-FALSE", tradeId?: string) => {

  let foundItem: SUI_TwitterPostLocalStorageState = { started: false, tradeId: '' };

  switch (actionType) {
    case 'SET':
      // Remember: while setting data to localstorage must pass trade id
      const itemState: SUI_TwitterPostLocalStorageState = { started: true, tradeId: tradeId! };
      localStorage.setItem("isTwitterPostProcessStarted", JSON.stringify(itemState));
      break;

    case 'SET-FALSE':
      // Remember: while setting data to localstorage must pass trade id
      const falseItemState: SUI_TwitterPostLocalStorageState = { started: false, tradeId: handleTwitterSharingProcessLocalstorageState('GET').tradeId };
      localStorage.setItem("isTwitterPostProcessStarted", JSON.stringify(falseItemState));
      break;

    case 'GET':
      if (localStorage.getItem("isTwitterPostProcessStarted")) {
        foundItem = JSON.parse(localStorage.getItem("isTwitterPostProcessStarted")!);
      }
      break;

    case 'REMOVE':
      localStorage.removeItem("isTwitterPostProcessStarted");
      break;

    default:
      break;
  }

  return foundItem;
};

export const getCurrentBaseUrl = () => {
  return (`${window.location.protocol}//${window.location.host}`);
};

export const getNumberToShortScaleFormate = (amount: number) => {
  // Convert the input to a number (in case it's a string)
  const num = Number(amount);

  // Check if the input is valid
  if (isNaN(num)) {
    return "Invalid amount";
  }

  // Define suffixes for each range
  const suffixes = ["", "K", "L", "M", "B", "T"]; // L for Lakh
  const divisors = [1, 1e3, 1e5, 1e6, 1e9, 1e12]; // Divisors based on ranges

  let tier = 0;

  // Determine the tier for the number based on ranges
  for (let i = divisors.length - 1; i >= 0; i--) {
    if (num >= divisors[i]) {
      tier = i;
      break;
    }
  }

  // Calculate the formatted number
  const formatted = (num / divisors[tier]).toString();

  // Remove trailing zeros after the decimal point
  const match = formatted.match(/(\d+\.\d*?[1-9])0*$/);
  const result = match ? match[1] : formatted;

  const suffix = suffixes[tier];

  return `${result} ${suffix}`;
};