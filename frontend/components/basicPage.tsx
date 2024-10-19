import BottomNavbar, { BottomNavbarItemProps } from "./bottomNavbar";
import IconButton from "./iconButton";

interface BasicPageProps {
	children?: React.ReactNode;
	navbarItems?: BottomNavbarItemProps[];
	topLeftBtn?: React.ReactNode;
	topRightBtn?: React.ReactNode;
	topLeftClick?: () => void;
	topRightClick?: () => void;
	emoji?: string;
	pageTitle?: string;
}
export default function BasicPage({ children, navbarItems, topLeftBtn, topRightBtn, topLeftClick, topRightClick, emoji, pageTitle }: BasicPageProps) {
	return (
		<div className="h-[100svh] w-screen flex flex-col items-center">
			<header className="w-full top-0 left-0 right-0 p-4 flex justify-between">
				{topLeftBtn ? <IconButton icon={topLeftBtn} className="size-8" onClick={topLeftClick} /> : <div className="size-8"/>}
				{topRightBtn ? <IconButton icon={topRightBtn} className="size-8" onClick={topRightClick} /> : <div className="size-8"/>}
			</header>
			<main className="w-full flex-grow p-5 flex flex-col gap-3 overflow-hidden">
				{(emoji || pageTitle) && <div className="flex items-end gap-3">
					{emoji && <span style={{fontSize: "60px", lineHeight: "60px"}}>{emoji}</span>}
					{pageTitle && <h1 className="text-4xl font-bold text-center">{pageTitle}</h1>}
				</div>}
				{children}
			</main>
			{navbarItems && <BottomNavbar items={navbarItems} className="w-full self-end"/>}
		</div>
	)
}
