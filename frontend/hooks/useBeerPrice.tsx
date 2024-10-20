import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { polygonAmoy } from "wagmi/chains";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";

import partyAbi from "@/contracts/partyAbi.json";

export default function useBeerPrice(partyAddr: string) {
	const { primaryWallet } = useDynamicContext();

	let { data: price, refetch, isLoading } = useReadContract({
		abi: partyAbi,
		address: partyAddr as `0x${string}`,
		functionName: 'getPrice',
		chainId: polygonAmoy.id
	});

	return {beerPrice: isLoading ? undefined : formatUnits(BigInt(price as bigint) || BigInt(0), 6), refetchBeerPrice: refetch, isLoading};
}
