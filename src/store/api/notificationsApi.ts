import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Notification {
	id: number;
	text: string;
	end: string;
	createdAt: string;
}

interface NotificationsListResponse {
	notifications: Notification[];
	total: number;
}

export interface CreateNotificationDto {
	text: string;
	end: string;
}

export interface UpdateNotificationDto {
	text?: string;
	end?: string;
}

export const notificationsApi = createApi({
	reducerPath: "notificationsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_PUBLIC_API_URL}`,
	}),
	tagTypes: ["Notification"],
	endpoints: (builder) => ({
		getNotifications: builder.query<NotificationsListResponse, void>({
			query: () => "notifications",
			providesTags: ["Notification"],
		}),
		getActiveNotifications: builder.query<NotificationsListResponse, void>({
			query: () => "notifications/active",
			providesTags: ["Notification"],
		}),
		getNotification: builder.query<Notification, number>({
			query: (id) => `notifications/${id}`,
			providesTags: (_, __, id) => [{ type: "Notification", id }],
		}),
		createNotification: builder.mutation<Notification, CreateNotificationDto>({
			query: (notification) => ({
				url: "notifications",
				method: "POST",
				body: notification,
			}),
			invalidatesTags: ["Notification"],
		}),
		updateNotification: builder.mutation<
			Notification,
			{ id: number; notification: UpdateNotificationDto }
		>({
			query: ({ id, notification }) => ({
				url: `notifications/${id}`,
				method: "PATCH",
				body: notification,
			}),
			invalidatesTags: (_, __, { id }) => [{ type: "Notification", id }],
		}),
		deleteNotification: builder.mutation<Notification, number>({
			query: (id) => ({
				url: `notifications/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Notification"],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useGetActiveNotificationsQuery,
	useGetNotificationQuery,
	useCreateNotificationMutation,
	useUpdateNotificationMutation,
	useDeleteNotificationMutation,
} = notificationsApi;
