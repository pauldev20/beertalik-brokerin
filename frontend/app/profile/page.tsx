"use client";

import BottomNavbar from "@/components/bottomNavbar";
import { useRouter } from "next/navigation";

export default function Profile() {
	const router = useRouter();

	return (<>
		<BottomNavbar items={[
			{ icon: "HomeIcon", label: "Home", onClick: () => router.replace("/main") },
			{ icon: "UserIcon", label: "Profile", active: true },
		]}/>
	</>)
}
