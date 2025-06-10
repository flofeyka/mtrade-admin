import type React from "react";
import { useState, useRef, useEffect } from "react";
import Input from "../../Input";

export type PeriodType = "today" | "yesterday" | "week" | "month" | null;

interface Props {
	search?: string;
	setSearch?: React.Dispatch<React.SetStateAction<string>>;
	selectedPeriod?: PeriodType;
	onPeriodChange?: (period: PeriodType, selectedMonth?: string) => void;
}

export default function DashboardPeriod({
	search,
	setSearch,
	selectedPeriod,
	onPeriodChange,
}: Props) {
	const [showMonthDropdown, setShowMonthDropdown] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const periods = [
		{ key: "today", label: "Сегодня" },
		{ key: "yesterday", label: "Вчера" },
		{ key: "week", label: "Неделя" },
		{ key: "month", label: selectedMonth || "Месяц" },
	] as const;

	const allMonths = [
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

	// Получаем текущий месяц (0-11) и показываем месяца от января до текущего включительно
	const currentMonth = new Date().getMonth();
	const months = allMonths.slice(0, currentMonth + 1);

	// Закрытие выпадающего списка при клике вне его
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowMonthDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handlePeriodClick = (period: PeriodType) => {
		if (period === "month") {
			setShowMonthDropdown(!showMonthDropdown);
			return;
		}

		if (onPeriodChange) {
			// Если кликнули на уже выбранный период, сбрасываем
			const newPeriod = selectedPeriod === period ? null : period;
			onPeriodChange(newPeriod);

			// Если сбрасываем период, также сбрасываем выбранный месяц
			if (newPeriod === null) {
				setSelectedMonth(null);
			}
		}
	};

	const handleMonthSelect = (month: string) => {
		setSelectedMonth(month);
		setShowMonthDropdown(false);
		if (onPeriodChange) {
			onPeriodChange("month", month);
		}
	};

	return (
		<header
			className={`flex max-sm:flex-col max-[762px]:gap-10 ${
				typeof search === "string"
					? "sm:justify-between max-sm:items-baseline"
					: "justify-center"
			} w-full mb-12`}
		>
			<div className="relative max-[762px]:w-full">
				<div className="bg-[#FFFFFF] max-[762px]:flex-wrap max-[762px]:w-full border-2 border-[#00000033] overflow-hidden rounded-xl min-[762px]-h-[60px] min-[762px]:flex self-center min-[762px]:items-center">
					{periods.map((period, index) => (
						<button
							key={period.key}
							onClick={() => handlePeriodClick(period.key)}
							className={`
								${
									index < periods.length - 1
										? "min-[762px]:border-r-2 max-[762px]:border-b-2"
										: ""
								} 
								${selectedPeriod === period.key ? "bg-gray-200" : "bg-[#FFFFFF]"} 
								h-[60px] flex items-center cursor-pointer justify-center w-[180px] max-[762px]:w-full border-[#00000033] 
								hover:bg-gray-100 transition-colors duration-200
								${index === periods.length - 1 ? "rounded-b-xl" : ""}
								${period.key === "month" && showMonthDropdown ? "bg-gray-100" : ""}
							`}
						>
							{period.label}
							{period.key === "month" && (
								<span className="ml-2 text-gray-600">
									{showMonthDropdown ? "▲" : "▼"}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Выпадающий список месяцев */}
				{showMonthDropdown && (
					<div
						ref={dropdownRef}
						className="absolute top-full left-0 right-0 bg-white border-2 border-[#00000033] border-t-0 rounded-b-xl shadow-lg z-10 max-h-60 overflow-y-auto"
					>
						{months.map((month, index) => (
							<button
								key={month}
								onClick={() => handleMonthSelect(month)}
								className={`
									w-full h-[50px] flex items-center justify-center cursor-pointer 
									hover:bg-gray-100 transition-colors duration-200
									${selectedMonth === month ? "bg-gray-200" : "bg-white"}
									${index < months.length - 1 ? "border-b border-[#00000020]" : ""}
									${index === months.length - 1 ? "rounded-b-xl" : ""}
								`}
							>
								{month}
							</button>
						))}
					</div>
				)}
			</div>

			{typeof search === "string" && (
				<span className="max-[762px]:w-full">
					<Input
						placeholder="Поиск"
						onChange={(e) => setSearch?.(e.target.value)}
						value={search}
						className="min-[763px]:w-[350px] pr-13 max-[762px]:w-full"
					/>
					<span className="absolute -ml-11 mt-3.5">
						<img
							src="/icons/search.png"
							alt="search"
							className="w-[25px] h-[25px]"
						/>
					</span>
				</span>
			)}
		</header>
	);
}
