import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { polygonAmoy } from "wagmi/chains";
import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";

export default function useBeerBalance(addr: string) {
	const { primaryWallet } = useDynamicContext();

	let { data: balance, refetch, isLoading } = useReadContract({
		abi: erc20Abi,
		address: addr as `0x${string}`,
		functionName: 'balanceOf',
		args: [primaryWallet?.address as `0x${string}`],
		chainId: polygonAmoy.id
	});

	return {beerBalance: isLoading ? undefined : balance, refetchBeer: refetch, isLoading};
}
