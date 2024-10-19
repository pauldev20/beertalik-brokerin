import clsx from "clsx";
import DynamicHeroIcon, { IconName } from "./dynamicHeroIcon";

export interface BottomNavbarItemProps {
	icon: IconName;
	label: string;
	active?: boolean;
	onClick?: () => void;
}
export function BottomNavbarItem({ icon, label, active, onClick }: BottomNavbarItemProps) {
	return (
		<div className="flex flex-col items-center active:opacity-50 transition-opacity duration-100" onClick={onClick}>
			<DynamicHeroIcon iconName={icon} className="size-9" variant={active ? "solid" : "outline"}/>
			<span className="font-bold">{label}</span>
		</div>
	)
}

interface BottomNavbarProps {
	items: BottomNavbarItemProps[];
	className?: string;
}
export default function BottomNavbar({ items, className }: BottomNavbarProps) {
	return (
		<footer className={clsx("z-20 bg-background bottom-0 left-0 right-0 p-3 flex justify-around shadow-top shadow-slate-300 dark:shadow-gray-300 rounded-t-lg", className)}>
			{items.map((item, index) => (
				<BottomNavbarItem key={index} {...item}/>
			))}
		</footer>
	)
}
