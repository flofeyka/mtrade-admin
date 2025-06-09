import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Partner {
	id: number;
	name: string;
	username: string;
	requisites: string;
	requisiteType: "Card" | "Yoomoney";
	bonusStatus: "PENDING" | "COMPLETED";
	code: string;
	createdAt: string;
	users?: User[];
}

interface User {
	id: number;
	firstName: string;
	lastName?: string;
	username: string;
	phone: string;
	email: string;
}

interface PartnersListResponse {
	partners: Partner[];
	total: number;
}

export interface CreatePartnerDto {
	name: string;
	username: string;
	requisites: string;
	requisiteType: "Card" | "Yoomoney";
	bonusStatus: "PENDING" | "COMPLETED";
	code: string;
}

export interface UpdatePartnerDto {
	name?: string;
	username?: string;
	requisites?: string;
	requisiteType?: "Card" | "Yoomoney";
	bonusStatus?: "PENDING" | "COMPLETED";
	code?: string;
}

export interface FindPartnersParams {
	search?: string;
	dateFrom?: string;
	dateTo?: string;
}

export const partnersApi = createApi({
	reducerPath: "partnersApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_PUBLIC_API_URL}`,
	}),
	tagTypes: ["Partner"],
	endpoints: (builder) => ({
		getPartners: builder.query<PartnersListResponse, FindPartnersParams | void>(
			{
				query: (params) => {
					const searchParams = new URLSearchParams();
					if (params?.search) {
						searchParams.append("search", params.search);
					}
					if (params?.dateFrom) {
						searchParams.append("dateFrom", params.dateFrom);
					}
					if (params?.dateTo) {
						searchParams.append("dateTo", params.dateTo);
					}
					const queryString = searchParams.toString();
					return `partners${queryString ? `?${queryString}` : ""}`;
				},
				providesTags: ["Partner"],
			}
		),
		getPartner: builder.query<Partner, number>({
			query: (id) => `partners/${id}`,
			providesTags: (_, __, id) => [{ type: "Partner", id }],
		}),
		searchPartnerByCode: builder.query<Partner | null, string>({
			query: (code) => `partners/search/by-code?code=${code}`,
		}),
		searchPartnerByUsername: builder.query<Partner | null, string>({
			query: (username) => `partners/search/by-username?username=${username}`,
		}),
		createPartner: builder.mutation<Partner, CreatePartnerDto>({
			query: (partner) => ({
				url: "partners",
				method: "POST",
				body: partner,
			}),
			invalidatesTags: ["Partner"],
		}),
		updatePartner: builder.mutation<
			Partner,
			{ id: number; partner: UpdatePartnerDto }
		>({
			query: ({ id, partner }) => ({
				url: `partners/${id}`,
				method: "PATCH",
				body: partner,
			}),
			invalidatesTags: (_, __, { id }) => [{ type: "Partner", id }],
		}),
		deletePartner: builder.mutation<Partner, number>({
			query: (id) => ({
				url: `partners/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Partner"],
		}),
	}),
});

export const {
	useGetPartnersQuery,
	useGetPartnerQuery,
	useSearchPartnerByCodeQuery,
	useSearchPartnerByUsernameQuery,
	useCreatePartnerMutation,
	useUpdatePartnerMutation,
	useDeletePartnerMutation,
} = partnersApi;
