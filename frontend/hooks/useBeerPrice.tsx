import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import abi from "@/contracts/partyAbi.json";
import { polygonAmoy } from "wagmi/chains";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";

export default function useBeerPrice(partyAddr: string) {
	const { primaryWallet } = useDynamicContext();

	let { data: price, refetch, isLoading } = useReadContract({
		abi,
		address: partyAddr as `0x${string}`,
		functionName: 'getPrice',
		chainId: polygonAmoy.id
	});

	return {beerPrice: isLoading ? undefined : formatUnits(BigInt(price as bigint) || BigInt(0), 6), refetchBeerPrice: refetch, isLoading};
}
