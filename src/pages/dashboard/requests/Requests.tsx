import { useState } from "react";
import { toast } from "react-toastify";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import { RequestForm } from "../../../components/shared/requests/RequestForm";
import { RequestRow } from "../../../components/shared/requests/RequestRow";
import { ContainerLoader } from "../../../components/shared/Loader";
import { useGetRequestsQuery } from "../../../store/api/requestsApi";
import type { Request } from "../../../store/api/requestsApi";

export default function Requests() {
	const [search, setSearch] = useState<string>("");
	const [currentPage, setCurrentPage] = useState(1);
	const [showForm, setShowForm] = useState(false);
	const [editingRequest, setEditingRequest] = useState<Request | null>(null);

	const { data, error, isLoading, refetch } = useGetRequestsQuery({
		page: currentPage,
		limit: 10,
	});

	const handleEdit = (request: Request) => {
		setEditingRequest(request);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingRequest(null);
	};

	const handleSuccess = () => {
		refetch();
	};

	const handleRefresh = async () => {
		try {
			await refetch().unwrap();
			toast.success("Данные обновлены!");
		} catch (error) {
			toast.error("Ошибка обновления данных");
		}
	};

	const handleAddNew = () => {
		setEditingRequest(null);
		setShowForm(true);
	};

	if (isLoading) {
		return <ContainerLoader text="Загрузка заявок..." className="h-64" />;
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-64 space-y-4">
				<div className="text-lg text-red-500">Ошибка загрузки заявок</div>
				<button
					onClick={handleRefresh}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Попробовать снова
				</button>
			</div>
		);
	}

	const requests = data?.requests || [];
	const totalPages = data?.totalPages || 1;

	return (
		<div>
			<header className="flex justify-between items-center mb-4">
				<DashboardPeriod search={search} setSearch={setSearch} />
			</header>

			<main>
				<button
					onClick={handleAddNew}
					className="px-4 flex justify-self-end mb-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
				>
					Добавить заявку
				</button>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex w-full border-[#00000033]">
						{[
							"ID заявки",
							"Дата и время",
							"Имя и фамилия",
							"Номер",
							"Почта",
							"Телеграм",
							"Партнерский код",
							"Источник",
							"Статус",
							"Действия",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[260px] border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 9 ? "border-r-2 " : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{requests.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							Заявки не найдены
						</div>
					) : (
						requests.map((request: Request) => (
							<RequestRow
								key={request.id}
								request={request}
								onEdit={handleEdit}
							/>
						))
					)}
				</div>

				{/* Пагинация */}
				<div className="flex justify-between text-3xl max-sm:text-xl mt-4">
					<span>
						Отображается {requests.length} из {data?.total || 0}
					</span>
					<div className="flex gap-3">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3 py-1 ${
									currentPage === page
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								} rounded`}
							>
								{page}
							</button>
						))}
					</div>
				</div>
			</main>

			{/* Модальное окно формы */}
			{showForm && (
				<div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<RequestForm
							onClose={handleCloseForm}
							onSuccess={handleSuccess}
							editingRequest={editingRequest}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
