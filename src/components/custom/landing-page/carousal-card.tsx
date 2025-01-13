import React, { useState } from "react";
import CustomOutlineButton from "../shared/CustomOutlineButton";
import { cn } from "@/lib/utils";

interface CardProps {
	imageSrc: string;
	title: string;
	description: string;
	buttonText: string;
	containerClasses?: string;
	imageClasses?: string;
	titleClasses?: string;
	descriptionClasses?: string;
	buttonClasses?: string;
	comingSoon?: boolean;
	onClick?: () => void;
}

const CarousalCard: React.FC<CardProps> = ({
	imageSrc,
	title,
	description,
	buttonText,
	containerClasses,
	imageClasses,
	titleClasses,
	descriptionClasses,
	buttonClasses,
	comingSoon = false,
	onClick
}) => {
	
	const [isClicked, setIsClicked] = useState(false);

	const handleClick = () => {
		setIsClicked(true);
		if (onClick) {
			onClick();
		}
	}
	return (
		<div
			className={cn(
				"w-auto md:w-[461px]",
				containerClasses,
				
			)}
			onClick={handleClick}
		>
			<div className="relative">
				<img
					className={cn(
						"h-[300px] object-cover rounded-3xl md:object-cover md:w-full",
						comingSoon && !isClicked ? "filter grayscale" : "",
						comingSoon ? "h-[218px]" : "",
						imageClasses
					)}
					src={imageSrc}
					alt="Card Image"
				/>

				{comingSoon && !isClicked && (
					<div
						className="absolute top-4 right-4 bg-white bg-opacity-90 text-su_primary_bg font-semibold font-Urbanist text-xs md:text-sm py-1 px-2 rounded-lg"
					>
						Coming soon
					</div>
				)}
			</div>
			<p
				className={cn(
					"w-[300px] text-su_primary_bg font-semibold font-Urbanist text-lg md:w-[401px] md:text-2xl mt-4",
					titleClasses
				)}
			>
				{title}
			</p>
			<p className={`w-[300px] mb-2 text-su_primary_black font-Urbanist font-normal text-xs md:text-sm mt-1 md:w-[401px] ${descriptionClasses}`}>
				{description}
			</p>

			<CustomOutlineButton
				className={cn(
					"px-2 md:px-6 py-2 md:py-2 font-Urbanist font-bold text-xs md:text-sm",
					comingSoon && !isClicked ?  "!bg-su_greyed_bg text-su_greyed" : "!bg-su_primary !text-su_primary_bg",
					buttonClasses
				)}
				containerClasses={comingSoon && !isClicked ? "bg-transparent" : ""}
			>
				{buttonText}
			</CustomOutlineButton>
		</div>
	);
};

export default CarousalCard;
