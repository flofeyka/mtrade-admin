import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
	useCreatePartnerMutation,
	useUpdatePartnerMutation,
} from "../../../store/api/partnersApi";
import { Loader } from "../Loader";

interface PartnerFormProps {
	partner?: any;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({
	partner,
	isOpen,
	onClose,
	onSuccess,
}) => {
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		requisites: "",
		requisiteType: "Card" as "Card" | "Yoomoney",
		bonusStatus: "PENDING" as "PENDING" | "COMPLETED",
		code: "",
	});

	const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
	const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();

	const isEditing = !!partner;
	const isLoading = isCreating || isUpdating;

	useEffect(() => {
		if (partner) {
			setFormData({
				name: partner.name || "",
				username: partner.username || "",
				requisites: partner.requisites || "",
				requisiteType: partner.requisiteType || "Card",
				bonusStatus: partner.bonusStatus || "PENDING",
				code: partner.code || "",
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
	}, [partner]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (isEditing) {
				await updatePartner({ id: partner.id, partner: formData }).unwrap();
				toast.success("Партнер успешно обновлен");
			} else {
				await createPartner(formData).unwrap();
				toast.success("Партнер успешно создан");
			}
			onSuccess();
			onClose();
		} catch (error: any) {
			toast.error(
				error?.data?.message ||
					`Ошибка при ${isEditing ? "обновлении" : "создании"} партнера`
			);
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

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-semibold mb-4">
					{isEditing ? "Редактировать партнера" : "Создать партнера"}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Имя
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Введите имя партнера"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Имя пользователя
						</label>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Введите имя пользователя"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Реквизиты
						</label>
						<input
							type="text"
							name="requisites"
							value={formData.requisites}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Введите реквизиты"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Тип реквизитов
						</label>
						<select
							name="requisiteType"
							value={formData.requisiteType}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="Card">Карта</option>
							<option value="Yoomoney">ЮMoney</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Статус бонуса
						</label>
						<select
							name="bonusStatus"
							value={formData.bonusStatus}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="PENDING">В ожидании</option>
							<option value="COMPLETED">Завершен</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Код партнера
						</label>
						<input
							type="text"
							name="code"
							value={formData.code}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Введите код партнера"
						/>
					</div>

					<div className="flex gap-2 pt-4">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
						>
							Отмена
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
						>
							{isLoading ? <Loader /> : isEditing ? "Обновить" : "Создать"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PartnerForm;
