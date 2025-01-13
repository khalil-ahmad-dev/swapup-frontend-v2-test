import { SUT_SwapMode } from "./swap-market.types";

export type Notification = {
    id: string;
    trade_id: string;
    status: number;
    receiver_address: string;
    originator_address: string;
    read: boolean;
    createdAt: string;
    open_trade_id?: string;
    swap_mode: SUT_SwapMode;
};
