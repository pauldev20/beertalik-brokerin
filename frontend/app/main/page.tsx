"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Button } from "@nextui-org/react"

export default function Main() {
	const { handleLogOut } = useDynamicContext();

	return (
		<div>
			<Button color="primary" size="lg" onClick={() => handleLogOut()}>
				LogOut
			</Button>
		</div>
	)
}
