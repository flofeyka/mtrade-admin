import { useState } from "react";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

export default function Reminders() {
	const [search, setSearch] = useState<string>("");
	return (
		<div>
			<DashboardPeriod search={search} setSearch={setSearch} />
			<div className="flex gap-3">
				<button className="w-[200px] h-[200px] bg-[#FFFFFF] border-[#757575] border-3 rounded-md text-6xl cursor-pointer">
					+
				</button>

				<span className="w-[200px] h-[200px] bg-[#FFFFFF] border-[#757575] border-3 flex flex-col justify-between p-3 text-center rounded-md text-2xl cursor-pointer">
					<div>Хостинг робот</div>
					<div>Через 3 дня</div>
					<div>5$ - 13/04/25</div>
				</span>
			</div>
		</div>
	);
}
