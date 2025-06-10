import React, { useEffect } from "react";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import { useDebounce } from "../../../hooks/useDebounce";

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
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [pageSize, setPageSize] = React.useState<number>(10);
	const [clients, setClients] = React.useState<Client[]>([]);

	// Дебаунс поиска на 500мс
	const debouncedSearch = useDebounce(search, 500);

	useEffect(() => {
		// Генерируем больше тестовых данных для демонстрации пагинации
		const testClients = [];
		const names = [
			"Алексей Новиков",
			"Екатерина Миронова",
			"Сергей Волков",
			"Анна Петрова",
			"Дмитрий Иванов",
			"Мария Козлова",
			"Павел Смирнов",
			"Елена Федорова",
		];
		const subscriptions = ["Pro", "Basic", "Free Trial", "Premium"];

		for (let i = 1; i <= 25; i++) {
			testClients.push({
				id: `CL-${String(i).padStart(4, "0")}`,
				fullName: names[i % names.length],
				telegram: `@user${i} (+7 9${String(i).padStart(2, "0")} ${Math.floor(
					Math.random() * 900 + 100
				)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(
					Math.random() * 90 + 10
				)})`,
				email: `user${i}@example.com`,
				subscriptionType: subscriptions[i % subscriptions.length],
				subscriptionEnd: `${String(Math.floor(Math.random() * 28) + 1).padStart(
					2,
					"0"
				)}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2025`,
				invoiceNumber: `INV-${10000 + i}`,
				partnerCode: `PART-${1000 + (i % 10)}`,
			});
		}

		setClients(testClients);
	}, []);

	// Фильтрация по поиску
	const filteredClients = clients.filter((client) => {
		if (!debouncedSearch) return true;
		const searchLower = debouncedSearch.toLowerCase();
		return (
			client.fullName.toLowerCase().includes(searchLower) ||
			client.email.toLowerCase().includes(searchLower) ||
			client.telegram.toLowerCase().includes(searchLower) ||
			client.id.toLowerCase().includes(searchLower) ||
			client.subscriptionType.toLowerCase().includes(searchLower) ||
			client.partnerCode.toLowerCase().includes(searchLower)
		);
	});

	// Фейковая пагинация для демонстрации
	const totalPages = Math.ceil(filteredClients.length / pageSize);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedClients = filteredClients.slice(startIndex, endIndex);

	// Сброс страницы при изменении pageSize или поиска
	useEffect(() => {
		setCurrentPage(1);
	}, [pageSize, debouncedSearch]);

	return (
		<div>
			<header>
				<DashboardPeriod search={search} setSearch={setSearch} />
			</header>

			<main>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex">
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
								className={`min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 8 ? "border-r-2 border-[#00000033]" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{paginatedClients.length === 0 ? (
						<div className="py-8 text-center">
							<div className="sticky left-1/2 transform -translate-x-1/2 text-gray-500 inline-block">
								{debouncedSearch
									? "По вашему запросу ничего не найдено"
									: "Клиенты не найдены"}
							</div>
						</div>
					) : (
						paginatedClients.map((client) => (
							<div key={client.id} className="flex text-sm">
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4 border-r-2">
									{client.id}
								</span>
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4 border-r-2">
									{client.fullName}
								</span>
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4 border-r-2">
									{client.telegram}
								</span>
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4 border-r-2">
									{client.email}
								</span>
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4 border-r-2">
									{client.subscriptionType}
								</span>
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4 border-r-2">
									{client.subscriptionEnd}
								</span>
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4 border-r-2">
									{client.invoiceNumber}
								</span>
								<span className="min-w-[240px] border-b-2 border-[#00000033] text-center py-4">
									{client.partnerCode}
								</span>
							</div>
						))
					)}
				</div>
				{/* Пагинация */}
				<div className="flex justify-between items-center mt-4 max-[762px]:flex-col">
					<div className="flex items-center gap-4">
						<span className="text-lg">
							Отображается {paginatedClients.length} из {filteredClients.length}
						</span>
						<div className="flex items-center gap-2">
							<label className="text-sm">Записей на странице:</label>
							<select
								value={pageSize}
								onChange={(e) => setPageSize(Number(e.target.value))}
								className="px-2 py-1 border border-gray-300 rounded text-sm"
							>
								<option value={10}>10</option>
								<option value={20}>20</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Назад
						</button>
						<div className="flex gap-1">
							{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
								let page;
								if (totalPages <= 5) {
									page = i + 1;
								} else if (currentPage <= 3) {
									page = i + 1;
								} else if (currentPage >= totalPages - 2) {
									page = totalPages - 4 + i;
								} else {
									page = currentPage - 2 + i;
								}

								return (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`px-3 py-1 rounded ${
											currentPage === page
												? "bg-blue-500 text-white"
												: "bg-gray-200 text-gray-700 hover:bg-gray-300"
										}`}
									>
										{page}
									</button>
								);
							})}
						</div>
						<button
							onClick={() =>
								setCurrentPage(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}
							className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Вперед
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
