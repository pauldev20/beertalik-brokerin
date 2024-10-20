import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export default function useLogin(isLogin = false) {
	const { sdkHasLoaded } = useDynamicContext();
	const { isConnected } = useAccount();
	const router = useRouter();

	useEffect(() => {
		console.log("Checking login status", sdkHasLoaded, isConnected, isLogin);
		if (sdkHasLoaded && isConnected && isLogin) {
			router.replace("/main");
		} else if (sdkHasLoaded && !isConnected) {
			router.replace("/");
		}
	}, [sdkHasLoaded, isConnected, router]);

	return null;
}
