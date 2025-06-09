import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Request {
	id: number;
	fullName: string;
	phone: string;
	email: string;
	telegram?: string;
	partnerCode?: string;
	source: string;
	status: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS";
	createdAt: string;
	updatedAt: string;
}

export interface CreateRequestDto {
	fullName: string;
	phone: string;
	email: string;
	telegram?: string;
	partnerCode?: string;
	source: string;
	status?: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS";
}

export interface UpdateRequestDto {
	fullName?: string;
	phone?: string;
	email?: string;
	telegram?: string;
	partnerCode?: string;
	source?: string;
	status?: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS";
}

export interface RequestsResponse {
	requests: Request[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface RequestStats {
	pending: number;
	approved: number;
	rejected: number;
	inProgress: number;
}

export const requestsApi = createApi({
	reducerPath: "requestsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_PUBLIC_API_URL}`,
	}),
	tagTypes: ["Request"],
	endpoints: (builder) => ({
		getRequests: builder.query<
			RequestsResponse,
			{
				page?: number;
				limit?: number;
				status?: string;
				source?: string;
				search?: string;
				dateFrom?: string;
				dateTo?: string;
			}
		>({
			query: ({
				page = 1,
				limit = 10,
				status,
				source,
				search,
				dateFrom,
				dateTo,
			}) => {
				const params = new URLSearchParams({
					page: page.toString(),
					limit: limit.toString(),
				});

				if (status) params.append("status", status);
				if (source) params.append("source", source);
				if (search) params.append("search", search);
				if (dateFrom) params.append("dateFrom", dateFrom);
				if (dateTo) params.append("dateTo", dateTo);

				return `requests?${params.toString()}`;
			},
			providesTags: ["Request"],
		}),

		getRequestById: builder.query<Request, number>({
			query: (id) => `requests/${id}`,
			providesTags: (_result, _error, id) => [{ type: "Request", id }],
		}),

		createRequest: builder.mutation<Request, CreateRequestDto>({
			query: (newRequest) => ({
				url: "requests",
				method: "POST",
				body: newRequest,
			}),
			invalidatesTags: ["Request"],
		}),

		updateRequest: builder.mutation<
			Request,
			{ id: number; request: UpdateRequestDto }
		>({
			query: ({ id, request }) => ({
				url: `requests/${id}`,
				method: "PATCH",
				body: request,
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: "Request", id }],
		}),

		deleteRequest: builder.mutation<void, number>({
			query: (id) => ({
				url: `requests/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Request"],
		}),

		searchByPartnerCode: builder.query<
			RequestsResponse,
			{
				partnerCode: string;
				page?: number;
				limit?: number;
			}
		>({
			query: ({ partnerCode, page = 1, limit = 10 }) => {
				const params = new URLSearchParams({
					page: page.toString(),
					limit: limit.toString(),
				});
				return `requests/partner/${partnerCode}?${params.toString()}`;
			},
			providesTags: ["Request"],
		}),

		getRequestStats: builder.query<RequestStats, void>({
			query: () => "requests/stats",
			providesTags: ["Request"],
		}),
	}),
});

export const {
	useGetRequestsQuery,
	useGetRequestByIdQuery,
	useCreateRequestMutation,
	useUpdateRequestMutation,
	useDeleteRequestMutation,
	useSearchByPartnerCodeQuery,
	useGetRequestStatsQuery,
} = requestsApi;
