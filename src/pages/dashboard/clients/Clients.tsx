import React, { useEffect } from "react";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

interface Client {
	id: string;
	fullName: string;
	telegram: string;
	email: string;
	subscriptionType: string;
	subscriptionEnd: string;
	invoiceNumber: string;
	partnerCode: string;
}

export default function Clients() {
	const [search, setSearch] = React.useState<string>("");
	const [clients, setClients] = React.useState<Client[]>([]);

	useEffect(() => {
		setClients([
			{
				id: "CL-0001",
				fullName: "Алексей Новиков",
				telegram: "@anovikov (+7 901 123-45-67)",
				email: "a.novikov@example.com",
				subscriptionType: "Pro",
				subscriptionEnd: "23.06.2025",
				invoiceNumber: "INV-10234",
				partnerCode: "PART-4567",
			},
			{
				id: "CL-0002",
				fullName: "Екатерина Миронова",
				telegram: "@mironova (+7 903 222-33-44)",
				email: "katya.m@mail.ru",
				subscriptionType: "Free Trial",
				subscriptionEnd: "01.06.2025",
				invoiceNumber: "INV-10278",
				partnerCode: "PART-7890",
			},
			{
				id: "CL-0003",
				fullName: "Сергей Волков",
				telegram: "@svolkov (+7 925 555-66-77)",
				email: "s.volkov@yandex.ru",
				subscriptionType: "Basic",
				subscriptionEnd: "15.07.2025",
				invoiceNumber: "INV-10299",
				partnerCode: "PART-1234",
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
							"ID Клиента",
							"ФИО",
							"Телеграм (номер)",
							"Почта",
							"Тип подписки",
							"Конец подписки",
							"Номер счета",
							"Партнерский код",
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
					{clients.map((client) => (
						<div
							key={client.id}
							className="flex border-b border-gray-200 text-sm"
						>
							<span className="w-[240px] text-center py-4 border-r-2 border-[#00000033]">
								{client.id}
							</span>
							<span className="w-[240px] text-center py-4 border-r-2 border-[#00000033]">
								{client.fullName}
							</span>
							<span className="w-[240px] text-center py-4 border-r-2 border-[#00000033]">
								{client.telegram}
							</span>
							<span className="w-[240px] text-center py-4 border-r-2 border-[#00000033]">
								{client.email}
							</span>
							<span className="w-[240px] text-center py-4 border-r-2 border-[#00000033]">
								{client.subscriptionType}
							</span>
							<span className="w-[240px] text-center py-4 border-r-2 border-[#00000033]">
								{client.subscriptionEnd}
							</span>
							<span className="w-[240px] text-center py-4 border-r-2 border-[#00000033]">
								{client.invoiceNumber}
							</span>
							<span className="w-[240px] text-center py-4">
								{client.partnerCode}
							</span>
						</div>
					))}
				</div>
				<div className="flex justify-between text-3xl">
					<span>
						Отображается {clients.length} из {clients.length}
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
