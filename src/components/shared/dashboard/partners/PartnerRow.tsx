import React, { useState } from "react";
import { toast } from "react-toastify";
import {
	useDeletePartnerMutation,
	type Partner,
} from "../../../../store/api/partnersApi";
import { Loader } from "../../Loader";

interface PartnerRowProps {
	partner: Partner;
	onEdit: (partner: Partner) => void;
	onRefresh: () => void;
}

export const PartnerRow: React.FC<PartnerRowProps> = ({
	partner,
	onEdit,
	onRefresh,
}) => {
	const [deletePartner, { isLoading: isDeleting }] = useDeletePartnerMutation();
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	// Функция для форматирования даты
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("ru-RU", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Функция для форматирования способа выплаты
	const formatPayoutMethod = (requisiteType: string, requisites: string) => {
		const type = requisiteType === "Card" ? "Карта" : "ЮMoney";
		return `${type}: ${requisites}`;
	};

	// Функция для форматирования статуса бонуса
	const formatBonusStatus = (status: string) => {
		return status === "PENDING" ? "Ожидает" : "Выплачен";
	};

	const handleDelete = async () => {
		try {
			await deletePartner(partner.id).unwrap();
			toast.success("Партнер успешно удален!");
			onRefresh();
			setShowConfirmDelete(false);
		} catch (error: any) {
			console.error("Error deleting partner:", error);

			if (error?.data?.message) {
				if (Array.isArray(error.data.message)) {
					error.data.message.forEach((msg: string) => toast.error(msg));
				} else {
					toast.error(error.data.message);
				}
			} else if (error?.message) {
				toast.error(error.message);
			} else {
				toast.error("Ошибка удаления партнера");
			}
		}
	};

	const handleEdit = () => {
		onEdit(partner);
	};

	return (
		<div className="flex border-b border-gray-200 text-sm">
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{partner.id}
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{formatDate(partner.createdAt)}
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{partner.name}
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{partner.username}
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{formatPayoutMethod(partner.requisiteType, partner.requisites)}
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{partner.users?.length || 0}
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				-
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{formatBonusStatus(partner.bonusStatus)}
			</span>
			<span className="min-w-[240px] text-center py-4 border-r-2 border-[#00000033] break-all">
				{partner.code}
			</span>
			<span className="min-w-[240px] text-center py-4 break-all">
				<div className="flex gap-2 justify-center">
					<button
						onClick={handleEdit}
						className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
					>
						Редактировать
					</button>
					<button
						onClick={() => setShowConfirmDelete(true)}
						disabled={isDeleting}
						className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
					>
						{isDeleting && <Loader size="small" />}
						{isDeleting ? "Удаление..." : "Удалить"}
					</button>
				</div>

				{/* Модальное окно подтверждения удаления */}
				{showConfirmDelete && (
					<div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
							<h3 className="text-lg font-bold mb-4">Подтверждение удаления</h3>
							<p className="mb-6">
								Вы уверены, что хотите удалить партнера "{partner.name}"? Это
								действие необратимо.
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
			</span>
		</div>
	);
};
