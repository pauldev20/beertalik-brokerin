import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useLogin(isLogin = false) {
	const { primaryWallet } = useDynamicContext();
	const { sdkHasLoaded } = useDynamicContext();
	const router = useRouter();

	useEffect(() => {
		if (sdkHasLoaded && primaryWallet && isLogin) {
			router.replace("/main");
		} else if (sdkHasLoaded && !primaryWallet && !isLogin) {
			router.replace("/");
		}
	}, [sdkHasLoaded, primaryWallet, router]);

	return null;
}
