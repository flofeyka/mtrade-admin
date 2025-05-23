import { Link } from "react-router-dom";
import Button from "../Button";

export default function DashboardHeader() {
	return (
		<header className="flex gap-6 items-center justify-between">
			<span className="bg-white flex relative rounded-xl border-[#0000008F] border-2">
				<Link
					to="/dashboard/statistics"
					className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3"
				>
					📊 Дашборд
				</Link>
				<Link
					to="/dashboard/requests"
					className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3"
				>
					📥 Заявки
				</Link>
				<Link
					to="/dashboard/payments"
					className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3"
				>
					💳 Оплаты
				</Link>
				<div className="border-r-2 w-[135px] text-center text-center cursor-pointer border-[#00000033] p-3">
					⚠️ Незав. <br /> оплаты
				</div>
				<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
					📈 Аналитика
				</div>
				<div className="border-r-2  w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
					👤 Клиенты
				</div>
				<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3 text-center">
					👥 <br /> Посетители
				</div>
				<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
					🤝 <br />
					Партнеры
				</div>
				<div className=" cursor-pointer w-[140px] text-center rounded-r-xl p-2 py-3">
					🔔 <br />
					Напоминания
				</div>
			</span>

			<span className="flex flex-col gap-3">
				<Button className="p-3 w-[180px]">👤 administrator</Button>
				<Button className="p-3 w-[180px]">🔔 Уведомления (2)</Button>
			</span>
		</header>
	);
}
