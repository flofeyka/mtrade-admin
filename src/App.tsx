import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Clients from "./pages/dashboard/clients/Clients";
import DashboardLayout from "./pages/dashboard/layout";
import Partners from "./pages/dashboard/partners/Partners";
import Payments from "./pages/dashboard/payments/Payments";
import Reminders from "./pages/dashboard/reminders/Reminders";
import Requests from "./pages/dashboard/requests/Requests";
import Statistics from "./pages/dashboard/stats/Statistics";
import Visitors from "./pages/dashboard/visitors/Visitors";

function App() {
	return (
		<BrowserRouter>
			<div className="bg-black text-[#000000CC] font-[500]">
				<Routes>
					<Route path="*" element={<Navigate to="/sign-in" />} />
					<Route path="/sign-in" element={<Auth />} />
					<Route element={<DashboardLayout />}>
						<Route
							path="/dashboard/*"
							element={<Navigate to="/dashboard/statistics" />}
						/>
						<Route path="/dashboard/statistics" element={<Statistics />} />
						<Route path="/dashboard/requests" element={<Requests />} />
						<Route
							path="/dashboard/payments"
							element={<Payments status="COMPLETED" />}
						/>
						<Route
							path="/dashboard/not-completed-payments"
							element={<Payments status="PENDING" />}
						/>
						<Route path="/dashboard/clients" element={<Clients />} />
						<Route path="/dashboard/visitors" element={<Visitors />} />
						<Route path="/dashboard/partners" element={<Partners />} />
						<Route path="/dashboard/reminders" element={<Reminders />} />
					</Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
