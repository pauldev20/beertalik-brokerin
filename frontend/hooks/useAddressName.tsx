import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useReadContract } from "wagmi";
import { sepolia } from "wagmi/chains";

import ensAbi from "@/contracts/ensAbi.json";

export default function useAddressName() {
	const { primaryWallet } = useDynamicContext();

	const { data: nameData, refetch: refetchName } = useReadContract({
		abi: ensAbi,
		address: process.env.NEXT_PUBLIC_CUSTOM_ENS_CONTRACT_ADDRESS as `0x${string}`,
		functionName: 'getName',
		args: [primaryWallet?.address as `0x${string}`],
		chainId: sepolia.id
	});

	return {
		name: (nameData ? (!String(nameData).startsWith('.') ? String(nameData) : undefined) : undefined),
		refetchName
	}
}
