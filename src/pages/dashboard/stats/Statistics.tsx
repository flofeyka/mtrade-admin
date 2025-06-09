import React from "react";
import Button from "../../../components/Button";
import DashboardPeriod from "../../../components/shared/dashboard/DashboardPeriod";
import type { PeriodType } from "../../../components/shared/dashboard/DashboardPeriod";
import { useGetTopButtonsQuery } from "../../../store/api/buttonsApi";
import { useGetNotificationsQuery } from "../../../store/api/notificationsApi";
import { useGetPaymentStatsQuery } from "../../../store/api/paymentsApi";
import { useGetRequestsQuery } from "../../../store/api/requestsApi";
import { useGetVisitorsQuery } from "../../../store/api/visitorsApi";

export default function Statistics() {
	const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodType>(null);

	// Helper function to get date range based on selected period
	const getDateRange = (
		period: PeriodType
	): { dateFrom?: string; dateTo?: string } => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		switch (period) {
			case "today":
				return {
					dateFrom: today.toISOString(),
					dateTo: new Date(
						today.getTime() + 24 * 60 * 60 * 1000 - 1
					).toISOString(),
				};
			case "yesterday":
				const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
				return {
					dateFrom: yesterday.toISOString(),
					dateTo: new Date(
						yesterday.getTime() + 24 * 60 * 60 * 1000 - 1
					).toISOString(),
				};
			case "week":
				const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
				return {
					dateFrom: weekAgo.toISOString(),
					dateTo: new Date(
						today.getTime() + 24 * 60 * 60 * 1000 - 1
					).toISOString(),
				};
			case "month":
				const monthAgo = new Date(
					today.getFullYear(),
					today.getMonth() - 1,
					today.getDate()
				);
				return {
					dateFrom: monthAgo.toISOString(),
					dateTo: new Date(
						today.getTime() + 24 * 60 * 60 * 1000 - 1
					).toISOString(),
				};
			default:
				return {};
		}
	};

	const dateRange = getDateRange(selectedPeriod);

	// API calls for data
	const { data: visitorsData, isLoading: visitorsLoading } =
		useGetVisitorsQuery({ page: 1, limit: 1 });
	const { data: requestsData, isLoading: requestsLoading } =
		useGetRequestsQuery({ page: 1, limit: 1 });
	const { data: paymentStats, isLoading: paymentsLoading } =
		useGetPaymentStatsQuery(dateRange);
	const { data: topButtons, isLoading: buttonsLoading } = useGetTopButtonsQuery(
		{ limit: 3 }
	);
	const { data: notificationsData, isLoading: notificationsLoading } =
		useGetNotificationsQuery();

	return (
		<div className="w-[85vw] flex flex-col self-center">
			<DashboardPeriod
				selectedPeriod={selectedPeriod}
				onPeriodChange={setSelectedPeriod}
			/>
			<main>
				<main className="mt-5">
					<div className="flex justify-between max-[1505px]:flex-col max-sm:gap-10">
						<span className="flex flex-col items-center gap-7">
							<h3>Сводка</h3>
							<div className="bg-[#FFFFFF] max-w-[90vw] rounded-xl border-2 border-[#00000033]">
								<div className="flex border-[#00000033] border-b-2">
									<span className="w-[225px] border-[#00000033] py-5 border-r-2 text-center">
										Количество <br /> посетителей
									</span>
									<span className="w-[225px] text-center py-5">
										{visitorsLoading ? "..." : visitorsData?.total || 0}
									</span>
								</div>
								<div className="flex">
									<span className="w-[225px] border-[#00000033] py-5 border-r-2 text-center">
										Количество заявок
									</span>
									<span className="w-[225px] text-center py-5">
										{requestsLoading ? "..." : requestsData?.total || 0}
									</span>
								</div>
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-[225px] border-[#00000033] border-r-2 py-5 text-center">
										Количество оплат
									</span>
									<span className="w-[225px] text-center py-5">
										{paymentsLoading ? "..." : paymentStats?.completed || 0}
									</span>
								</div>
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-[225px] border-[#00000033] border-r-2 py-5 text-center">
										Незавершенные <br /> оплаты
									</span>
									<span className="w-[225px] text-center py-5">
										{paymentsLoading ? "..." : paymentStats?.pending || 0}
									</span>
								</div>
							</div>
						</span>

						<span className="flex flex-col items-center gap-7">
							<h3>ТОП Кнопок по кликам</h3>
							<div className="bg-[#FFFFFF] overflow-x-auto max-w-[90vw] rounded-xl border-2 border-[#00000033]">
								<div className="flex">
									<span className="w-[260px] border-[#00000033] py-6.5 border-r-2 text-center">
										№
									</span>
									<span className="w-[260px] border-[#00000033] border-r-2 text-center py-6.5">
										Кнопка
									</span>
									<span className="w-[260px] text-center py-6.5">Клики</span>
								</div>
								{buttonsLoading ? (
									<div className="flex border-[#00000033] border-t-2">
										<span className="w-[780px] text-center py-6.5">
											Загрузка...
										</span>
									</div>
								) : topButtons && topButtons.length > 0 ? (
									topButtons.map((button, index) => (
										<div
											key={button.id}
											className="flex border-[#00000033] border-t-2"
										>
											<span className="w-[260px] border-[#00000033] border-r-2 py-6.5 text-center">
												{index + 1}
											</span>
											<span className="w-[260px] border-[#00000033] border-r-2 text-center py-6.5">
												{button.name}
											</span>
											<span className="w-[260px] text-center py-6.5">
												{button.clickCount}
											</span>
										</div>
									))
								) : (
									<div className="flex border-[#00000033] border-t-2">
										<span className="w-[780px] text-center py-6.5">
											Нет данных о кнопках
										</span>
									</div>
								)}
							</div>
						</span>
					</div>
				</main>
			</main>

			<footer className="flex flex-col items-center">
				<Button className="w-[250px] my-5">Уведомления</Button>

				<div className="w-full mt-10">
					<span className="flex w-full flex-col items-center gap-7">
						<div className="bg-[#FFFFFF] overflow-x-auto w-full rounded-xl border-2 border-[#00000033]">
							{notificationsLoading ? (
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-full text-center py-4">
										Загрузка уведомлений...
									</span>
								</div>
							) : notificationsData &&
							  notificationsData.notifications.length > 0 ? (
								notificationsData.notifications.map((notification) => (
									<div
										key={notification.id}
										className="flex border-[#00000033] border-t-2"
									>
										<span className="w-[20%] min-w-[100px] border-[#00000033] border-r-2 py-4 text-center">
											{new Date(notification.createdAt).toLocaleDateString(
												"ru-RU",
												{
													month: "long",
													day: "2-digit",
													hour: "numeric",
													minute: "numeric",
												}
											)}
										</span>
										<span className="w-[80%] min-w-[600px] border-[#00000033] border-r-2 text-center py-4">
											{notification.text}
										</span>
									</div>
								))
							) : (
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-full text-center py-4">
										Нет уведомлений
									</span>
								</div>
							)}
						</div>
					</span>
				</div>
			</footer>
		</div>
	);
}
