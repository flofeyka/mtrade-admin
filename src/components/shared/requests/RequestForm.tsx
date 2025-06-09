import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
	useCreateRequestMutation,
	useUpdateRequestMutation,
} from "../../../store/api/requestsApi";
import type {
	CreateRequestDto,
	Request,
	UpdateRequestDto,
} from "../../../store/api/requestsApi";
import { Loader } from "../Loader";

interface RequestFormProps {
	onClose: () => void;
	onSuccess: () => void;
	editingRequest?: Request | null;
}

export const RequestForm: React.FC<RequestFormProps> = ({
	onClose,
	onSuccess,
	editingRequest,
}) => {
	const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
	const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();

	const [formData, setFormData] = useState<CreateRequestDto>({
		fullName: "",
		phone: "",
		email: "",
		telegram: "",
		partnerCode: "",
		source: "",
		status: "PENDING",
	});

	const isEditing = !!editingRequest;
	const isLoading = isCreating || isUpdating;

	// Заполнение формы данными для редактирования
	useEffect(() => {
		if (editingRequest) {
			setFormData({
				fullName: editingRequest.fullName,
				phone: editingRequest.phone,
				email: editingRequest.email,
				telegram: editingRequest.telegram || "",
				partnerCode: editingRequest.partnerCode || "",
				source: editingRequest.source,
				status: editingRequest.status,
			});
		} else {
			setFormData({
				fullName: "",
				phone: "",
				email: "",
				telegram: "",
				partnerCode: "",
				source: "",
				status: "PENDING",
			});
		}
	}, [editingRequest]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Убираем пустые необязательные поля
			const submitData = {
				...formData,
				telegram: formData.telegram || undefined,
				partnerCode: formData.partnerCode || undefined,
			};

			if (isEditing && editingRequest) {
				await updateRequest({
					id: editingRequest.id,
					request: submitData as UpdateRequestDto,
				}).unwrap();
				toast.success("Заявка успешно обновлена!");
			} else {
				await createRequest(submitData).unwrap();
				toast.success("Заявка успешно создана!");
			}
			onSuccess();
			onClose();
		} catch (error: any) {
			console.error(
				`Error ${isEditing ? "updating" : "creating"} request:`,
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
				toast.error(`Ошибка ${isEditing ? "обновления" : "создания"} заявки`);
			}
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
				{isEditing ? "Редактировать заявку" : "Добавить заявку"}
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">
						Имя и фамилия *
					</label>
					<input
						type="text"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="Введите имя и фамилию..."
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Телефон *</label>
					<input
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="+7 (999) 123-45-67"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Email *</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="example@mail.ru"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Telegram</label>
					<input
						type="text"
						name="telegram"
						value={formData.telegram}
						onChange={handleChange}
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="@username"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Партнерский код
					</label>
					<input
						type="text"
						name="partnerCode"
						value={formData.partnerCode}
						onChange={handleChange}
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="PARTNER_ABC_2024"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Источник *</label>
					<input
						type="text"
						name="source"
						value={formData.source}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
						placeholder="Website, Mobile App, etc."
					/>
				</div>

				<div className="md:col-span-2">
					<label className="block text-sm font-medium mb-1">Статус</label>
					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="w-full p-2 border border-gray-300 rounded"
					>
						<option value="PENDING">Новая</option>
						<option value="IN_PROGRESS">В работе</option>
						<option value="APPROVED">Завершена</option>
						<option value="REJECTED">Отклонена</option>
					</select>
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
