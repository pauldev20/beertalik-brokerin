import { Modal, ModalContent, ModalHeader, ModalBody, Input, Button } from "@nextui-org/react";
// @ts-expect-error idk
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import { DynamicUserProfile, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { UserIcon } from "@heroicons/react/24/outline";
import IconButton from "./iconButton";
import { useState } from "react";
import useAddressName from "@/hooks/useAddressName";

interface ConnectWristbandModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	refresh?: () => void;
}
export default function ConnectWristbandModal({ isOpen, onOpenChange, refresh }: ConnectWristbandModalProps) {
	const { setShowDynamicUserProfile } = useDynamicContext();
	const { primaryWallet } = useDynamicContext();
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState("");
	const name = useAddressName();

	async function btnClick() {
		setLoading(true);
		try {
			if (name === undefined) {
				console.log("Registering (Sending FUnds)");
				await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(`${process.env.NEXT_PUBLIC_SERVER_URL}/fund-poly?address=${primaryWallet?.address}`));
			}
			const result = await execHaloCmdWeb({
			  name: "get_pkeys"
			});
			const address = result["etherAddresses"]["1"];
			const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(`${process.env.NEXT_PUBLIC_SERVER_URL}/register?name=${username}&address=${address}`));
			onOpenChange(false);
			refresh && refresh();
			setLoading(false);
		} catch (e) {
			console.log(e);
			setLoading(false);
		}
	}
// burnBeer (nfc isAddress, uint256 amount) public {
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
