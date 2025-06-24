import React, { useState } from "react";
import { toast } from "react-toastify";
import {
	useDeletePartnerMutation,
	type Partner,
} from "../../../store/api/partnersApi";

interface PartnerRowProps {
	partner: Partner;
	onEdit: (partner: Partner) => void;
	onRefresh: () => void;
}

const PartnerRow: React.FC<PartnerRowProps> = ({
	partner,
	onEdit,
	onRefresh,
}) => {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deletePartner, { isLoading: isDeleting }] = useDeletePartnerMutation();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getRequisiteTypeText = (type: string) => {
		return type === "Card" ? "Карта" : "ЮMoney";
	};

	const getBonusStatusText = (status: string) => {
		return status === "COMPLETED" ? "Завершен" : "В ожидании";
	};

	const getBonusStatusColor = (status: string) => {
		return status === "COMPLETED" ? "text-green-600" : "text-yellow-600";
	};

	const handleDelete = async () => {
		try {
			await deletePartner(partner.id).unwrap();
			toast.success("Партнер успешно удален");
			onRefresh();
			setShowDeleteConfirm(false);
		} catch (error: any) {
			toast.error(error?.data?.message || "Ошибка при удалении партнера");
		}
	};

	const renderRecentRequests = () => {
		if (!partner.recentRequests || partner.recentRequests.length === 0) {
			return "Нет заявок";
		}

		return partner.recentRequests
			.slice(0, 3) // Показываем максимум 3 последние заявки
			.map((request) => request.fullName)
			.join(", ");
	};

	return (
		<>
			<div className="flex border-b border-gray-200 text-sm hover:bg-gray-50 group">
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{partner.id}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{formatDate(partner.createdAt)}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{partner.name}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{partner.username}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{getRequisiteTypeText(partner.requisiteType)}: {partner.requisites}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{partner.requestsCount || 0}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{renderRecentRequests()}
				</span>
				<span
					className={`min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033] ${getBonusStatusColor(
						partner.bonusStatus
					)}`}
				>
					{getBonusStatusText(partner.bonusStatus)}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-r-2 border-[#00000033]">
					{partner.code}
				</span>
				<span className="min-w-[240px] text-center border-b-2 py-4 border-[#00000033] relative">
					<div className="flex justify-center items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<button
							onClick={() => onEdit(partner)}
							className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
							disabled={isDeleting}
						>
							Редактировать
						</button>
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
							disabled={isDeleting}
						>
							Удалить
						</button>
					</div>
				</span>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<h3 className="text-lg font-semibold mb-4">
							Подтверждение удаления
						</h3>
						<p className="text-gray-600 mb-6">
							Вы уверены, что хотите удалить партнера "{partner.name}"? Это
							действие нельзя отменить.
						</p>
						<div className="flex gap-2">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								disabled={isDeleting}
								className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
							>
								Отмена
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
							>
								{isDeleting ? "Удаление..." : "Удалить"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PartnerRow;
