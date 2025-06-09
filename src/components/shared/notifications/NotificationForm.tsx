import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type {
	CreateNotificationDto,
	Notification,
	UpdateNotificationDto,
} from "../../../store/api/notificationsApi";
import {
	useCreateNotificationMutation,
	useUpdateNotificationMutation,
} from "../../../store/api/notificationsApi";
import { Loader } from "../Loader";

interface NotificationFormProps {
	onClose: () => void;
	onSuccess: () => void;
	editingNotification?: Notification | null;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
	onClose,
	onSuccess,
	editingNotification,
}) => {
	const [createNotification, { isLoading: isCreating }] =
		useCreateNotificationMutation();
	const [updateNotification, { isLoading: isUpdating }] =
		useUpdateNotificationMutation();

	const [formData, setFormData] = useState<CreateNotificationDto>({
		text: "",
		end: "",
	});

	const isEditing = !!editingNotification;
	const isLoading = isCreating || isUpdating;

	// Заполнение формы данными для редактирования
	useEffect(() => {
		if (editingNotification) {
			// Форматируем дату для input datetime-local
			const endDate = new Date(editingNotification.end);
			const formattedEnd = endDate.toISOString().slice(0, 16);

			setFormData({
				text: editingNotification.text,
				end: formattedEnd,
			});
		} else {
			setFormData({
				text: "",
				end: "",
			});
		}
	}, [editingNotification]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Преобразуем дату обратно в ISO строку для API
			const submitData = {
				...formData,
				end: new Date(formData.end).toISOString(),
			};

			if (isEditing && editingNotification) {
				await updateNotification({
					id: editingNotification.id,
					notification: submitData as UpdateNotificationDto,
				}).unwrap();
				toast.success("Напоминание успешно обновлено!");
			} else {
				await createNotification(submitData).unwrap();
				toast.success("Напоминание успешно создано!");
			}
			onSuccess();
			onClose();
		} catch (error: any) {
			console.error(
				`Error ${isEditing ? "updating" : "creating"} notification:`,
				error
			);

			// Обработка ошибок валидации
			if (error?.data?.message) {
				if (Array.isArray(error.data.message)) {
					error.data.message.forEach((msg: string) => toast.error(msg));
				} else {
					toast.error(error.data.message);
				}
			} else if (error?.message) {
				toast.error(error.message);
			} else {
				toast.error(
					`Ошибка ${isEditing ? "обновления" : "создания"} напоминания`
				);
			}
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-6 bg-white rounded-lg shadow-lg"
		>
			<h2 className="text-xl font-bold mb-4">
				{isEditing ? "Редактировать напоминание" : "Добавить напоминание"}
			</h2>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Текст напоминания
					</label>
					<textarea
						name="text"
						value={formData.text}
						onChange={handleChange}
						required
						rows={4}
						className="w-full p-2 border border-gray-300 rounded resize-none"
						placeholder="Введите текст напоминания..."
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Дата и время окончания
					</label>
					<input
						type="datetime-local"
						name="end"
						value={formData.end}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
					/>
				</div>
			</div>

			<div className="flex gap-4 pt-4">
				<button
					type="submit"
					disabled={isLoading}
					className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					{isLoading && <Loader size="small" />}
					{isLoading
						? isEditing
							? "Сохранение..."
							: "Создание..."
						: isEditing
						? "Сохранить"
						: "Создать"}
				</button>
				<button
					type="button"
					onClick={onClose}
					disabled={isLoading}
					className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Отмена
				</button>
			</div>
		</form>
	);
};
