import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import DashboardLayout from "./pages/dashboard/layout";
import Statistics from "./pages/dashboard/stats/Statistics";
import Requests from "./pages/dashboard/requests/Requests";
import Payments from "./pages/dashboard/payments/Payments";

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
						<Route path="/dashboard/payments" element={<Payments />} />
					</Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
