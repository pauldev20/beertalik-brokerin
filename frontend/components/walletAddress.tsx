import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Link, useDisclosure } from "@nextui-org/react";
import clsx from "clsx";

import ConnectWristbandModal from "@/components/connectWristbandModal";

import useAddressName from "@/hooks/useAddressName";

interface WalletAddressProps {
	className?: string;
	partyAddress: string;
}
export default function WalletAddress({ className, partyAddress }: WalletAddressProps) {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const { name, refetchName } = useAddressName(partyAddress);
	const { primaryWallet } = useDynamicContext();

	const shortenedAddress = primaryWallet?.address.slice(0, 6) + "..." + primaryWallet?.address.slice(-4);

	const refetch = () => {
		console.log("Refetching name");
		refetchName();
	}

	return (<>
		<ConnectWristbandModal isOpen={isOpen} onOpenChange={onOpenChange} refresh={refetch} partyAddr={partyAddress}/>
		<Link color="primary" className={clsx(className, "cursor-pointer")} onClick={onOpen}>{name !== undefined ? name : shortenedAddress}</Link>
	</>)
}
