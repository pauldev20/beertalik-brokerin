"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@nextui-org/react";

export default function ConnectWalletButton() {
	const { setShowAuthFlow } = useDynamicContext();

	return (
		<Button color="primary" size="lg" onClick={() => setShowAuthFlow(true)}>
			Log In / Sign Up
		</Button>
	);
};
