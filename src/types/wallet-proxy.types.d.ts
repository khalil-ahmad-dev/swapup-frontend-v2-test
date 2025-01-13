import { SUI_OpenSwap, SUI_Swap, SUT_SwapTokenContractTypeNumbers } from "./swap-market.types";

export type SUT_SC_SwapMethodType = "CREATE" | "PROPOSE" | "COUNTER" | "ACCEPT" | "REJECT" | "CANCEL" | "CANCEL-ORIGINAL-OPEN-SWAP";
export type SUT_CancelSwapType = "SWAP" | "PROPOSAL";

export interface SUI_SwapAsset {
  assetAddress: string,
  amountOrID: string;
  assetType: string;
}

export interface SUI_CreateAndUpdateSwapFunctionProps {
  swap: SUI_Swap | SUI_OpenSwap,
  swapAction: SUT_SC_SwapMethodType,
  signature: string,
  messageSignerAddress: string,
  userSignMessage: string;
}