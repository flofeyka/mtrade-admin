import type React from "react";

export default function Input({
	className,
	...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={`bg-[#B3B3B3] rounded-[20px] text-2xl placeholder:text-black border-[#797979] border-3 placeholder:text-center p-2 ${className}`}
			{...props}
		/>
	);
}
