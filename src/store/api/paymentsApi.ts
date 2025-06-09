import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Payment {
	id: number;
	fullName: string;
	email: string;
	source: string;
	product: string;
	amount: number;
	promoCodeId?: number | null;
	promoCode?: {
		id: number;
		code: string;
		discountPercent: number | null;
		discountAmount: number | null;
	} | null;
	status: "PENDING" | "COMPLETED";
	createdAt: string;
	updatedAt: string;
}

export interface PaymentsResponse {
	payments: Payment[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface PaymentStats {
	pending: number;
	completed: number;
	totalAmount: number;
}

export interface CreatePaymentDto {
	fullName: string;
	email: string;
	source: string;
	product: string;
	amount: number;
	promoCodeId?: number | null;
	status: "PENDING" | "COMPLETED";
}

export const paymentsApi = createApi({
	reducerPath: "paymentsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_PUBLIC_API_URL}/payments`,
	}),
	tagTypes: ["Payment"],
	endpoints: (builder) => ({
		getPayments: builder.query<
			PaymentsResponse,
			{
				page?: number;
				limit?: number;
				status?: "PENDING" | "COMPLETED";
				search?: string;
				dateFrom?: string;
				dateTo?: string;
			}
		>({
			query: ({
				page = 1,
				limit = 10,
				status,
				search,
				dateFrom,
				dateTo,
			} = {}) => ({
				url: "",
				params: { page, limit, status, search, dateFrom, dateTo },
			}),
			providesTags: ["Payment"],
		}),

		getPaymentStats: builder.query<
			PaymentStats,
			{
				dateFrom?: string;
				dateTo?: string;
			}
		>({
			query: ({ dateFrom, dateTo } = {}) => ({
				url: "/stats",
				params: { dateFrom, dateTo },
			}),
			providesTags: ["Payment"],
		}),

		getPayment: builder.query<Payment, number>({
			query: (id) => `/${id}`,
			providesTags: (_, __, id) => [{ type: "Payment", id }],
		}),

		createPayment: builder.mutation<Payment, CreatePaymentDto>({
			query: (payment) => ({
				url: "",
				method: "POST",
				body: payment,
			}),
			invalidatesTags: ["Payment"],
		}),
	}),
});

export const {
	useGetPaymentsQuery,
	useGetPaymentStatsQuery,
	useGetPaymentQuery,
	useCreatePaymentMutation,
} = paymentsApi;
