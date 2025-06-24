import { configureStore } from "@reduxjs/toolkit";
import { partnersApi } from "./api/partnersApi";
import { notificationsApi } from "./api/notificationsApi";
import { requestsApi } from "./api/requestsApi";
import { visitorsApi } from "./api/visitorsApi";
import { buttonsApi } from "./api/buttonsApi";

export const store = configureStore({
	reducer: {
		[partnersApi.reducerPath]: partnersApi.reducer,
		[notificationsApi.reducerPath]: notificationsApi.reducer,
		[requestsApi.reducerPath]: requestsApi.reducer,
		[visitorsApi.reducerPath]: visitorsApi.reducer,
		[buttonsApi.reducerPath]: buttonsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(partnersApi.middleware)
			.concat(notificationsApi.middleware)
			.concat(requestsApi.middleware)
			.concat(visitorsApi.middleware)
			.concat(buttonsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
