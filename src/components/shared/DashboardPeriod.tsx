import type React from "react";
import Input from "../Input";

interface Props {
	search?: string;
	setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

export default function DashboardPeriod({ search, setSearch }: Props) {
	return (
		<header
			className={`flex max-sm:flex-col max-[762px]:gap-10 ${
				typeof search === "string"
					? "sm:justify-between max-sm:items-baseline"
					: "justify-center"
			} w-full mb-12`}
		>
			<div className="bg-[#FFFFFF] max-[762px]:flex-wrap max-[762px]:w-full border-2 border-[#00000033] overflow-hidden rounded-xl min-[762px]-h-[60px] min-[762px]:flex self-center min-[762px]:items-center">
				<span className="min-[762px]:border-r-2 max-[762px]:border-b-2 bg-[#FFFFFF] h-[60px] flex items-center justify-center w-[180px] max-[762px]:w-full border-[#00000033] ">
					Сегодня
				</span>
				<span className="min-[762px]:border-r-2 bg-[#FFFFFF] max-[762px]:border-b-2 h-[60px] flex items-center justify-center min-[762px]:w-[180px] max-[762px]-w-full border-[#00000033] ">
					Вчера
				</span>
				<span className="min-[762px]:border-r-2 bg-[#FFFFFF] max-[762px]:border-b-2 h-[60px] flex items-center justify-center min-[762px]:w-[180px] border-[#00000033] ">
					Неделя
				</span>
				<span className="flex items-center bg-[#FFFFFF] h-[60px] justify-center min-[762px]:w-[180px] max-[762px]:w-full rounded-b-xl">
					Месяц
				</span>
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
