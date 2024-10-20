import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { polygonAmoy } from "wagmi/chains";
import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";

export default function useBeerBalance(addr: string) {
	const { primaryWallet } = useDynamicContext();

	let { data: balance } = useReadContract({
		abi: erc20Abi,
		address: addr as `0x${string}`,
		functionName: 'balanceOf',
		args: [primaryWallet?.address as `0x${string}`],
		chainId: polygonAmoy.id
	});

	return balance;
}
