"use client";

import { ArrowLeftStartOnRectangleIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';

import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BasicPage from "@/components/basicPage";

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
			{(onClose) => (<>
				<ModalHeader className="flex flex-col gap-1">Create Event</ModalHeader>
				<ModalBody>
					<Input type="text" label="Event Name" />
					<Input type="text" label="Event Location" />
					<Button color="primary" onClick={createEvent} isLoading={loading}>Create Event</Button>
				</ModalBody>
			</>)}
			</ModalContent>
		</Modal>
	)
}

interface EventProps {
	name: string;
	location: string;
}
function Event({ name, location }: EventProps) {
	const router = useRouter();

	return (
		<div className="flex w-full justify-between items-center active:opacity-50 transition-opacity duration-100" onClick={() => router.push("/event")}>
			<div className="flex flex-col">
				<h2 className="text-lg font-bold">{name}</h2>
				<h3 className="text-sm opacity-75">{location}</h3>
			</div>
			<ChevronRightIcon className="size-8"/>
		</div>
	)
}

export default function Main() {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [results, setResults] = useState<EventProps[]>([]);
	const [events, setEvents] = useState<EventProps[]>([]);
	const [loading, setLoading] = useState(true);
	const { handleLogOut } = useDynamicContext();
	const router = useRouter();

	const logout = async () => {
		handleLogOut();
		router.replace("/");
	}

	useEffect(() => {
		setLoading(true);
		const res = [...Array(30)].map((_, index) => ({
			name: `Event Name ${index}`,
			location: "Event Location",
		}));
		setEvents(res);
		setResults(res);
		setLoading(false);
	}, []);

	const handleSearch = (event: any) => {
		const searchTerm = event.target.value.toLowerCase();
		const filteredResults = events.filter(event =>
			event.name.toLowerCase().includes(searchTerm) || 
			event.location.toLowerCase().includes(searchTerm)
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
			navbarItems={[
				{ icon: "HomeIcon", label: "Home", active: true },
				{ icon: "UserIcon", label: "Profile", onClick: () => router.replace("/profile") },
			]}
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
							name={event.name}
							location={event.location}
						/>
					))
				) : (
					<p className="w-full text-center">No events found</p>
				)}
			</div>}
		</BasicPage>
	</>)
}
