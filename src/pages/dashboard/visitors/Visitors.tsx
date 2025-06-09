import React, { useState } from "react";
import { toast } from "react-toastify";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import type { PeriodType } from "../../../components/shared/dashboard/DashboardPeriod";
import { ContainerLoader } from "../../../components/shared/Loader";
import { useGetVisitorsQuery } from "../../../store/api/visitorsApi";
import type { Visitor } from "../../../store/api/visitorsApi";
import VisitorForm from "../../../components/shared/visitors/VisitorForm";
import VisitorRow from "../../../components/shared/visitors/VisitorRow";
import { useDebounce } from "../../../hooks/useDebounce";
import { getDateRange } from "../../../utils/dateUtils";

export default function Visitors() {
	const [search, setSearch] = React.useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [showForm, setShowForm] = useState<boolean>(false);
	const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
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

	const { data, error, isLoading, refetch } = useGetVisitorsQuery({
		page: currentPage,
		limit: pageSize,
		search: debouncedSearch.trim() || undefined,
		dateFrom: dateRange.dateFrom,
		dateTo: dateRange.dateTo,
	});

	const visitors = data?.visitors || [];
	const total = data?.total || 0;
	const totalPages = data?.totalPages || 1;

	// Сброс страницы при изменении поиска, периода или месяца
	React.useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch, selectedPeriod, selectedMonth]);

	const handleOpenForm = () => {
		setShowForm(true);
		setEditingVisitor(null);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingVisitor(null);
	};

	const handleFormSuccess = () => {
		refetch(); // Обновляем данные после успешного создания/обновления
	};

	const handleRefresh = async () => {
		try {
			await refetch().unwrap();
			toast.success("Данные обновлены!");
		} catch (error) {
			toast.error("Ошибка обновления данных");
		}
	};

	const handleEditVisitor = (visitor: Visitor) => {
		setEditingVisitor(visitor);
		setShowForm(true);
	};

	if (isLoading) {
		return <ContainerLoader text="Загрузка посетителей..." className="h-64" />;
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-64 space-y-4">
				<div className="text-lg text-red-500">Ошибка загрузки данных</div>
				<button
					onClick={handleRefresh}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Попробовать снова
				</button>
			</div>
		);
	}

	return (
		<div>
			<header>
				<DashboardPeriod
					search={search}
					setSearch={setSearch}
					selectedPeriod={selectedPeriod}
					onPeriodChange={handlePeriodChange}
				/>
			</header>

			<main>
				{/* Кнопка добавления посетителя */}
				<div className="mb-4 flex justify-end">
					<button
						onClick={handleOpenForm}
						className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						+ Добавить посетителя
					</button>
				</div>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex">
						{[
							"ID",
							"Источник трафика",
							"UTM-метки",
							"Страна",
							"Устройство",
							"Браузер",
							"Просмотрено страниц",
							"Время на сайте",
							"Файл с Cookie",
							"Дата и время",
							"Действия",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 10 ? "border-r-2" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{visitors.length === 0 && !isLoading ? (
						<div className="py-8 text-center">
							<div className="sticky left-1/2 transform -translate-x-1/2 text-gray-500 inline-block">
								{debouncedSearch
									? "По вашему запросу ничего не найдено"
									: "Посетители не найдены"}
							</div>
						</div>
					) : (
						visitors.map((visitor) => (
							<VisitorRow
								key={visitor.id}
								visitor={visitor}
								onEdit={handleEditVisitor}
								onRefresh={refetch}
							/>
						))
					)}
				</div>

				{/* Пагинация */}
				<div className="flex justify-between items-center mt-4">
					<div className="flex items-center gap-4">
						<span className="text-lg">
							Отображается {visitors.length} из {total}
						</span>
						<div className="flex items-center gap-2">
							<label className="text-sm">Записей на странице:</label>
							<select
								value={pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));
									setCurrentPage(1); // Сбрасываем на первую страницу
								}}
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

				{/* Модальное окно с формой */}
				<VisitorForm
					isOpen={showForm}
					onClose={handleCloseForm}
					onSuccess={handleFormSuccess}
					visitor={editingVisitor}
				/>
			</main>
		</div>
	);
}
