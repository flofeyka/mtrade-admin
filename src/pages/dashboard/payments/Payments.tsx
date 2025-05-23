import React, { useEffect } from "react";
import DashboardPeriod from "../../../components/shared/DashboardPeriod";

interface PaymentData {
	id: string;
	datetime: string;
	fullName: string;
	email: string;
	source: string;
	product: string;
	amount: number;
	promoCode: string;
}

export default function Payments() {
	const [search, setSearch] = React.useState<string>("");
	const [payments, setPayments] = React.useState<PaymentData[]>([]);

	useEffect(() => {
		setPayments([
			{
				id: "PAY-20240523-001",
				datetime: "23.05.2025 10:12",
				fullName: "Анна Кузнецова",
				email: "anna.kuz@example.com",
				source: "Кнопка “Купить”",
				product: "Онлайн-курс “JS Pro”",
				amount: 3990,
				promoCode: "SPRING2025",
			},
			{
				id: "PAY-20240523-002",
				datetime: "23.05.2025 11:45",
				fullName: "Дмитрий Орлов",
				email: "d.orlov@mail.ru",
				source: "Кнопка “Попробовать бесплатно”",
				product: "Подписка на 1 месяц",
				amount: 0,
				promoCode: "",
			},
			{
				id: "PAY-20240523-003",
				datetime: "23.05.2025 12:10",
				fullName: "Светлана Лебедева",
				email: "sveta.leb@yandex.ru",
				source: "Кнопка “Оплатить”",
				product: "Мастер-класс “React Hooks”",
				amount: 1490,
				promoCode: "REACT2025",
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
					<div className="flex border-b-2 border-[#00000033]">
						{[
							"ID Оплаты",
							"Дата и время",
							"Имя Фамилия",
							"Почта",
							"Источник (Кнопка)",
							"Продукт",
							"Сумма",
							"Промо-код",
						].map((header, index) => (
							<span
								key={index}
								className={`w-[260px] break-all text-center py-6.5 ${
									index < 8 ? "border-r-2 border-[#00000033]" : ""
								}`}
							>
								{header}
							</span>
						))}
					</div>
					{payments.map((pay: PaymentData) => (
						<div key={pay.id} className="flex border-b border-gray-200 text-sm">
							<span className="w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{pay.id}
							</span>
							<span className="w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{pay.datetime}
							</span>
							<span className="w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{pay.fullName}
							</span>
							<span className="w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{pay.email}
							</span>
							<span className="w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{pay.source}
							</span>
							<span className="w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{pay.product}
							</span>
							<span className="w-[260px] text-center py-4 border-r-2 border-[#00000033]">
								{pay.amount} ₽
							</span>
							<span className="w-[260px] text-center py-4">
								{pay.promoCode || "—"}
							</span>
						</div>
					))}
				</div>
				<div className="flex justify-between text-3xl">
					<span>
						Отображается {payments.length} из {payments.length}
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
