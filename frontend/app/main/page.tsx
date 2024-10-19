"use client";

import { ArrowLeftStartOnRectangleIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';

import IconButton from "@/components/iconButton";
import BottomNavbar from "@/components/bottomNavbar";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";

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
		// Filter events based on the search term
		const filteredResults = events.filter(event =>
			event.name.toLowerCase().includes(searchTerm) || 
			event.location.toLowerCase().includes(searchTerm)
		);
		setResults(filteredResults); // Update the results state
	};

	return (<div className="h-[100svh] w-screen flex flex-col items-center">
		<CreateEventModal isOpen={isOpen} onOpenChange={onOpenChange} />
		<header className="w-full top-0 left-0 right-0 p-4 flex justify-between">
			<IconButton icon={<ArrowLeftStartOnRectangleIcon className="size-8"/>} onClick={logout} />
			<IconButton icon={<PlusIcon className="size-8"/>} onClick={onOpen} />
		</header>
		<main className="w-full flex-grow p-5 flex flex-col gap-3 overflow-hidden">
			<div className="flex items-end gap-3">
				<span style={{fontSize: "60px", lineHeight: "60px"}}>🏠</span>
				<h1 className="text-4xl font-bold text-center">Events</h1>
			</div>
			<Input isClearable type="text" placeholder="Search" startContent={<MagnifyingGlassIcon className="size-4" />} onChange={handleSearch} />
			{loading && <div className="flex flex-grow items-center justify-center gap-3">
				<Spinner className="w-5"/>
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
		</main>
		<BottomNavbar items={[
			{ icon: "HomeIcon", label: "Home", active: true },
			{ icon: "UserIcon", label: "Profile", onClick: () => router.replace("/profile") },
		]} className="w-full self-end"/>
	</div>)
}
