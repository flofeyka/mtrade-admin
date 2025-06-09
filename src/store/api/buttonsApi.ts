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

export const buttonsApi = createApi({
	reducerPath: "buttonsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_PUBLIC_API_URL}/buttons`,
	}),
	tagTypes: ["Button"],
	endpoints: (builder) => ({
		getButtons: builder.query<
			ButtonsResponse,
			{ page?: number; pageSize?: number }
		>({
			query: ({ page = 1, pageSize = 10 } = {}) => ({
				url: "",
				params: { page, pageSize },
			}),
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

		getTopButtons: builder.query<Button[], { limit?: number }>({
			query: ({ limit = 5 } = {}) => ({
				url: "",
				params: { pageSize: limit, page: 1 },
			}),
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
