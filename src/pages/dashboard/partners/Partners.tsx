import React, { useState } from "react";
import { toast } from "react-toastify";
import DashboardPeriod, {
	type PeriodType,
} from "../../../components/shared/dashboard/DashboardPeriod";
import { ContainerLoader } from "../../../components/shared/Loader";
import { useGetPartnersQuery } from "../../../store/api/partnersApi";
import type { Partner } from "../../../store/api/partnersApi";
import PartnerForm from "../../../components/shared/partners/PartnerForm";
import PartnerRow from "../../../components/shared/partners/PartnerRow";
import { useDebounce } from "../../../hooks/useDebounce";
import { getDateRange } from "../../../utils/dateUtils";

export default function Partners() {
	const [search, setSearch] = React.useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [showForm, setShowForm] = useState<boolean>(false);
	const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

	// Дебаунс поиска на 500мс
	const debouncedSearch = useDebounce(search, 500);

	// Получаем диапазон дат для текущего периода
	const { dateFrom, dateTo } = getDateRange(selectedPeriod, selectedMonth);

	const { data, error, isLoading, refetch } = useGetPartnersQuery({
		search: debouncedSearch.trim() || undefined,
		dateFrom,
		dateTo,
	});

	const partners = data?.partners || [];
	const total = data?.total || 0;

	// Образная пагинация (пока нет поддержки на бекенде)
	const totalPages = Math.max(1, Math.ceil(partners.length / pageSize));

	// Сброс страницы при изменении pageSize или поиска
	React.useEffect(() => {
		setCurrentPage(1);
	}, [pageSize, debouncedSearch, selectedPeriod, selectedMonth]);

	const handlePeriodChange = (period: PeriodType, month?: string) => {
		setSelectedPeriod(period);
		setSelectedMonth(month || null);
	};

	const handleOpenForm = () => {
		setShowForm(true);
		setEditingPartner(null);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingPartner(null);
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

	const handleEditPartner = (partner: Partner) => {
		setEditingPartner(partner);
		setShowForm(true);
	};

	if (isLoading) {
		return <ContainerLoader text="Загрузка партнеров..." className="h-64" />;
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
				{/* Кнопка добавления партнера */}
				<div className="mb-4 flex justify-end">
					<button
						onClick={handleOpenForm}
						className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						+ Добавить партнера
					</button>
				</div>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex">
						{[
							"ID",
							"Дата и время",
							"Имя",
							"Username",
							"Способ выплаты и реквизиты",
							"Кол-во заявок",
							"Последние заявки",
							"Статус бонуса",
							"Партнерский код",
							"Действия",
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
					{partners.length === 0 ? (
						<div className="py-8 text-center">
							<div className="sticky left-1/2 transform -translate-x-1/2 text-gray-500 inline-block">
								{debouncedSearch
									? "По вашему запросу ничего не найдено"
									: "Партнеры не найдены"}
							</div>
						</div>
					) : (
						partners.map((partner) => (
							<PartnerRow
								key={partner.id}
								partner={partner}
								onEdit={handleEditPartner}
								onRefresh={refetch}
							/>
						))
					)}
				</div>
				{/* Пагинация */}
				<div className="flex justify-between items-center mt-4 max-[762px]:flex-col">
					<div className="flex items-center gap-4">
						<span className="text-lg">
							Отображается {partners.length} из {total}
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

				{/* Модальное окно с формой */}
				<PartnerForm
					isOpen={showForm}
					onClose={handleCloseForm}
					onSuccess={handleFormSuccess}
					partner={editingPartner}
				/>
			</main>
		</div>
	);
}
