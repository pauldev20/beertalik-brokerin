import { Modal, ModalContent, ModalHeader, ModalBody, Input, Button } from "@nextui-org/react";
import { DynamicUserProfile, useDynamicContext } from "@dynamic-labs/sdk-react-core";
// @ts-expect-error idk
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import { UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import IconButton from "@/components/iconButton";

import useAddressName from "@/hooks/useAddressName";

import partyAbi from "@/contracts/partyAbi.json";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { config } from "@/lib/wagmi";

interface ConnectWristbandModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	refresh?: () => void;
	partyAddr: string;
}
export default function ConnectWristbandModal({ isOpen, onOpenChange, refresh, partyAddr }: ConnectWristbandModalProps) {
	const { setShowDynamicUserProfile } = useDynamicContext();
	const { primaryWallet } = useDynamicContext();
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState("");
	const { name } = useAddressName(partyAddr);

	async function btnClick() {
		setLoading(true);
		try {
			const apiEnd = {
				80002: "poly",
				48899: "zircuit",
				974399131: "skale",
				545: "flow",
				2810: "morph"
			}[await primaryWallet?.getNetwork() || 0];
			console.log("Using API", apiEnd);
			if (name === undefined) {
				console.log("Registering (Sending Funds)");
				await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(`${process.env.NEXT_PUBLIC_SERVER_URL}/fund-${apiEnd}?address=${primaryWallet?.address}`));
			}
			const result = await execHaloCmdWeb({
			  name: "get_pkeys"
			});
			const address = result["etherAddresses"]["1"];
			await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(`${process.env.NEXT_PUBLIC_SERVER_URL}/register?name=${username}&address=${address}`));
			const resultApprove = await writeContract(config, {
				abi: partyAbi,
				address: partyAddr as `0x${string}`,
				functionName: 'approveNFC',
				args: [address],
				// @ts-expect-error idk
				chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
			});
			await waitForTransactionReceipt(config, {
				hash: resultApprove,
				confirmations: 1
			});
			if (refresh) {
				refresh();
			}
			onOpenChange(false);
			setLoading(false);
		} catch (e) {
			console.log(e);
			setLoading(false);
		}
	}

	return (<>
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton isDismissable={!loading}>
			<ModalContent>
				<ModalHeader className="flex items-center justify-between">
					Set Name & Wristband
					<IconButton icon={<UserIcon className="size-6"/>} onClick={() => {onOpenChange(false); setShowDynamicUserProfile(true);}} />
				</ModalHeader>
				<ModalBody>
					<Input type="text" label="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
					<Button color="primary" className="mb-5" isLoading={loading} onClick={btnClick}>
						Connect Wristband
					</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
		<DynamicUserProfile />
	</>)
}
