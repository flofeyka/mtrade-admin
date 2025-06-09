import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteNotificationMutation } from "../../../store/api/notificationsApi";
import type { Notification } from "../../../store/api/notificationsApi";
import { Loader } from "../Loader";

interface NotificationCardProps {
	notification: Notification;
	onEdit: (notification: Notification) => void;
	onRefresh: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
	notification,
	onEdit,
	onRefresh,
}) => {
	const [deleteNotification, { isLoading: isDeleting }] =
		useDeleteNotificationMutation();
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	// Функция для расчета времени до окончания
	const getTimeUntilEnd = (endDate: string) => {
		const now = new Date();
		const end = new Date(endDate);
		const timeDiff = end.getTime() - now.getTime();

		if (timeDiff <= 0) {
			return "Истекло";
		}

		const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);

		if (days > 0) {
			return `Через ${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`;
		} else if (hours > 0) {
			return `Через ${hours} ${
				hours === 1 ? "час" : hours < 5 ? "часа" : "часов"
			}`;
		} else {
			const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			return `Через ${minutes} ${
				minutes === 1 ? "минуту" : minutes < 5 ? "минуты" : "минут"
			}`;
		}
	};

	// Функция для форматирования даты
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		});
	};

	const handleDelete = async () => {
		try {
			await deleteNotification(notification.id).unwrap();
			toast.success("Напоминание успешно удалено!");
			onRefresh();
			setShowConfirmDelete(false);
		} catch (error: any) {
			console.error("Error deleting notification:", error);

			if (error?.data?.message) {
				if (Array.isArray(error.data.message)) {
					error.data.message.forEach((msg: string) => toast.error(msg));
				} else {
					toast.error(error.data.message);
				}
			} else if (error?.message) {
				toast.error(error.message);
			} else {
				toast.error("Ошибка удаления напоминания");
			}
		}
	};

	const handleEdit = () => {
		onEdit(notification);
	};

	// Проверяем, истекло ли уведомление
	const isExpired = new Date(notification.end) <= new Date();

	return (
		<>
			<div
				className={`relative w-[200px] h-[200px] bg-[#FFFFFF] border-[#757575] border-3 flex flex-col justify-between p-3 text-center rounded-md text-2xl cursor-pointer group ${
					isExpired ? "opacity-50" : ""
				}`}
			>
				{/* Кнопки действий - появляются при наведении */}
				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleEdit();
						}}
						className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center justify-center"
						title="Редактировать"
					>
						✏️
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setShowConfirmDelete(true);
						}}
						disabled={isDeleting}
						className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center justify-center disabled:opacity-50"
						title="Удалить"
					>
						🗑️
					</button>
				</div>

				{/* Содержимое карточки - как в оригинале */}
				<div className="overflow-hidden">{notification.text}</div>
				<div>{getTimeUntilEnd(notification.end)}</div>
				<div>{formatDate(notification.end)}</div>
			</div>

			{/* Модальное окно подтверждения удаления */}
			{showConfirmDelete && (
				<div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-bold mb-4">Подтверждение удаления</h3>
						<p className="mb-6">
							Вы уверены, что хотите удалить это напоминание? Это действие
							необратимо.
						</p>
						<div className="flex gap-4 justify-end">
							<button
								onClick={() => setShowConfirmDelete(false)}
								className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
							>
								Отмена
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isDeleting && <Loader size="small" />}
								{isDeleting ? "Удаление..." : "Удалить"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
