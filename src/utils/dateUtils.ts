import type { PeriodType } from "../components/shared/dashboard/DashboardPeriod";

export const getDateRange = (
	period: PeriodType,
	month?: string | null
): { dateFrom?: string; dateTo?: string } => {
	if (!period) return {};

	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	switch (period) {
		case "today":
			const todayStart = new Date(today);
			todayStart.setHours(0, 0, 0, 0);
			const todayEnd = new Date(today);
			todayEnd.setHours(23, 59, 59, 999);
			return {
				dateFrom: todayStart.toISOString(),
				dateTo: todayEnd.toISOString(),
			};
		case "yesterday":
			const yesterday = new Date(today);
			yesterday.setDate(today.getDate() - 1);
			const yesterdayStart = new Date(yesterday);
			yesterdayStart.setHours(0, 0, 0, 0);
			const yesterdayEnd = new Date(yesterday);
			yesterdayEnd.setHours(23, 59, 59, 999);
			return {
				dateFrom: yesterdayStart.toISOString(),
				dateTo: yesterdayEnd.toISOString(),
			};
		case "week":
			const weekAgo = new Date(today);
			weekAgo.setDate(today.getDate() - 7);
			weekAgo.setHours(0, 0, 0, 0);
			const weekEnd = new Date(today);
			weekEnd.setHours(23, 59, 59, 999);
			return {
				dateFrom: weekAgo.toISOString(),
				dateTo: weekEnd.toISOString(),
			};
		case "month":
			const currentYear = now.getFullYear();
			let monthIndex = now.getMonth(); // По умолчанию текущий месяц

			// Если выбран конкретный месяц, найдем его индекс
			if (month) {
				const monthNames = [
					"Январь",
					"Февраль",
					"Март",
					"Апрель",
					"Май",
					"Июнь",
					"Июль",
					"Август",
					"Сентябрь",
					"Октябрь",
					"Ноябрь",
					"Декабрь",
				];
				const foundIndex = monthNames.indexOf(month);
				if (foundIndex !== -1) {
					monthIndex = foundIndex;
				}
			}

			const monthStart = new Date(currentYear, monthIndex, 1);
			monthStart.setHours(0, 0, 0, 0);
			const monthEnd = new Date(currentYear, monthIndex + 1, 0);
			monthEnd.setHours(23, 59, 59, 999);
			return {
				dateFrom: monthStart.toISOString(),
				dateTo: monthEnd.toISOString(),
			};
		default:
			return {};
	}
};
