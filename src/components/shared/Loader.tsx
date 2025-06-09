import React from "react";

interface LoaderProps {
	size?: "small" | "medium" | "large";
	text?: string;
	className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
	size = "medium",
	text,
	className = "",
}) => {
	const sizeClasses = {
		small: "w-6 h-6",
		medium: "w-8 h-8",
		large: "w-12 h-12",
	};

	const textSizeClasses = {
		small: "text-sm",
		medium: "text-base",
		large: "text-lg",
	};

	return (
		<div className={`flex flex-col items-center justify-center ${className}`}>
			<div
				className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 ${sizeClasses[size]}`}
			></div>
			{text && (
				<p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>{text}</p>
			)}
		</div>
	);
};

// Компонент для отображения лоадера на всю страницу
export const FullPageLoader: React.FC<{ text?: string }> = ({ text }) => {
	return (
		<div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
			<Loader size="large" text={text || "Загрузка..."} />
		</div>
	);
};

// Компонент для отображения лоадера в контейнере
export const ContainerLoader: React.FC<{
	text?: string;
	className?: string;
}> = ({ text, className = "" }) => {
	return (
		<div className={`flex justify-center items-center py-8 ${className}`}>
			<Loader size="medium" text={text || "Загрузка..."} />
		</div>
	);
};
