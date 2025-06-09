import React, { useState } from "react";
import { toast } from "react-toastify";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import { ContainerLoader } from "../../../components/shared/Loader";
import { useGetPartnersQuery } from "../../../store/api/partnersApi";
import type { Partner } from "../../../store/api/partnersApi";
import PartnerForm from "../../../components/shared/partners/PartnerForm";
import PartnerRow from "../../../components/shared/partners/PartnerRow";

export default function Partners() {
	const [search, setSearch] = React.useState<string>("");
	const [showForm, setShowForm] = useState<boolean>(false);
	const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
	const { data, error, isLoading, refetch } = useGetPartnersQuery();

	const partners = data?.partners || [];
	const total = data?.total || 0;

	const handleOpenForm = () => {
		setShowForm(true);
		setEditingPartner(null);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingPartner(null);
	};

	const handleFormSuccess = () => {
		refetch(); // Обновляем данные после успешного создания/обновления
	};

	const handleRefresh = async () => {
		try {
			await refetch().unwrap();
			toast.success("Данные обновлены!");
		} catch (error) {
			toast.error("Ошибка обновления данных");
		}
	};

	const handleEditPartner = (partner: Partner) => {
		setEditingPartner(partner);
		setShowForm(true);
	};

	if (isLoading) {
		return <ContainerLoader text="Загрузка партнеров..." className="h-64" />;
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-64 space-y-4">
				<div className="text-lg text-red-500">Ошибка загрузки данных</div>
				<button
					onClick={handleRefresh}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Попробовать снова
				</button>
			</div>
		);
	}

	return (
		<div>
			<header>
				<DashboardPeriod search={search} setSearch={setSearch} />
			</header>

			<main>
				{/* Кнопка добавления партнера */}
				<div className="mb-4 flex justify-end">
					<button
						onClick={handleOpenForm}
						className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						+ Добавить партнера
					</button>
				</div>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex">
						{[
							"ID",
							"Дата и время",
							"Имя",
							"Username",
							"Способ выплаты и реквизиты",
							"Количество пользователей",
							"Всего выводов",
							"Статус бонуса",
							"Партнерский код",
							"Действия",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[240px]  border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 9 ? "border-r-2 border-[#00000033]" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{partners.map((partner) => (
						<PartnerRow
							key={partner.id}
							partner={partner}
							onEdit={handleEditPartner}
							onRefresh={refetch}
						/>
					))}
				</div>
				<div className="flex justify-between text-3xl">
					<span>
						Отображается {partners.length} из {total}
					</span>
					<span className="flex gap-3">
						<span>1</span>
						<span>2</span>
						<span>3</span>
					</span>
				</div>

				{/* Модальное окно с формой */}
				<PartnerForm
					isOpen={showForm}
					onClose={handleCloseForm}
					onSuccess={handleFormSuccess}
					partner={editingPartner}
				/>
			</main>
		</div>
	);
}
