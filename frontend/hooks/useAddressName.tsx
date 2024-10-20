import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { sepolia } from "wagmi/chains";

import ensAbi from "@/contracts/ensAbi.json";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/wagmi";
import partyAbi from "@/contracts/partyAbi.json";
import { useEffect, useState } from "react";

export async function getENSAddessForNFC(address: string) {
	const nameData = await readContract(config, {
		abi: ensAbi,
		address: process.env.NEXT_PUBLIC_CUSTOM_ENS_CONTRACT_ADDRESS as `0x${string}`,
		functionName: 'getName',
		args: [address as `0x${string}`],
		chainId: sepolia.id
	});
	return (nameData ? (!String(nameData).startsWith('.') ? String(nameData) : undefined) : undefined);
}

export default function useAddressName(partyAddress: string) {
	const { primaryWallet } = useDynamicContext();
	const [nameData, setNameData] = useState<string | undefined>(undefined);

	const fetchName = async () => {
		try {
			const nfcWalletAddress = await readContract(config, {
				abi: partyAbi,
				address: partyAddress as `0x${string}`,
				functionName: 'walletToNfc',
				args: [primaryWallet?.address as `0x${string}`],
				// @ts-expect-error idk
				chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
			});
			console.log("NFC Wallet Address", nfcWalletAddress);
			const nameDataRes = await getENSAddessForNFC(nfcWalletAddress as string);
			console.log("Name Data", nameDataRes);
			setNameData(nameDataRes);
		} catch (e) {
			console.log(e);
		}
	}
	useEffect(() => {
		fetchName();
	}, [partyAddress]);

	return {
		name: nameData,
		refetchName: fetchName
	}
}
