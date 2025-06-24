import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../../Button";

export default function DashboardHeader() {
	const navigate = useNavigate();
	const location = useLocation();

	const links = [
		["📊", "Дашборд", "/dashboard/statistics"],
		["📥", "Заявки", "/dashboard/requests"],
		["👥", "Посетители", "/dashboard/visitors"],
		["🤝", "Партнеры", "/dashboard/partners"],
		["🔔", "Напоминания", "/dashboard/reminders"],
	];

	const handleMobileNav = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		if (value) navigate(value);
	};

	return (
		<header className="grid w-full gap-6 max-sm:grid-rows-2 max-sm:grid-cols-1 sm:grid-cols-[1fr_auto] sm:grid-rows-1 items-start">
			{/* Навигация на десктопе */}
			<span
				className="hidden sm:grid w-full bg-white rounded-xl border border-[#0000008F] overflow-hidden 
               sm:grid-cols-[repeat(auto-fit,minmax(125px,1fr))]"
			>
				{links.map(([icon, label, href]) => {
					const isActive = location.pathname === href;
					return (
						<Link
							key={href}
							to={href}
							className={`p-4 text-center text-sm border-r border-b border-[#00000033] ${
								isActive ? "bg-gray-200" : "hover:bg-gray-100"
							} transition-colors duration-200`}
							dangerouslySetInnerHTML={{ __html: `${icon} <br /> ${label}` }}
						/>
					);
				})}
			</span>

			{/* Выпадающий список на мобильных */}
			<select
				onChange={handleMobileNav}
				className="sm:hidden w-full p-3 rounded-lg border border-[#0000008F] bg-white text-sm"
				defaultValue=""
			>
				<option value="" disabled>
					📂 Навигация
				</option>
				{links.map(([icon, label, href]) => (
					<option key={href} value={href}>
						{icon} {label.replace(/<br\s*\/?>/g, " ")}
					</option>
				))}
			</select>

			{/* Правая часть — кнопки администратора */}
			<span className="flex flex-col gap-3 sm:w-[200px] max-sm:w-full">
				<Button className="p-3 w-full">👤 administrator</Button>
				<Button className="p-3 w-full">🔔 Уведомления (2)</Button>
			</span>
		</header>
	);
}
