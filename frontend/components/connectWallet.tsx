"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@nextui-org/react";
import useLogin from "@/hooks/useLogin";

export default function ConnectWalletButton() {
	const { setShowAuthFlow, user, sdkHasLoaded } = useDynamicContext();
	useLogin(true);

	return (
		<Button className="w-full" color="primary" size="lg" onClick={() => setShowAuthFlow(true)} isLoading={!sdkHasLoaded || (sdkHasLoaded && user != undefined)}>
			Log In / Sign Up
		</Button>
	);
};
