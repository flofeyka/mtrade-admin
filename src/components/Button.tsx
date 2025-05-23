export default function Button({
	children,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={`bg-[#B3B3B3] cursor-pointer rounded-[15px] p-2 border-3 border-[#797979] ${props.className}`}
		>
			{children}
		</button>
	);
}
