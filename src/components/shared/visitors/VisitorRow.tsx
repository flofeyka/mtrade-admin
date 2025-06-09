import { useState } from "react";
import { toast } from "react-toastify";
import type { Visitor } from "../../../store/api/visitorsApi";
import { useDeleteVisitorMutation } from "../../../store/api/visitorsApi";

interface VisitorRowProps {
	visitor: Visitor;
	onEdit: (visitor: Visitor) => void;
	onRefresh: () => void;
}

export default function VisitorRow({
	visitor,
	onEdit,
	onRefresh,
}: VisitorRowProps) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
	const [deleteVisitor] = useDeleteVisitorMutation();

	const handleDelete = async () => {
		try {
			await deleteVisitor(visitor.id).unwrap();
			toast.success("Посетитель удален!");
			onRefresh();
			setShowDeleteConfirm(false);
		} catch (error) {
			toast.error("Ошибка при удалении посетителя");
		}
	};

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("ru-RU");
	};

	return (
		<div className="flex text-sm relative">
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.id}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.trafficSource}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.utmTags || "—"}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.country}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.device}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.browser}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.pagesViewed}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.timeOnSite}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{visitor.cookieFile}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
				{formatDateTime(visitor.createdAt)}
			</span>
			<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 relative">
				<div className="absolute inset-0 bg-white flex items-center justify-center gap-2">
					<button
						onClick={() => onEdit(visitor)}
						className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
					>
						Изменить
					</button>
					<button
						onClick={() => setShowDeleteConfirm(true)}
						className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
					>
						Удалить
					</button>
				</div>
			</span>

			{/* Модальное окно подтверждения удаления */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold mb-4">Подтвердите удаление</h3>
						<p className="text-gray-600 mb-6">
							Вы уверены, что хотите удалить посетителя "{visitor.id}"? Это
							действие нельзя отменить.
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
							>
								Отмена
							</button>
							<button
								onClick={handleDelete}
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							>
								Удалить
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
