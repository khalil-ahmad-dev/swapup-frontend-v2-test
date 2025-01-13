import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn, generateRandomKey, getShortenWalletAddress } from "@/lib/utils";
import NotificationItem from "./NotificationDropdownItem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import EmptyDataset from "../shared/EmptyDataset";
import { Notification } from "@/types/notifications.types";
import { UIEventHandler, useEffect, useRef, useState } from "react";
import { getNotificationsApi, checkNotificationApi, deleteAllNotificationsApi } from "@/service/api/notifications.service";

type NotificationProps = {
    wallet: string;
};

const NotificationDropdown: React.FC<NotificationProps> = (props) => {
    const defaultDropdownSize = 288;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dropdownKey, setDropdownKey] = useState(generateRandomKey(6));
    const [dropdownSize, setDropdownSize] = useState(defaultDropdownSize);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const currPage = useRef<number>(2);

    let latestNotificationTimestamp: Date | null =
        notifications.length > 0 ? new Date(notifications[0].createdAt) : null;


    useEffect(() => {
        ; (async () => {
            try {
                const userNotifications = await getNotificationsApi(props.wallet, 1);
                setNotifications([...userNotifications.data.data]);
            } catch (err) {
                console.error(err);
            }
        })();

        const fetchNotificationIntervalId = setInterval(async () => {
            try {
                if (latestNotificationTimestamp) {
                    const newNotifications = await checkNotificationApi(
                        props.wallet,
                        latestNotificationTimestamp as Date
                    );
                    if (newNotifications.data.data.length > 0) {
                        setNotifications([
                            ...newNotifications.data.data,
                            ...notifications
                        ]);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }, 1000 * 60);

        return () => clearInterval(fetchNotificationIntervalId);
    }, [props.wallet]);

    useEffect(() => {
        if (notifications.length > 4) {
            setDropdownSize(defaultDropdownSize);
            setDropdownKey(generateRandomKey(6));
        }
    }, [notifications]);


    const loadOlderNotifications: UIEventHandler<HTMLElement> = async (e: React.MouseEvent<HTMLElement>) => {
        if (isLoading) return;
        const element: HTMLDivElement | null = e.currentTarget.querySelector("[data-radix-scroll-area-viewport]");
        const { scrollHeight, scrollTop, clientHeight } = element as HTMLDivElement;
        if (Math.abs(scrollHeight - scrollTop - clientHeight) <= 1) {
            try {
                setIsLoading(true);
                const notifications = await getNotificationsApi(
                    props.wallet,
                    currPage.current
                );
                if (notifications.data.data.length) {
                    currPage.current++;
                    setNotifications((currNotifications) => [
                        ...currNotifications,
                        ...notifications.data.data]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const delAllNotifications = async () => {
        try {
            const res = await deleteAllNotificationsApi(props.wallet);
            console.log(res.data.message);
            const updatedNotifications = notifications.filter(
                (notification) => notification.receiver_address !== props.wallet
            );
            setNotifications([...updatedNotifications]);
            setDropdownKey(generateRandomKey(6));
        } catch (err) {
            console.error(err);
        }
    };

    const getElapsedTime = (
        time: Date
    ): { hours: number; minutes: number; seconds: number; } => {
        // Current date and time
        const now = new Date();
        // Difference in milliseconds
        const diffMs = now.getTime() - time.getTime();
        // Convert to hours, minutes, and seconds
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        return { hours, minutes, seconds };
    };

    const renderNotifications = (
        type: number,
        counterPartyAddress: string,
        readFlag: boolean,
        timestamp: Date,
        trade_id: string,
        id: string,
        swapMode: number
    ) => {
        const timeElapsed = getElapsedTime(timestamp);
        const timeElapsedString =
            timeElapsed.hours >= 1
                ? timeElapsed.hours >= 24
                    ? `${Math.trunc(timeElapsed.hours / 24)}d`
                    : `${timeElapsed.hours}h`
                : timeElapsed.minutes >= 1
                    ? `${timeElapsed.minutes}m`
                    : `${timeElapsed.seconds}s`;
        let message: string, title: string;
        if (type === 1) {
            message = `You have received a swap offer from ${getShortenWalletAddress(counterPartyAddress)}`;
            title = "Incoming Swap Request";
        } else if (type === 2) {
            title = "Swap Request Rejected";
            message = `Your swap offer has been rejected by ${getShortenWalletAddress(counterPartyAddress)}`;
        } else if (type === 3) {
            title = "Swap Completed";
            message = `Your swap offer was accepted by ${getShortenWalletAddress(counterPartyAddress)}`;
        } else if (type === 4) {
            title = "Swap Offer Countered";
            message = `You have received a counteroffer from ${getShortenWalletAddress(counterPartyAddress)}`;
        } else if (type === 5) {
            title = "Counter Offer Rejected";
            message = `Your counter offer has been rejected by ${getShortenWalletAddress(counterPartyAddress)}`;
        } else {
            title = "Trade Cancelled";
            message = `${counterPartyAddress} canceled the trade`;
        }
        return (
            <NotificationItem
                key={id}
                title={title}
                message={message}
                read={readFlag}
                timestamp={timeElapsedString}
                id={trade_id}
                uid={id}
                updateNotifications={setNotifications}
                linkToTrade={type === 1 || type === 4}
                swapMode={swapMode}
                setOpen={setOpen}
            />
        );
    };

    return (
        <DropdownMenu key={dropdownKey} open={open} onOpenChange={setOpen}>

            <DropdownMenuTrigger
                className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 ring-0",
                    "data-[state=open]:bg-white/20"
                )}
            >
                {notifications.length === 0 ? (
                    <svg
                        className="w-4"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7 16C7.53043 16 8.03914 15.7893 8.41421 15.4142C8.78929 15.0392 9 14.5305 9 14.0001H5C5 14.5305 5.21071 15.0392 5.58579 15.4142C5.96086 15.7893 6.46957 16 7 16ZM7.995 1.09981C8.00896 0.960776 7.99362 0.820356 7.94997 0.687611C7.90632 0.554865 7.83533 0.432741 7.74158 0.329115C7.64783 0.225489 7.5334 0.142662 7.40567 0.0859748C7.27794 0.0292879 7.13975 0 7 0C6.86026 0 6.72206 0.0292879 6.59433 0.0859748C6.4666 0.142662 6.35217 0.225489 6.25842 0.329115C6.16467 0.432741 6.09368 0.554865 6.05003 0.687611C6.00638 0.820356 5.99104 0.960776 6.005 1.09981C4.87455 1.32935 3.85823 1.94268 3.12831 2.83585C2.39839 3.72902 1.99977 4.84708 2 6.00055C2 7.09849 1.5 12.0002 0 13.0002H14C12.5 12.0002 12 7.09849 12 6.00055C12 3.58068 10.28 1.56079 7.995 1.09981Z"
                            fill="white"
                        />
                    </svg>
                ) : (
                    <div className="relative">
                        <svg
                            className="w-3.5"
                            viewBox="0 0 14 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.42371 1.20636C8.28329 1.16474 8.14029 1.12913 7.995 1.09981C8.00896 0.960776 7.99362 0.820356 7.94997 0.687611C7.90632 0.554865 7.83533 0.432741 7.74158 0.329115C7.64783 0.225489 7.5334 0.142662 7.40567 0.0859747C7.27794 0.0292878 7.13974 0 7 0C6.86026 0 6.72206 0.0292878 6.59433 0.0859747C6.4666 0.142662 6.35217 0.225489 6.25842 0.329115C6.16467 0.432741 6.09368 0.554865 6.05003 0.687611C6.00638 0.820356 5.99104 0.960776 6.005 1.09981C4.87455 1.32935 3.85823 1.94268 3.12831 2.83585C2.39839 3.72902 1.99977 4.84708 2 6.00055C2 7.09849 1.5 12.0002 0 13.0002H14C12.7881 12.1923 12.229 8.83751 12.0589 6.99958C12.0393 6.99986 12.0197 7 12 7C9.79086 7 8 5.20914 8 3C8 2.35509 8.15262 1.74583 8.42371 1.20636Z"
                                fill="white"
                            />
                            <path
                                d="M8.41421 15.4142C8.03914 15.7893 7.53043 16 7 16C6.46957 16 5.96086 15.7893 5.58579 15.4142C5.21071 15.0392 5 14.5305 5 14.0001H9C9 14.5305 8.78929 15.0392 8.41421 15.4142Z"
                                fill="white"
                            />
                        </svg>

                        <p className="h-[5px] w-[5px] bg-su_negative rounded-full absolute top-[-0.5px] right-[-1.5px]"></p>
                    </div>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-su_least_bg rounded-md py-3 pl-3 flex flex-col gap-2 z-50 min-w-[280px] absolute -right-12 lg:-right-4 -top-1">
                <header className="flex items-center justify-between pr-3">
                    <h2 className="text-su_ternary text-sm">Notifications</h2>
                    <button
                        className={`font-semibold text-xs ${notifications.length === 0
                            ? "text-su_disabled cursor-not-allowed"
                            : ""
                            }`}
                        onClick={delAllNotifications}
                        disabled={notifications.length === 0}
                    >
                        Clear all
                    </button>
                </header>
                <ScrollArea className={`h-[${dropdownSize}px] pr-2`} onScrollCapture={loadOlderNotifications}>
                    <section className="space-y-2">
                        {notifications.map((notification) =>
                            renderNotifications(
                                notification.status,
                                notification.receiver_address,
                                notification.read,
                                new Date(notification.createdAt),
                                notification.trade_id,
                                notification.id,
                                notification.swap_mode
                            )
                        )}
                        {isLoading && (
                            <div className="py-2 text-center text-sm text-su_ternary">
                                Loading more...
                            </div>
                        )}
                    </section>
                    {notifications.length === 0 && (
                        <>
                            <div className="h-72 flex items-center">
                                <EmptyDataset
                                    className="h-28 lg:h-32"
                                    icon={
                                        <svg
                                            className="w-8"
                                            viewBox="0 0 32 25"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M17.5663 20.8333C17.5663 21.3056 17.6249 21.7639 17.6981 22.2222H8.05124C5.85544 22.2222 3.93779 21.5278 2.35682 20.0417C0.790485 18.5833 0 16.7917 0 14.6944C0 12.8889 0.570906 11.2778 1.71272 9.86111C3.42543 7.73611 4.39158 7.54167 6.22141 7.15278C6.83623 5.02778 8.05124 3.30556 9.88106 1.98611C11.7109 0.666666 13.7896 0 16.1025 0C18.957 0 21.3724 0.944444 23.3632 2.83333C25.3541 4.72222 26.3495 7.01389 26.3495 9.72222C28.0329 9.90278 29.4236 10.5972 30.5361 11.8056C31.2827 12.5972 31.7658 13.4861 32 14.4722C30.4268 13.1931 28.4214 12.4931 26.3495 12.5C21.5041 12.5 17.5663 16.2361 17.5663 20.8333ZM24.5197 21.4306L22.1921 19.2222L20.4941 20.8333L24.5197 25L31.473 18.4028L29.7749 16.4444L24.5197 21.4306Z"
                                                fill="#565665"
                                            />
                                        </svg>
                                    }
                                    showBackgroundPicture={false}
                                    title="All Updated"
                                    description="There are currently no new <br/> notifications for you."
                                />
                            </div>
                            <ScrollBar orientation="vertical" />
                        </>
                    )}
                </ScrollArea>
                {notifications.length > 4 &&
                    dropdownSize === defaultDropdownSize && (
                        <button
                            className="font-semibold text-xs border-t border-t-su_active_bg pt-2"
                            onClick={() => setDropdownSize(400)}
                        >
                            Show All
                        </button>
                    )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;