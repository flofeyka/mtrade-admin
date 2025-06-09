import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { PeriodType } from "../../../components/shared/dashboard/DashboardPeriod";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import { ContainerLoader } from "../../../components/shared/Loader";
import { RequestForm } from "../../../components/shared/requests/RequestForm";
import { RequestRow } from "../../../components/shared/requests/RequestRow";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Request } from "../../../store/api/requestsApi";
import { useGetRequestsQuery } from "../../../store/api/requestsApi";
import { getDateRange } from "../../../utils/dateUtils";

export default function Requests() {
	const [search, setSearch] = useState<string>("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [showForm, setShowForm] = useState(false);
	const [editingRequest, setEditingRequest] = useState<Request | null>(null);
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

	// Дебаунс поиска на 500мс
	const debouncedSearch = useDebounce(search, 500);

	const dateRange = getDateRange(selectedPeriod, selectedMonth);

	// Обработчик изменения периода
	const handlePeriodChange = (period: PeriodType, month?: string) => {
		setSelectedPeriod(period);
		setSelectedMonth(month || null);
	};

	const { data, error, isLoading, refetch } = useGetRequestsQuery({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch.trim() || undefined,
		dateFrom: dateRange.dateFrom,
		dateTo: dateRange.dateTo,
	});

	// Сброс страницы при изменении pageSize, поиска, периода или месяца
	useEffect(() => {
		setCurrentPage(1);
	}, [pageSize, debouncedSearch, selectedPeriod, selectedMonth]);

	const handleEdit = (request: Request) => {
		setEditingRequest(request);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingRequest(null);
	};

	const handleSuccess = () => {
		refetch();
	};

	const handleRefresh = async () => {
		try {
			await refetch().unwrap();
			toast.success("Данные обновлены!");
		} catch (error) {
			toast.error("Ошибка обновления данных");
		}
	};

	const handleAddNew = () => {
		setEditingRequest(null);
		setShowForm(true);
	};

	if (isLoading) {
		return <ContainerLoader text="Загрузка заявок..." className="h-64" />;
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-64 space-y-4">
				<div className="text-lg text-red-500">Ошибка загрузки заявок</div>
				<button
					onClick={handleRefresh}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Попробовать снова
				</button>
			</div>
		);
	}

	const requests = data?.requests || [];
	const totalPages = data?.totalPages || 1;

	return (
		<div>
			<header className="flex justify-between items-center mb-4">
				<DashboardPeriod
					search={search}
					setSearch={setSearch}
					selectedPeriod={selectedPeriod}
					onPeriodChange={handlePeriodChange}
				/>
			</header>

			<main>
				<button
					onClick={handleAddNew}
					className="px-4 flex justify-self-end mb-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
				>
					Добавить заявку
				</button>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex w-full border-[#00000033]">
						{[
							"ID заявки",
							"Дата и время",
							"Имя и фамилия",
							"Номер",
							"Почта",
							"Телеграм",
							"Партнерский код",
							"Источник",
							"Статус",
							"Действия",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[260px] border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 9 ? "border-r-2 " : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{requests.length === 0 ? (
						<div className="py-8 text-center">
							<div className="sticky left-1/2 transform -translate-x-1/2 text-gray-500 inline-block">
								{debouncedSearch
									? "По вашему запросу ничего не найдено"
									: "Заявки не найдены"}
							</div>
						</div>
					) : (
						requests.map((request: Request) => (
							<RequestRow
								key={request.id}
								request={request}
								onEdit={handleEdit}
							/>
						))
					)}
				</div>

				{/* Пагинация */}
				<div className="flex justify-between items-center mt-4">
					<div className="flex items-center gap-4">
						<span className="text-lg">
							Отображается {requests.length} из {data?.total || 0}
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

			{/* Модальное окно формы */}
			{showForm && (
				<div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<RequestForm
							onClose={handleCloseForm}
							onSuccess={handleSuccess}
							editingRequest={editingRequest}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
