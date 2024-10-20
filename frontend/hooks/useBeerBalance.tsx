import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";

export default function useBeerBalance(addr: string) {
	const { primaryWallet } = useDynamicContext();

	let { data: balance, refetch, isLoading } = useReadContract({
		abi: erc20Abi,
		address: addr as `0x${string}`,
		functionName: 'balanceOf',
		args: [primaryWallet?.address as `0x${string}`],
		// @ts-ignore
		chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
	});

	return {beerBalance: isLoading ? undefined : balance, refetchBeer: refetch, isLoading};
}
