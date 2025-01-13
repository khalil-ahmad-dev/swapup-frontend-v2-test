import { AxiosResponse } from "axios";
import API from "../Axios";

export const getNotificationsApi = (address: string, page: number): Promise<AxiosResponse> =>
    API.get(`/api/notifications/older`, { params: { receiver_address: address, page: page } });

export const markNotificationAsReadApi = (id: string): Promise<AxiosResponse> =>
    API.patch(`/api/notifications/${id}`);

export const checkNotificationApi = (address: string, timestamp: Date): Promise<AxiosResponse> =>
    API.get(`/api/notifications/`, { params: { receiver_address: address, timestamp: timestamp.toISOString() } });

export const deleteNotificationApi = (id: string): Promise<AxiosResponse> =>
    API.delete(`/api/notifications/${id}`);

export const deleteAllNotificationsApi = (address: string): Promise<AxiosResponse> =>
    API.delete(`/api/notifications/delete/${address}`);
