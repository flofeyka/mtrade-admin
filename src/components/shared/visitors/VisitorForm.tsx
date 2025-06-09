import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
	useCreateVisitorMutation,
	useUpdateVisitorMutation,
} from "../../../store/api/visitorsApi";
import type { Visitor, CreateVisitorDto } from "../../../store/api/visitorsApi";

interface VisitorFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	visitor?: Visitor | null;
}

export default function VisitorForm({
	isOpen,
	onClose,
	onSuccess,
	visitor,
}: VisitorFormProps) {
	const [formData, setFormData] = useState<CreateVisitorDto>({
		trafficSource: "",
		utmTags: "",
		country: "",
		device: "",
		browser: "",
		pagesViewed: 1,
		timeOnSite: "",
		cookieFile: "",
	});

	const [createVisitor, { isLoading: isCreating }] = useCreateVisitorMutation();
	const [updateVisitor, { isLoading: isUpdating }] = useUpdateVisitorMutation();

	const isEditing = Boolean(visitor);
	const isLoading = isCreating || isUpdating;

	useEffect(() => {
		if (visitor) {
			setFormData({
				trafficSource: visitor.trafficSource,
				utmTags: visitor.utmTags || "",
				country: visitor.country,
				device: visitor.device,
				browser: visitor.browser,
				pagesViewed: visitor.pagesViewed,
				timeOnSite: visitor.timeOnSite,
				cookieFile: visitor.cookieFile,
			});
		} else {
			setFormData({
				trafficSource: "",
				utmTags: "",
				country: "",
				device: "",
				browser: "",
				pagesViewed: 1,
				timeOnSite: "",
				cookieFile: "",
			});
		}
	}, [visitor, isOpen]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (isEditing && visitor) {
				await updateVisitor({
					id: visitor.id,
					visitor: formData,
				}).unwrap();
				toast.success("Посетитель обновлен!");
			} else {
				await createVisitor(formData).unwrap();
				toast.success("Посетитель создан!");
			}
			onSuccess();
			onClose();
		} catch (error: any) {
			const errorMessage =
				error?.data?.message || "Произошла ошибка при сохранении";
			toast.error(errorMessage);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "pagesViewed" ? parseInt(value) || 1 : value,
		}));
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">
						{isEditing ? "Редактировать посетителя" : "Добавить посетителя"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-2xl"
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Источник трафика*
							</label>
							<input
								type="text"
								name="trafficSource"
								value={formData.trafficSource}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Google Ads"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								UTM-метки
							</label>
							<input
								type="text"
								name="utmTags"
								value={formData.utmTags}
								onChange={handleChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="utm_source=google&utm_medium=cpc"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Страна*
							</label>
							<input
								type="text"
								name="country"
								value={formData.country}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Россия"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Устройство*
							</label>
							<select
								name="device"
								value={formData.device}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Выберите устройство</option>
								<option value="Desktop">ПК</option>
								<option value="Mobile">Мобильный</option>
								<option value="Tablet">Планшет</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Браузер*
							</label>
							<input
								type="text"
								name="browser"
								value={formData.browser}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Chrome 120.0"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Просмотрено страниц*
							</label>
							<input
								type="number"
								name="pagesViewed"
								value={formData.pagesViewed}
								onChange={handleChange}
								min="1"
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Время на сайте*
							</label>
							<input
								type="text"
								name="timeOnSite"
								value={formData.timeOnSite}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="3 мин 12 сек"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Файл Cookie*
							</label>
							<input
								type="text"
								name="cookieFile"
								value={formData.cookieFile}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="visitor_session_12345.cookie"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
						>
							Отмена
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? "Сохранение..." : isEditing ? "Обновить" : "Создать"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
