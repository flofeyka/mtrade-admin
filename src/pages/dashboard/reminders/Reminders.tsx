import React, { useState } from "react";
import { toast } from "react-toastify";
import type { PeriodType } from "../../../components/shared/dashboard/DashboardPeriod";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import { ContainerLoader } from "../../../components/shared/Loader";
import { NotificationCard } from "../../../components/shared/notifications/NotificationCard";
import { NotificationForm } from "../../../components/shared/notifications/NotificationForm";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Notification } from "../../../store/api/notificationsApi";
import { useGetNotificationsQuery } from "../../../store/api/notificationsApi";
import { getDateRange } from "../../../utils/dateUtils";

export default function Reminders() {
	const [search, setSearch] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [showForm, setShowForm] = useState<boolean>(false);
	const [editingNotification, setEditingNotification] =
		useState<Notification | null>(null);
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

	const { data, error, isLoading, refetch } = useGetNotificationsQuery({
		search: debouncedSearch.trim() || undefined,
		dateFrom: dateRange.dateFrom,
		dateTo: dateRange.dateTo,
	});

	const notifications = data?.notifications || [];
	const total = data?.total || 0;

	// Образная пагинация для карточек (пока нет поддержки на бекенде)
	const totalPages = Math.max(1, Math.ceil(notifications.length / pageSize));
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedNotifications = notifications.slice(startIndex, endIndex);

	// Сброс страницы при изменении pageSize, поиска, периода или месяца
	React.useEffect(() => {
		setCurrentPage(1);
	}, [pageSize, debouncedSearch, selectedPeriod, selectedMonth]);

	const handleOpenForm = () => {
		setShowForm(true);
		setEditingNotification(null);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingNotification(null);
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

	const handleEditNotification = (notification: Notification) => {
		setEditingNotification(notification);
		setShowForm(true);
	};

	if (isLoading) {
		return (
			<div>
				<DashboardPeriod
					search={search}
					setSearch={setSearch}
					selectedPeriod={selectedPeriod}
					onPeriodChange={handlePeriodChange}
				/>
				<ContainerLoader text="Загрузка напоминаний..." className="h-64" />
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<DashboardPeriod
					search={search}
					setSearch={setSearch}
					selectedPeriod={selectedPeriod}
					onPeriodChange={handlePeriodChange}
				/>
				<div className="flex flex-col justify-center items-center h-64 space-y-4">
					<div className="text-lg text-red-500">Ошибка загрузки данных</div>
					<button
						onClick={handleRefresh}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Попробовать снова
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<DashboardPeriod
				search={search}
				setSearch={setSearch}
				selectedPeriod={selectedPeriod}
				onPeriodChange={handlePeriodChange}
			/>
			<div className="flex gap-3 flex-wrap">
				{/* Кнопка добавления */}
				<button
					onClick={handleOpenForm}
					className="w-[200px] h-[200px] bg-[#FFFFFF] border-[#757575] border-3 rounded-md text-6xl cursor-pointer hover:bg-gray-50 transition-colors"
				>
					+
				</button>

				{/* Карточки уведомлений */}
				{paginatedNotifications.map((notification) => (
					<NotificationCard
						key={notification.id}
						notification={notification}
						onEdit={handleEditNotification}
						onRefresh={refetch}
					/>
				))}
			</div>

			{/* Пагинация */}
			<div className="flex justify-between items-center mt-4">
				<div className="flex items-center gap-4">
					<span className="text-lg">
						Отображается {paginatedNotifications.length} из {total}
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
			{showForm && (
				<div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
					<div className="max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
						<NotificationForm
							onClose={handleCloseForm}
							onSuccess={handleFormSuccess}
							editingNotification={editingNotification}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
