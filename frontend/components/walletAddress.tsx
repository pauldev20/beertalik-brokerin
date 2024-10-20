import ConnectWristbandModal from "@/components/connectWristbandModal";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Link, useDisclosure } from "@nextui-org/react";
import useAddressName from "@/hooks/useAddressName";
import clsx from "clsx";

interface WalletAddressProps {
	className?: string;
}
export default function WalletAddress({ className }: WalletAddressProps) {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const { name, refetchName } = useAddressName();
	const { primaryWallet } = useDynamicContext();

	const shortenedAddress = primaryWallet?.address.slice(0, 6) + "..." + primaryWallet?.address.slice(-4);

	const refetch = () => {
		console.log("Refetching name");
		refetchName();
	}

	return (<>
		<ConnectWristbandModal isOpen={isOpen} onOpenChange={onOpenChange} refresh={refetch} />
		<Link color="primary" className={clsx(className, "cursor-pointer")} onClick={onOpen}>{name !== undefined ? name : shortenedAddress}</Link>
	</>)
}
