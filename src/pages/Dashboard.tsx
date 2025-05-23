import { useState } from "react";
import Button from "../components/Button";

export default function Dashboard() {
	const [topButtons, setTopButtons] = useState([
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

	const [notifications, setNotifications] = useState([
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

	return (
		<div className="min-h-screen h-full w-full p-10 bg-[#B3B3B380] flex flex-col gap-10">
			<header className="flex gap-6 items-center justify-between">
				<span className="bg-white flex relative rounded-xl border-[#0000008F] border-2">
					<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
						📊 Дашборд
					</div>
					<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
						📥 Заявки
					</div>
					<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
						💳 Оплаты
					</div>
					<div className="border-r-2 w-[135px] text-center text-center cursor-pointer border-[#00000033] p-3">
						⚠️ Незав. <br /> оплаты
					</div>
					<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
						📈 Аналитика
					</div>
					<div className="border-r-2  w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
						👤 Клиенты
					</div>
					<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3 text-center">
						👥 <br /> Посетители
					</div>
					<div className="border-r-2 w-[135px] text-center cursor-pointer border-[#00000033] p-2 py-3">
						Партнеры
					</div>
					<div className=" cursor-pointer w-[140px] text-center rounded-r-xl p-4">
						Напоминания
					</div>
				</span>

				<span className="flex flex-col gap-3">
					<Button className="p-3 w-[220px]">👤 administrator</Button>
					<Button className="p-3 w-[220px]">🔔 Уведомления (2)</Button>
				</span>
			</header>

			<main className="w-[85vw] flex flex-col self-center">
				<header className="flex justify-center">
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
				</header>

				<main className="mt-5">
					<div className="flex justify-between">
						<span className="flex flex-col items-center gap-7">
							<h3>Сводка</h3>
							<div className="bg-[#FFFFFF] rounded-xl border-2 border-[#00000033]">
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
							<div className="bg-[#FFFFFF] rounded-xl border-2 border-[#00000033]">
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

			<footer className="flex items-center flex-col w-[85vw] flex flex-col self-center">
				<Button className="w-[250px] my-5">Уведомления</Button>

				<div className="w-full mt-10">
					<span className="flex w-full flex-col items-center gap-7">
						<div className="bg-[#FFFFFF] w-full rounded-xl border-2 border-[#00000033]">
							{notifications.map((button) => (
								<div className="flex border-[#00000033] border-t-2">
									<span className="w-[20%] border-[#00000033] border-r-2 py-4 text-center">
										{button.date.toLocaleDateString("ru-RU", {
											month: "long",
											day: "2-digit",
											hour: "numeric",
											minute: "numeric",
										})}
									</span>
									<span className="w-[80%] border-[#00000033] border-r-2  text-center py-4">
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
