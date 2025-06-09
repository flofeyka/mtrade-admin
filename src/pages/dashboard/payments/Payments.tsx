import React from "react";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import {
	useGetPaymentsQuery,
	useCreatePaymentMutation,
	type Payment,
	type CreatePaymentDto,
} from "../../../store/api/paymentsApi";
import { useDebounce } from "../../../hooks/useDebounce";
import Button from "../../../components/Button";

interface PaymentsProps {
	status?: "COMPLETED" | "PENDING";
}

export default function Payments({ status = "COMPLETED" }: PaymentsProps) {
	const [search, setSearch] = React.useState<string>("");
	const [currentPage, setCurrentPage] = React.useState(1);
	const pageSize = 10;

	// Дебаунс поиска на 500мс
	const debouncedSearch = useDebounce(search, 500);

	const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();

	// Сброс страницы при изменении поиска
	React.useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch]);

	const {
		data: paymentsData,
		isLoading,
		error,
	} = useGetPaymentsQuery({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch || undefined,
		status: status,
	});

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatAmount = (amount: number) => {
		return (amount / 100).toFixed(2); // Convert kopecks to rubles
	};

	const handleCreateTestPayment = async () => {
		try {
			const names = [
				"Иван Иванов",
				"Мария Петрова",
				"Сергей Сидоров",
				"Елена Козлова",
				"Андрей Новиков",
			];
			const products = [
				"Premium курс",
				"VIP подписка",
				"Индивидуальная консультация",
				"Базовый курс",
				"Мастер-класс",
			];
			const sources = [
				"Лендинг",
				"Реклама ВК",
				"Яндекс Директ",
				"Google Ads",
				"Органический поиск",
			];

			const testPayment: CreatePaymentDto = {
				fullName: names[Math.floor(Math.random() * names.length)],
				email: `test${Math.floor(Math.random() * 1000)}@example.com`,
				source: sources[Math.floor(Math.random() * sources.length)],
				product: products[Math.floor(Math.random() * products.length)],
				amount: Math.floor(Math.random() * 50000) + 1000, // Random amount from 10 to 500 rubles
				status: Math.random() > 0.5 ? "COMPLETED" : "PENDING",
			};

			await createPayment(testPayment).unwrap();
			alert("Тестовая оплата создана!");
		} catch (error) {
			console.error("Ошибка создания оплаты:", error);
			alert("Ошибка создания оплаты");
		}
	};

	if (error) {
		return (
			<div>
				<header>
					<DashboardPeriod search={search} setSearch={setSearch} />
				</header>
				<main>
					<div className="text-center py-8 text-red-500">
						Ошибка загрузки данных
					</div>
				</main>
			</div>
		);
	}

	return (
		<div>
			<header>
				<DashboardPeriod search={search} setSearch={setSearch} />
			</header>

			<main>
				{/* Временная кнопка добавления оплаты */}
				<div className="mb-4">
					<Button
						onClick={handleCreateTestPayment}
						disabled={isCreating}
						className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
					>
						{isCreating ? "Создается..." : "➕ Добавить тестовую оплату"}
					</Button>
				</div>

				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex">
						{[
							"ID Оплаты",
							"Дата и время",
							"Имя Фамилия",
							"Почта",
							"Источник (Кнопка)",
							"Продукт",
							"Сумма",
							"Промо-код",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[260px] border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 7 ? "border-r-2" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>

					{isLoading ? (
						<div className="flex w-full border-b border-gray-200 text-sm">
							<span className="w-full text-center py-8">
								{debouncedSearch ? "Поиск..." : "Загрузка..."}
							</span>
						</div>
					) : paymentsData && paymentsData.payments.length > 0 ? (
						paymentsData.payments.map((payment: Payment) => (
							<div
								key={payment.id}
								className="flex border-b border-gray-200 text-sm"
							>
								<span className="min-w-[260px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
									PAY-{payment.id}
								</span>
								<span className="min-w-[260px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
									{formatDateTime(payment.createdAt)}
								</span>
								<span className="min-w-[260px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
									{payment.fullName}
								</span>
								<span className="min-w-[260px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
									{payment.email}
								</span>
								<span className="min-w-[260px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
									{payment.source}
								</span>
								<span className="min-w-[260px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
									{payment.product}
								</span>
								<span className="min-w-[260px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
									{formatAmount(payment.amount)} ₽
								</span>
								<span className="min-w-[260px] text-center border-b-2 border-[#00000033] py-4">
									{payment.promoCode?.code || "—"}
								</span>
							</div>
						))
					) : (
						<div className="flex border-b border-gray-200 text-sm">
							<span className="min-w-[2080px] text-center py-8">
								{debouncedSearch
									? `Ничего не найдено по запросу "${debouncedSearch}"`
									: "Нет данных"}
							</span>
						</div>
					)}
				</div>

				<div className="flex justify-between text-3xl max-[762px]:text-xl mt-4">
					<span>
						Отображается {paymentsData?.payments.length || 0} из{" "}
						{paymentsData?.total || 0}
					</span>
					<span className="flex gap-3">
						<button
							onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1 || !paymentsData}
							className="disabled:opacity-50"
						>
							←
						</button>
						<span>{currentPage}</span>
						<button
							onClick={() =>
								setCurrentPage(
									Math.min(paymentsData?.totalPages || 1, currentPage + 1)
								)
							}
							disabled={
								currentPage === (paymentsData?.totalPages || 1) || !paymentsData
							}
							className="disabled:opacity-50"
						>
							→
						</button>
					</span>
				</div>
			</main>
		</div>
	);
}
