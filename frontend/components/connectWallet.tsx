"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@nextui-org/react";
import { redirect, RedirectType } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function ConnectWalletButton() {
	const { setShowAuthFlow, user, sdkHasLoaded } = useDynamicContext();
	const { isConnected } = useAccount();

	useEffect(() => {
		if (isConnected) {
			redirect("/main", RedirectType.replace);
		}
	}, [isConnected]);

	return (
		<Button color="primary" size="lg" onClick={() => setShowAuthFlow(true)} isLoading={!sdkHasLoaded || (sdkHasLoaded && user != undefined)}>
			Log In / Sign Up
		</Button>
	);
};
