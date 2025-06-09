import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Visitor {
	id: string;
	trafficSource: string;
	utmTags?: string;
	country: string;
	device: string;
	browser: string;
	pagesViewed: number;
	timeOnSite: string;
	cookieFile: string;
	createdAt: string;
	updatedAt: string;
}

interface VisitorsListResponse {
	visitors: Visitor[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateVisitorDto {
	trafficSource: string;
	utmTags?: string;
	country: string;
	device: string;
	browser: string;
	pagesViewed?: number;
	timeOnSite: string;
	cookieFile: string;
}

export interface UpdateVisitorDto {
	trafficSource?: string;
	utmTags?: string;
	country?: string;
	device?: string;
	browser?: string;
	pagesViewed?: number;
	timeOnSite?: string;
	cookieFile?: string;
}

interface VisitorFilters {
	page?: number;
	limit?: number;
	country?: string;
	device?: string;
	browser?: string;
	trafficSource?: string;
}

interface VisitorStats {
	[key: string]: number;
}

export const visitorsApi = createApi({
	reducerPath: "visitorsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_PUBLIC_API_URL}`,
	}),
	tagTypes: ["Visitor"],
	endpoints: (builder) => ({
		getVisitors: builder.query<VisitorsListResponse, VisitorFilters | void>({
			query: (filters) => {
				const filterParams = filters || {};
				const params = new URLSearchParams();
				Object.entries(filterParams).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						params.append(key, value.toString());
					}
				});
				return `visitors?${params.toString()}`;
			},
			providesTags: ["Visitor"],
		}),
		getVisitor: builder.query<Visitor, string>({
			query: (id) => `visitors/${id}`,
			providesTags: (_, __, id) => [{ type: "Visitor", id }],
		}),
		searchVisitorsByCountry: builder.query<Visitor[], string>({
			query: (country) => `visitors/search/country/${country}`,
		}),
		searchVisitorsByTrafficSource: builder.query<Visitor[], string>({
			query: (trafficSource) =>
				`visitors/search/traffic-source/${trafficSource}`,
		}),
		getVisitorStatsByCountry: builder.query<VisitorStats, void>({
			query: () => "visitors/stats/country",
		}),
		getVisitorStatsByDevice: builder.query<VisitorStats, void>({
			query: () => "visitors/stats/device",
		}),
		getVisitorStatsByBrowser: builder.query<VisitorStats, void>({
			query: () => "visitors/stats/browser",
		}),
		createVisitor: builder.mutation<Visitor, CreateVisitorDto>({
			query: (visitor) => ({
				url: "visitors",
				method: "POST",
				body: visitor,
			}),
			invalidatesTags: ["Visitor"],
		}),
		updateVisitor: builder.mutation<
			Visitor,
			{ id: string; visitor: UpdateVisitorDto }
		>({
			query: ({ id, visitor }) => ({
				url: `visitors/${id}`,
				method: "PATCH",
				body: visitor,
			}),
			invalidatesTags: (_, __, { id }) => [{ type: "Visitor", id }],
		}),
		deleteVisitor: builder.mutation<Visitor, string>({
			query: (id) => ({
				url: `visitors/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Visitor"],
		}),
	}),
});

export const {
	useGetVisitorsQuery,
	useGetVisitorQuery,
	useSearchVisitorsByCountryQuery,
	useSearchVisitorsByTrafficSourceQuery,
	useGetVisitorStatsByCountryQuery,
	useGetVisitorStatsByDeviceQuery,
	useGetVisitorStatsByBrowserQuery,
	useCreateVisitorMutation,
	useUpdateVisitorMutation,
	useDeleteVisitorMutation,
} = visitorsApi;
