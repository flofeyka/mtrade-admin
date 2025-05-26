import React, { useEffect } from "react";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

interface Partner {
	id: string;
	createdAt: string;
	name: string;
	telegram: string;
	payoutMethod: string;
	totalReferrals: number;
	totalWithdrawals: number;
	bonusStatus: string;
	partnerCode: string;
	referredUsers: string[]; // список имён или id
}

export default function Partners() {
	const [search, setSearch] = React.useState<string>("");
	const [partners, setPartners] = React.useState<Partner[]>([]);

	useEffect(() => {
		setPartners([
			{
				id: "BONUS-001",
				createdAt: "2025-05-10 14:23",
				name: "Иван Сергеев",
				telegram: "@ivan_s",
				payoutMethod: "Карта: 5469 **** **** 1234",
				totalReferrals: 8,
				totalWithdrawals: 2,
				bonusStatus: "Ожидает",
				partnerCode: "PART-1001",
				referredUsers: ["usr_0123", "usr_0456", "usr_0678"],
			},
			{
				id: "BONUS-002",
				createdAt: "2025-05-11 10:01",
				name: "Мария Исаева",
				telegram: "@misaeva",
				payoutMethod: "ЮMoney: misaeva@yoomoney.ru",
				totalReferrals: 12,
				totalWithdrawals: 4,
				bonusStatus: "Выплачен",
				partnerCode: "PART-1002",
				referredUsers: ["usr_1234", "usr_5678"],
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
					<div className="flex">
						{[
							"ID",
							"Дата и время",
							"Имя",
							"Телеграм ник",
							"Способ выплаты и реквизиты",
							"Всего партнеров пригласил",
							"Всего выводов",
							"Статус бонуса",
							"Партнерский код",
							"Список партнеров",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[240px]  border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 9 ? "border-r-2 border-[#00000033]" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{partners.map((bonus) => (
						<div
							key={bonus.id}
							className="flex border-b border-gray-200 text-sm"
						>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.id}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.createdAt}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.name}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.telegram}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.payoutMethod}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.totalReferrals}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.totalWithdrawals}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.bonusStatus}
							</span>
							<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
								{bonus.partnerCode}
							</span>
							<span className="min-w-[240px] text-center py-4 break-all">
								{bonus.referredUsers.join(", ")}
							</span>
						</div>
					))}
				</div>
				<div className="flex justify-between text-3xl">
					<span>
						Отображается {partners.length} из {partners.length}
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
