import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteRequestMutation } from "../../../store/api/requestsApi";
import type { Request } from "../../../store/api/requestsApi";
import { Loader } from "../Loader";

interface RequestRowProps {
	request: Request;
	onEdit: (request: Request) => void;
}

const getStatusDisplay = (status: Request["status"]) => {
	switch (status) {
		case "PENDING":
			return "Новая";
		case "IN_PROGRESS":
			return "В работе";
		case "APPROVED":
			return "Завершена";
		case "REJECTED":
			return "Отклонена";
		default:
			return status;
	}
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const RequestRow: React.FC<RequestRowProps> = ({ request, onEdit }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();

	const handleDelete = async () => {
		try {
			await deleteRequest(request.id).unwrap();
			toast.success("Заявка успешно удалена!");
			setShowDeleteConfirm(false);
		} catch (error: any) {
			console.error("Error deleting request:", error);

			if (error?.data?.message) {
				if (Array.isArray(error.data.message)) {
					error.data.message.forEach((msg: string) => toast.error(msg));
				} else {
					toast.error(error.data.message);
				}
			} else if (error?.message) {
				toast.error(error.message);
			} else {
				toast.error("Ошибка удаления заявки");
			}
		}
	};

	return (
		<>
			<div
				className="flex border-b border-gray-200 text-sm relative"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{request.id}
				</span>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{formatDate(request.createdAt)}
				</span>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{request.fullName}
				</span>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{request.phone}
				</span>
				<span className="min-w-[260px] break-all text-center py-4 border-r-2 border-[#00000033]">
					{request.email}
				</span>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{request.telegram || "-"}
				</span>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{request.partnerCode || "-"}
				</span>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{request.source}
				</span>
				<span className="min-w-[260px] text-center py-4 border-r-2 border-[#00000033]">
					{getStatusDisplay(request.status)}
				</span>
				<span className="min-w-[260px] text-center py-4 relative">
					{isHovered && (
						<div className="flex gap-2 justify-center">
							<button
								onClick={() => onEdit(request)}
								className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
							>
								Изменить
							</button>
							<button
								onClick={() => setShowDeleteConfirm(true)}
								disabled={isDeleting}
								className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
							>
								{isDeleting && <Loader size="small" />}
								{isDeleting ? "Удаление..." : "Удалить"}
							</button>
						</div>
					)}
				</span>
			</div>

			{/* Модальное окно подтверждения удаления */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
						<h3 className="text-lg font-bold mb-4">Подтверждение удаления</h3>
						<p className="mb-6">
							Вы уверены, что хотите удалить заявку от{" "}
							<strong>{request.fullName}</strong>?
						</p>
						<div className="flex gap-4">
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isDeleting && <Loader size="small" />}
								{isDeleting ? "Удаление..." : "Удалить"}
							</button>
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
							>
								Отмена
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
