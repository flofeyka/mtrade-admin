import React from "react";
import Button from "../../../components/Button";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

interface Notification {
	date: Date;
	message: string;
}

interface TopButton {
	id: number;
	button: string;
	clickCount: number | undefined;
}

export default function Statistics() {
	const [topButtons, setTopButtons] = React.useState<TopButton[]>([]);

	const [notifications, setNotifications] = React.useState<Notification[]>([]);

	React.useEffect(() => {
		setNotifications([
			{
				date: new Date(),
				message:
					"У пользователя № 5098 через 14 дней заканчивается подписка. Оповестите его и убедитесь в намерениях о продлении.",
			},
			{
				date: new Date(),
				message:
					"У пользователя № 5098 через 14 дней заканчивается подписка. Оповестите его и убедитесь в намерениях о продлении.",
			},
			{
				date: new Date(),
				message:
					"У пользователя № 5098 через 14 дней заканчивается подписка. Оповестите его и убедитесь в намерениях о продлении.",
			},
		]);

		setTopButtons([
			{
				id: 1,
				button: "“Попробовать демо” Блок 1",
				clickCount: 7,
			},
			{
				id: 2,
				button: "“Узнать больше” Блок 3",
				clickCount: 7,
			},
			{
				id: 3,
				button: "",
				clickCount: undefined,
			},
		]);
	}, []);

	return (
		<div className="w-[85vw] flex flex-col self-center">
			<DashboardPeriod />
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
									<span className="w-[225px] text-center py-5">10</span>
								</div>
								<div className="flex">
									<span className="w-[225px] border-[#00000033] py-5 border-r-2 text-center">
										Количество заявок
									</span>
									<span className="w-[225px] text-center py-5">2</span>
								</div>
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-[225px] border-[#00000033] border-r-2 py-5 text-center">
										Количество оплат
									</span>
									<span className="w-[225px] text-center py-5">1</span>
								</div>
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-[225px] border-[#00000033] border-r-2 py-5 text-center">
										Незавершенные <br /> оплаты
									</span>
									<span className="w-[225px] text-center py-5">3</span>
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
								{topButtons.map((button) => (
									<div className="flex border-[#00000033] border-t-2">
										<span className="w-[260px] border-[#00000033] border-r-2 py-6.5 text-center">
											{button.id}
										</span>
										<span className="w-[260px] border-[#00000033] border-r-2  text-center py-6.5">
											{button.button}
										</span>
										<span className="w-[260px] text-center py-6.5">
											{button.clickCount}
										</span>
									</div>
								))}
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
							{notifications.map((button) => (
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-[20%] min-w-[100px] border-[#00000033] border-r-2 py-4 text-center">
										{button.date.toLocaleDateString("ru-RU", {
											month: "long",
											day: "2-digit",
											hour: "numeric",
											minute: "numeric",
										})}
									</span>
									<span className="w-[80%] min-w-[600px] border-[#00000033] border-r-2  text-center py-4">
										{button.message}
									</span>
								</div>
							))}
						</div>
					</span>
					<div className="flex justify-end gap-3 text-3xl">
						<span>1</span>
						<span>2</span>
						<span>3</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
