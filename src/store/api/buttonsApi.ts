import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Button {
	id: number;
	name: string;
	type: string;
	url?: string;
	description?: string;
	isActive: boolean;
	clickCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateButtonDto {
	name: string;
	type: string;
	url?: string;
	description?: string;
	isActive?: boolean;
}

export interface UpdateButtonDto {
	name?: string;
	type?: string;
	url?: string;
	description?: string;
	isActive?: boolean;
}

export interface ButtonsResponse {
	data: Button[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface ButtonStats {
	type: string;
	totalClicks: number;
	buttonCount: number;
}

export interface GetButtonsParams {
	page?: number;
	pageSize?: number;
	dateFrom?: string;
	dateTo?: string;
}

export interface GetTopButtonsParams {
	limit?: number;
	dateFrom?: string;
	dateTo?: string;
}

export const buttonsApi = createApi({
	reducerPath: "buttonsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_PUBLIC_API_URL}/buttons`,
	}),
	tagTypes: ["Button"],
	endpoints: (builder) => ({
		getButtons: builder.query<ButtonsResponse, GetButtonsParams>({
			query: ({ page = 1, pageSize = 10, dateFrom, dateTo } = {}) => {
				const params: Record<string, string> = {
					page: page.toString(),
					pageSize: pageSize.toString(),
				};
				if (dateFrom) params.dateFrom = dateFrom;
				if (dateTo) params.dateTo = dateTo;

				return {
					url: "",
					params,
				};
			},
			providesTags: ["Button"],
		}),

		getButton: builder.query<Button, number>({
			query: (id) => `/${id}`,
			providesTags: (_, __, id) => [{ type: "Button", id }],
		}),

		createButton: builder.mutation<Button, CreateButtonDto>({
			query: (newButton) => ({
				url: "",
				method: "POST",
				body: newButton,
			}),
			invalidatesTags: ["Button"],
		}),

		updateButton: builder.mutation<
			Button,
			{ id: number; data: UpdateButtonDto }
		>({
			query: ({ id, data }) => ({
				url: `/${id}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: (_, __, { id }) => [{ type: "Button", id }],
		}),

		deleteButton: builder.mutation<void, number>({
			query: (id) => ({
				url: `/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Button"],
		}),

		incrementClick: builder.mutation<Button, number>({
			query: (id) => ({
				url: `/${id}/click`,
				method: "POST",
			}),
			invalidatesTags: (_, __, id) => [{ type: "Button", id }],
		}),

		getClickStats: builder.query<ButtonStats[], void>({
			query: () => "/stats/clicks",
			providesTags: ["Button"],
		}),

		getTopButtons: builder.query<Button[], GetTopButtonsParams>({
			query: ({ limit = 5, dateFrom, dateTo } = {}) => {
				const params: Record<string, string> = {
					pageSize: limit.toString(),
					page: "1",
				};
				if (dateFrom) params.dateFrom = dateFrom;
				if (dateTo) params.dateTo = dateTo;

				return {
					url: "",
					params,
				};
			},
			transformResponse: (response: ButtonsResponse) =>
				response.data.sort((a, b) => b.clickCount - a.clickCount),
			providesTags: ["Button"],
		}),
	}),
});

export const {
	useGetButtonsQuery,
	useGetButtonQuery,
	useCreateButtonMutation,
	useUpdateButtonMutation,
	useDeleteButtonMutation,
	useIncrementClickMutation,
	useGetClickStatsQuery,
	useGetTopButtonsQuery,
} = buttonsApi;
