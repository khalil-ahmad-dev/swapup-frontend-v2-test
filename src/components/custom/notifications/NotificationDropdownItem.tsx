import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { markNotificationAsReadApi, deleteNotificationApi } from "@/service/api/notifications.service";
import { Notification } from "@/types/notifications.types";
import { NavLink, useNavigate } from "react-router-dom";
import CustomPopoverActionButton from "../shared/CustomPopoverActionButton";
import { getLastCharacters } from "@/lib/utils";

type NotificationItemProps = {
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
    id: string;
    uid: string;
    updateNotifications: (
        notifications:
            | Notification[]
            | ((notifications: Notification[]) => Notification[])
    ) => void;
    linkToTrade: boolean;
    swapMode: number;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotificationDropdownItem: React.FC<NotificationItemProps> = (props) => {

    const navigate = useNavigate();

    const markAsRead = async () => {
        try {
            const res = await markNotificationAsReadApi(props.uid);
            console.log(res.data.message);
            props.updateNotifications((notifications) => {
                const updatedNotifications = notifications.map(
                    (notification) => {
                        if (notification.id === props.uid) {
                            return { ...notification, read: true };
                        } else {
                            return notification;
                        }
                    }
                );
                return [...updatedNotifications];
            });
        } catch (err) {
            console.error(err);
        }
    };

    const delNotification = async () => {
        try {
            const res = await deleteNotificationApi(props.uid);
            console.log(res.data.message);
            props.updateNotifications((notifications) => {
                const updatedNotifications = notifications.filter(
                    (notification) => notification.id !== props.uid
                );
                return [...updatedNotifications];
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleRedirect = () => {
        if (props.id) {
            props.setOpen(false);
            navigate(`/swap-up/swap-market/view-swap/${props.swapMode}/${props.id}`);
        }
    };

    return (
        <div
            className={`min-w-[280px] flex items-start justify-between hover:bg-su_enable_bg rounded-sm px-1.5 py-1`}
        >
            <div
                className="flex items-start gap-2 cursor-pointer"
                onClick={handleRedirect}
            >
                <div className={`h-1.5 w-1.5 rounded-full ${!props.read && "bg-su_negative"} mt-2`}></div>
                <div className="">
                    <h2 className="text-sm font-semibold line-clamp-1">{props.title}</h2>
                    <h4 className="text-xs line-clamp-1 font-semibold">Trade ID: <span className="font-normal" >{props.id}</span></h4>
                    <p className="text-xs line-clamp-2 text-su_secondary">{props.message}</p>
                    <p className="text-2xs text-su_secondary">{props.timestamp} ago</p>
                </div>
            </div>

            <Popover>
                <PopoverTrigger className="px-3 py-1.5 rounded-lg hover:bg-su_enable_bg cursor-pointer">
                    <svg
                        className="w-1 cursor-pointer"
                        viewBox="0 0 4 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2.00039 12.8C2.42474 12.8 2.8317 12.9686 3.13176 13.2686C3.43182 13.5687 3.60039 13.9757 3.60039 14.4C3.60039 14.8243 3.43182 15.2313 3.13176 15.5314C2.8317 15.8314 2.42474 16 2.00039 16C1.57604 16 1.16908 15.8314 0.86902 15.5314C0.568961 15.2313 0.400391 14.8243 0.400391 14.4C0.400391 13.9757 0.568961 13.5687 0.86902 13.2686C1.16908 12.9686 1.57604 12.8 2.00039 12.8ZM2.00039 6.4C2.42474 6.4 2.8317 6.56857 3.13176 6.86863C3.43182 7.16869 3.60039 7.57565 3.60039 8C3.60039 8.42435 3.43182 8.83131 3.13176 9.13137C2.8317 9.43143 2.42474 9.6 2.00039 9.6C1.57604 9.6 1.16908 9.43143 0.86902 9.13137C0.568961 8.83131 0.400391 8.42435 0.400391 8C0.400391 7.57565 0.568961 7.16869 0.86902 6.86863C1.16908 6.56857 1.57604 6.4 2.00039 6.4ZM2.00039 0C2.42474 0 2.8317 0.168571 3.13176 0.468629C3.43182 0.768687 3.60039 1.17565 3.60039 1.6C3.60039 2.02435 3.43182 2.43131 3.13176 2.73137C2.8317 3.03143 2.42474 3.2 2.00039 3.2C1.57604 3.2 1.16908 3.03143 0.86902 2.73137C0.568961 2.43131 0.400391 2.02435 0.400391 1.6C0.400391 1.17565 0.568961 0.768687 0.86902 0.468629C1.16908 0.168571 1.57604 0 2.00039 0Z"
                            fill="#B6B6BD"
                        />
                    </svg>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="max-w-52 px-2 pr-4 lg:pr-0 lg:px-3 py-3 bg-card dark:bg-su_least_bg lg:dark:bg-su_secondary_bg rounded-sm"
                >
                    <CustomPopoverActionButton
                        onClick={markAsRead}
                        icon={
                            <svg
                                className="w-4 cursor-pointer"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.83268 12.8337L13.7077 6.95866L12.541 5.79199L7.83268 10.5003L5.45768 8.12533L4.29102 9.29199L7.83268 12.8337ZM8.99935 17.3337C7.84657 17.3337 6.76324 17.1148 5.74935 16.677C4.73546 16.2392 3.85352 15.6456 3.10352 14.8962C2.35352 14.1467 1.75991 13.2648 1.32268 12.2503C0.885461 11.2359 0.666572 10.1525 0.666017 9.00033C0.665461 7.8481 0.88435 6.76477 1.32268 5.75033C1.76102 4.73588 2.35463 3.85394 3.10352 3.10449C3.85241 2.35505 4.73435 1.76144 5.74935 1.32366C6.76435 0.885881 7.84768 0.666992 8.99935 0.666992C10.151 0.666992 11.2343 0.885881 12.2493 1.32366C13.2643 1.76144 14.1463 2.35505 14.8952 3.10449C15.6441 3.85394 16.238 4.73588 16.6768 5.75033C17.1157 6.76477 17.3344 7.8481 17.3327 9.00033C17.331 10.1525 17.1121 11.2359 16.676 12.2503C16.2399 13.2648 15.6463 14.1467 14.8952 14.8962C14.1441 15.6456 13.2621 16.2395 12.2493 16.6778C11.2366 17.1162 10.1532 17.3348 8.99935 17.3337Z"
                                    fill="white"
                                />
                            </svg>
                        }
                    >
                        Mark as Read
                    </CustomPopoverActionButton>
                    <CustomPopoverActionButton
                        onClick={delNotification}
                        icon={
                            <svg
                                className="w-4 cursor-pointer"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 0.888889H9L8.14286 0H3.85714L3 0.888889H0V2.66667H12M0.857143 14.2222C0.857143 14.6937 1.03775 15.1459 1.35925 15.4793C1.68074 15.8127 2.11677 16 2.57143 16H9.42857C9.88323 16 10.3193 15.8127 10.6408 15.4793C10.9622 15.1459 11.1429 14.6937 11.1429 14.2222V3.55556H0.857143V14.2222Z"
                                    fill="#FF7585"
                                />
                            </svg>
                        }
                    >
                        Delete
                    </CustomPopoverActionButton>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default NotificationDropdownItem;
