"use client";

import { ArrowLeftStartOnRectangleIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useReadContract } from "wagmi";

import BasicPage from "@/components/basicPage";

import useLogin from "@/hooks/useLogin";

import partyListAbi from "@/contracts/partyListAbi.json";

interface CreateEventModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}
function CreateEventModal({ isOpen, onOpenChange}: CreateEventModalProps) {
	const [loading, setLoading] = useState(false);

	const createEvent = async () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			onOpenChange(false);
		}, 1000);
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={!loading} hideCloseButton>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Create Event</ModalHeader>
				<ModalBody>
					<Input type="text" label="Event Name" />
					<Input type="text" label="Event Location" />
					<Button color="primary" onClick={createEvent} isLoading={loading}>Create Event</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

interface EventProps {
	name: string;
	addr: string;
}
function Event({ name, addr }: EventProps) {
	const router = useRouter();

	return (
		<div className="flex w-full justify-between items-center active:opacity-50 transition-opacity duration-100" onClick={() => router.replace(`/event?addr=${addr}`)}>
			<div className="flex flex-col">
				<h2 className="text-lg font-bold">{name}</h2>
				<h3 className="text-sm opacity-75">{addr}</h3>
			</div>
			<ChevronRightIcon className="size-8"/>
		</div>
	)
}

export default function MainPage() {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [results, setResults] = useState<EventProps[]>([]);
	const [events, setEvents] = useState<EventProps[]>([]);
	const [loading, setLoading] = useState(true);
	const { handleLogOut } = useDynamicContext();
	const router = useRouter();
	useLogin();

	const { data: partys } = useReadContract({
		abi: partyListAbi,
		address: process.env.NEXT_PUBLIC_PARTY_LIST_CONTRACT_ADDRESS as `0x${string}`,
		functionName: 'getPartyNames',
		// @ts-expect-error idk
		chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
	});
	useEffect(() => {
		if (partys === undefined) return;
		setEvents(partys as EventProps[]);
		setResults(partys as EventProps[]);
		setLoading(false);
	}, [partys]);

	const logout = async () => {
		handleLogOut();
		router.replace("/");
	}

	// @ts-expect-error idk
	const handleSearch = (event) => {
		const searchTerm = event.target.value.toLowerCase();
		const filteredResults = events.filter(event =>
			event.name.toLowerCase().includes(searchTerm) || 
			event.addr.toLowerCase().includes(searchTerm)
		);
		setResults(filteredResults);
	};

	return (<>
		<CreateEventModal isOpen={isOpen} onOpenChange={onOpenChange} />
		<BasicPage
			emoji="🏠"
			pageTitle="Events"
			topLeftBtn={<ArrowLeftStartOnRectangleIcon/>}
			topLeftClick={logout}
			topRightBtn={<PlusIcon/>}
			topRightClick={onOpen}
		>
			<Input isClearable type="text" placeholder="Search" startContent={<MagnifyingGlassIcon className="size-4" />} onChange={handleSearch} />
			{loading && <div className="flex flex-grow items-center justify-center gap-3">
				<Spinner size="lg" />
			</div>}
			{!loading && <div className="flex flex-col gap-1.5 flex-grow overflow-y-auto scrollbar-hide">
				{results.length > 0 ? (
					results.map((event, index) => (
						<Event
							key={index}
							{...event}
						/>
					))
				) : (
					<p className="w-full text-center">No events found</p>
				)}
			</div>}
		</BasicPage>
	</>)
}
