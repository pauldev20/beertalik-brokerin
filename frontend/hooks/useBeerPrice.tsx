import { useReadContract } from "wagmi";
import { formatUnits } from "viem";

import partyAbi from "@/contracts/partyAbi.json";

export default function useBeerPrice(partyAddr: string) {
	let { data: price, refetch, isLoading } = useReadContract({
		abi: partyAbi,
		address: partyAddr as `0x${string}`,
		functionName: 'getPrice',
		// @ts-ignore
		chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
	});

	return {beerPrice: isLoading ? undefined : formatUnits(BigInt(price as bigint) || BigInt(0), 6), refetchBeerPrice: refetch, isLoading};
}
