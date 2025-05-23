import React, { useEffect } from "react";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

interface ButtonStats {
	id: string;
	name: string;
	clicks: number;
	totalRequests: number;
	totalPayments: number;
	requestConversion: number; // в %
	paymentConversion: number; // в %
}

export default function Analytics() {
	const [search, setSearch] = React.useState<string>("");
	const [analytics, setAnalytics] = React.useState<ButtonStats[]>([]);

	useEffect(() => {
		setAnalytics([
			{
				id: "BTN-001",
				name: "Купить курс",
				clicks: 540,
				totalRequests: 135,
				totalPayments: 89,
				requestConversion: 25.0,
				paymentConversion: 16.5,
			},
			{
				id: "BTN-002",
				name: "Попробовать бесплатно",
				clicks: 760,
				totalRequests: 302,
				totalPayments: 110,
				requestConversion: 39.7,
				paymentConversion: 14.5,
			},
			{
				id: "BTN-003",
				name: "Узнать больше",
				clicks: 220,
				totalRequests: 33,
				totalPayments: 5,
				requestConversion: 15.0,
				paymentConversion: 2.3,
			},
		]);
	}, []);

	return (
		<div>
			<header>
				<DashboardPeriod search={search} setSearch={setSearch} />
			</header>

			<main>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex border-b-2 border-[#00000033]">
						{[
							"ID кнопки",
							"Название кнопки",
							"Количество кликов",
							"Всего заявок",
							"Всего оплат",
							"Конверсия в заявки",
							"Конверсия в оплаты",
						].map((header, index) => (
							<span
								key={index}
								className={`w-[260px] break-all text-center py-6.5 ${
									index < 8 ? "border-r-2 border-[#00000033]" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{analytics.map((btn) => (
						<div key={btn.id} className="flex border-b border-gray-200 text-sm">
							<span className="w-[220px] text-center py-4 border-r-2 border-[#00000033]">
								{btn.id}
							</span>
							<span className="w-[220px] text-center py-4 border-r-2 border-[#00000033]">
								{btn.name}
							</span>
							<span className="w-[220px] text-center py-4 border-r-2 border-[#00000033]">
								{btn.clicks}
							</span>
							<span className="w-[220px] text-center py-4 border-r-2 border-[#00000033]">
								{btn.totalRequests}
							</span>
							<span className="w-[220px] text-center py-4 border-r-2 border-[#00000033]">
								{btn.totalPayments}
							</span>
							<span className="w-[220px] text-center py-4 border-r-2 border-[#00000033]">
								{btn.requestConversion.toFixed(1)}%
							</span>
							<span className="w-[220px] text-center py-4">
								{btn.paymentConversion.toFixed(1)}%
							</span>
						</div>
					))}
				</div>
				<div className="flex justify-between text-3xl">
					<span>
						Отображается {analytics.length} из {analytics.length}
					</span>
					<span className="flex gap-3">
						<span>1</span>
						<span>2</span>
						<span>3</span>
					</span>
				</div>
			</main>
		</div>
	);
}
