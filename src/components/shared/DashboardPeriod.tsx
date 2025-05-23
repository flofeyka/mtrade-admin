import type React from "react";
import Input from "../Input";

interface Props {
	search?: string;
	setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

export default function DashboardPeriod({ search, setSearch }: Props) {
	return (
		<header
			className={`flex ${
				typeof search === "string" ? "justify-between" : "justify-center"
			} w-full mb-12`}
		>
			<div className="bg-[#FFFFFF] border-2 border-[#00000033] rounded-xl h-[60px] flex self-center items-center">
				<span className="border-r-2 flex items-center justify-center w-[180px] border-[#00000033] h-full">
					Сегодня
				</span>
				<span className="border-r-2 flex items-center justify-center w-[180px] border-[#00000033] h-full">
					Вчера
				</span>
				<span className="border-r-2 flex items-center justify-center w-[180px] border-[#00000033] h-full">
					Неделя
				</span>
				<span className="flex items-center justify-center w-[180px] h-full">
					Месяц
				</span>
			</div>

			{typeof search === "string" && (
				<span>
					<Input
						placeholder="Поиск"
						onChange={(e) => setSearch?.(e.target.value)}
						value={search}
						className="w-[350px] pr-13"
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
