import type React from "react";
import Input from "../../Input";

export type PeriodType = "today" | "yesterday" | "week" | "month" | null;

interface Props {
	search?: string;
	setSearch?: React.Dispatch<React.SetStateAction<string>>;
	selectedPeriod?: PeriodType;
	onPeriodChange?: (period: PeriodType) => void;
}

export default function DashboardPeriod({
	search,
	setSearch,
	selectedPeriod,
	onPeriodChange,
}: Props) {
	const periods = [
		{ key: "today", label: "Сегодня" },
		{ key: "yesterday", label: "Вчера" },
		{ key: "week", label: "Неделя" },
		{ key: "month", label: "Месяц" },
	] as const;

	const handlePeriodClick = (period: PeriodType) => {
		if (onPeriodChange) {
			// Если кликнули на уже выбранный период, сбрасываем
			onPeriodChange(selectedPeriod === period ? null : period);
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
							h-[60px] flex items-center justify-center w-[180px] max-[762px]:w-full border-[#00000033] 
							hover:bg-gray-100 transition-colors duration-200
							${index === periods.length - 1 ? "rounded-b-xl" : ""}
						`}
					>
						{period.label}
					</button>
				))}
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
