import clsx from "clsx";

interface IconButtonProps {
	icon: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

export default function IconButton({ icon, className, onClick }: IconButtonProps) {
	return (
		<div className={clsx("active:opacity-50 transition-opacity duration-100", className)} onClick={onClick}>
			{icon}
		</div>
	)
}
