"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';
import { Button } from "@nextui-org/react";

export default function Main() {
	const { handleLogOut } = useDynamicContext();
	const router = useRouter();

	const logout = async () => {
		handleLogOut();
		router.replace("/");
	}

	return (
		<div>
			<Button color="primary" size="lg" onClick={logout}>
				LogOut
			</Button>
		</div>
	)
}
