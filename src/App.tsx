import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
	return (
		<BrowserRouter>
			<div className="bg-black text-[#000000CC] font-[500]">
				<Routes>
					<Route path="*" element={<Navigate to="/sign-in" />} />
					<Route path="/sign-in" element={<Auth />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
