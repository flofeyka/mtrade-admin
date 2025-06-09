import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
	useCreatePartnerMutation,
	useUpdatePartnerMutation,
	type CreatePartnerDto,
	type Partner,
	type UpdatePartnerDto,
} from "../../../../store/api/partnersApi";
import { Loader } from "../../Loader";

interface PartnerFormProps {
	onClose: () => void;
	onSuccess: () => void;
	editingPartner?: Partner | null;
}

export const PartnerForm: React.FC<PartnerFormProps> = ({
	onClose,
	onSuccess,
	editingPartner,
}) => {
	const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
	const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();

	const [formData, setFormData] = useState<CreatePartnerDto>({
		name: "",
		username: "",
		requisites: "",
		requisiteType: "Card",
		bonusStatus: "PENDING",
		code: "",
	});

	const isEditing = !!editingPartner;
	const isLoading = isCreating || isUpdating;

	// Заполнение формы данными для редактирования
	useEffect(() => {
		if (editingPartner) {
			setFormData({
				name: editingPartner.name,
				username: editingPartner.username,
				requisites: editingPartner.requisites,
				requisiteType: editingPartner.requisiteType,
				bonusStatus: editingPartner.bonusStatus,
				code: editingPartner.code,
			});
		} else {
			setFormData({
				name: "",
				username: "",
				requisites: "",
				requisiteType: "Card",
				bonusStatus: "PENDING",
				code: "",
			});
		}
	}, [editingPartner]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isEditing && editingPartner) {
				await updatePartner({
					id: editingPartner.id,
					partner: formData as UpdatePartnerDto,
				}).unwrap();
				toast.success("Партнер успешно обновлен!");
			} else {
				await createPartner(formData).unwrap();
				toast.success("Партнер успешно создан!");
			}
			onSuccess();
			onClose();
		} catch (error: any) {
			console.error(
				`Error ${isEditing ? "updating" : "creating"} partner:`,
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
				toast.error(`Ошибка ${isEditing ? "обновления" : "создания"} партнера`);
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
				{isEditing ? "Редактировать партнера" : "Добавить партнера"}
			</h2>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-1">Имя</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Username</label>
					<input
						type="text"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Реквизиты</label>
					<input
						type="text"
						name="requisites"
						value={formData.requisites}
						onChange={handleChange}
						required
						className="w-full p-2 border border-gray-300 rounded"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Тип реквизитов
					</label>
					<select
						name="requisiteType"
						value={formData.requisiteType}
						onChange={handleChange}
						className="w-full p-2 border border-gray-300 rounded"
					>
						<option value="Card">Карта</option>
						<option value="Yoomoney">ЮMoney</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Статус бонуса
					</label>
					<select
						name="bonusStatus"
						value={formData.bonusStatus}
						onChange={handleChange}
						className="w-full p-2 border border-gray-300 rounded"
					>
						<option value="PENDING">Ожидает</option>
						<option value="COMPLETED">Выплачен</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">
						Партнерский код
					</label>
					<input
						type="text"
						name="code"
						value={formData.code}
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
