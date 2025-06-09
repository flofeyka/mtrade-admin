import { useState } from "react";
import { toast } from "react-toastify";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import { ContainerLoader } from "../../../components/shared/Loader";
import { useGetNotificationsQuery } from "../../../store/api/notificationsApi";
import type { Notification } from "../../../store/api/notificationsApi";
import { NotificationForm } from "../../../components/shared/notifications/NotificationForm";
import { NotificationCard } from "../../../components/shared/notifications/NotificationCard";

export default function Reminders() {
	const [search, setSearch] = useState<string>("");
	const [showForm, setShowForm] = useState<boolean>(false);
	const [editingNotification, setEditingNotification] =
		useState<Notification | null>(null);
	const { data, error, isLoading, refetch } = useGetNotificationsQuery();

	const notifications = data?.notifications || [];
	const total = data?.total || 0;

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
				<DashboardPeriod search={search} setSearch={setSearch} />
				<ContainerLoader text="Загрузка напоминаний..." className="h-64" />
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<DashboardPeriod search={search} setSearch={setSearch} />
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
			<DashboardPeriod search={search} setSearch={setSearch} />
			<div className="flex gap-3 flex-wrap">
				{/* Кнопка добавления */}
				<button
					onClick={handleOpenForm}
					className="w-[200px] h-[200px] bg-[#FFFFFF] border-[#757575] border-3 rounded-md text-6xl cursor-pointer hover:bg-gray-50 transition-colors"
				>
					+
				</button>

				{/* Карточки уведомлений */}
				{notifications.map((notification) => (
					<NotificationCard
						key={notification.id}
						notification={notification}
						onEdit={handleEditNotification}
						onRefresh={refetch}
					/>
				))}
			</div>

			{/* Статистика */}
			{total > 0 && (
				<div className="mt-6 text-lg text-gray-600">
					Всего напоминаний: {total}
				</div>
			)}

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
