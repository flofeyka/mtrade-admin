import type React from "react";

export default function Input(
	props: React.InputHTMLAttributes<HTMLInputElement>
) {
	return (
		<input
			className="bg-[#B3B3B3] rounded-[15px] border-[#797979] border-3 p-2"
			{...props}
		/>
	);
}
