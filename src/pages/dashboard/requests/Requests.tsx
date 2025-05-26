import React, { useEffect } from "react";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

interface RequestData {
	id: string; // Идентификатор заявки
	datetime: string; // Дата и время
	fullName: string; // Имя и фамилия
	phone: string; // Номер телефона
	email: string; // Электронная почта
	telegram: string; // Ник в Telegram
	partnerCode: string; // Партнёрский код
	source: string; // Источник (кнопка)
	status: "Новая" | "В работе" | "Завершена" | "Отклонена"; // Статус заявки
}

export default function Requests() {
	const [search, setSearch] = React.useState<string>("");
	const [requests, setRequests] = React.useState<RequestData[]>([]);

	useEffect(() => {
		setRequests([
			{
				id: "REQ-20240523-001",
				datetime: "23.05.2025 14:32",
				fullName: "Иван Петров",
				phone: "+7 912 345-67-89",
				email: "ivan.petrov@example.com",
				telegram: "@ivanpetrov",
				partnerCode: "PART-1234",
				source: "Кнопка “Оставить заявку”",
				status: "Новая",
			},
			{
				id: "REQ-20240523-002",
				datetime: "23.05.2025 14:47",
				fullName: "Мария Смирнова",
				phone: "+7 916 123-45-67",
				email: "m.smirnova@mail.ru",
				telegram: "@msmirnova",
				partnerCode: "PART-5678",
				source: "Кнопка “Связаться”",
				status: "В работе",
			},
			{
				id: "REQ-20240523-003",
				datetime: "23.05.2025 15:02",
				fullName: "Алексей Волков",
				phone: "+7 903 987-65-43",
				email: "a.volkov@yandex.ru",
				telegram: "@alexvolk",
				partnerCode: "PART-9012",
				source: "Кнопка “Оставить заявку”",
				status: "Завершена",
			},
			{
				id: "REQ-20240523-004",
				datetime: "23.05.2025 15:15",
				fullName: "Ольга Сидорова",
				phone: "+7 905 321-12-34",
				email: "olga.sid@example.com",
				telegram: "@osidorova",
				partnerCode: "",
				source: "Кнопка “Узнать больше”",
				status: "Отклонена",
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
					<div className="flex border-b-2 w-full border-[#00000033]">
						{[
							"ID заявки",
							"Дата и время",
							"Имя и фамилия",
							"Номер",
							"Почта",
							"Телеграм",
							"Партнерский код",
							"Источник (кнопка)",
							"Статус",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[260px] break-all text-center py-6.5 ${
									index < 8 ? "border-r-2 border-[#00000033]" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{requests.map((req: RequestData) => (
						<div key={req.id} className="flex border-b border-gray-200 text-sm">
							<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{req.id}
							</span>
							<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{req.datetime}
							</span>
							<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{req.fullName}
							</span>
							<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{req.phone}
							</span>
							<span className="min-w-[260px] break-all text-center py-4 border-r-2 border-[#00000033]">
								{req.email}
							</span>
							<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{req.telegram}
							</span>
							<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{req.partnerCode}
							</span>
							<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{req.source}
							</span>
							<span className="min-w-[260px] text-center py-4">
								{req.status}
							</span>
						</div>
					))}
				</div>
				<div className="flex justify-between text-3xl max-sm:text-xl">
					<span>
						Отображается {requests.length} из {requests.length}
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
