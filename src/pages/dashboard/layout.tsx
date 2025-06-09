import { Outlet } from "react-router-dom";
import DashboardHeader from "../../components/shared/dashboard/DashboardHeader";

export default function DashboardLayout() {
	return (
		<div className="min-h-screen h-full w-full p-10 max-sm:p-3 bg-[#B3B3B380] flex flex-col gap-10">
			<DashboardHeader />
			<Outlet />
		</div>
	);
}
