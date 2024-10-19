"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';
import { Button } from "@nextui-org/react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function ConnectWalletButton() {
	const { setShowAuthFlow, user, sdkHasLoaded } = useDynamicContext();
	const { isConnected } = useAccount();
	const router = useRouter();

	useEffect(() => {
		if (isConnected) {
			router.replace("/main");
		}
	}, [isConnected, router]);

	return (
		<Button color="primary" size="lg" onClick={() => setShowAuthFlow(true)} isLoading={!sdkHasLoaded || (sdkHasLoaded && user != undefined)}>
			Log In / Sign Up
		</Button>
	);
};
