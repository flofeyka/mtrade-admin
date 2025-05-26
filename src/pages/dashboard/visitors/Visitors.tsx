import React, { useEffect } from "react";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

interface TrafficRecord {
	id: string;
	trafficSource: string;
	utmTags: string;
	country: string;
	device: string;
	browser: string;
	pagesViewed: number;
	timeOnSite: string; // Например, "2 мин 35 сек"
	cookieFile: string; // URL или имя файла
}

export default function Visitors() {
	const [search, setSearch] = React.useState<string>("");
	const [visitors, setVisitors] = React.useState<TrafficRecord[]>([]);

	useEffect(() => {
		setVisitors([
			{
				id: "TRF-001",
				trafficSource: "Google Ads",
				utmTags: "utm_source=google&utm_medium=cpc&utm_campaign=spring_sale",
				country: "Россия",
				device: "Мобильный",
				browser: "Chrome",
				pagesViewed: 5,
				timeOnSite: "3 мин 12 сек",
				cookieFile: "cookie-001.json",
			},
			{
				id: "TRF-002",
				trafficSource: "Instagram",
				utmTags: "utm_source=insta&utm_medium=social&utm_campaign=leadgen",
				country: "Казахстан",
				device: "ПК",
				browser: "Safari",
				pagesViewed: 2,
				timeOnSite: "1 мин 03 сек",
				cookieFile: "cookie-002.json",
			},
			{
				id: "TRF-003",
				trafficSource: "Прямой переход",
				utmTags: "",
				country: "Беларусь",
				device: "ПК",
				browser: "Firefox",
				pagesViewed: 7,
				timeOnSite: "4 мин 45 сек",
				cookieFile: "cookie-003.json",
			},
		]);
	}, []);

	return (
		<div>
			<header>
				<DashboardPeriod search={search} setSearch={setSearch} />
			</header>

			<main>
				<div className="bg-[#FFFFFF] overflow-x-auto rounded-xl border-2 border-[#00000033]">
					<div className="flex">
						{[
							"ID",
							"Источник трафика",
							"UTM-метки",
							"Страна",
							"Устройство",
							"Браузер",
							"Просмотрено страниц",
							"Время на сайте",
							"Файл с Cookie",
						].map((header, index) => (
							<span
								key={index}
								className={`min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-6.5 ${
									index < 8 ? "border-r-2" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{visitors.map((entry) => (
						<div key={entry.id} className="flex text-sm">
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.id}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.trafficSource}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.utmTags || "—"}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.country}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.device}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.browser}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.pagesViewed}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4 border-r-2">
								{entry.timeOnSite}
							</span>
							<span className="min-w-[240px] border-b-2 border-[#00000033] break-all text-center py-4">
								{entry.cookieFile}
							</span>
						</div>
					))}
				</div>
				<div className="flex justify-between text-3xl max-[762px]:text-xl">
					<span>
						Отображается {visitors.length} из {visitors.length}
					</span>
					<span className="flex gap-3">
						<span>1</span>
						<span>2</span>
						<span>3</span>
					</span>
				</div>
			</main>
		</div>
	);
}
