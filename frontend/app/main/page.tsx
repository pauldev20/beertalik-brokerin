"use client";

import { ArrowLeftStartOnRectangleIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';

import IconButton from "@/components/iconButton";
import BottomNavbar from "@/components/bottomNavbar";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";

function CreateEventModal() {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable hideCloseButton>
			<ModalContent>
			{(onClose) => (<>
				<ModalHeader className="flex flex-col gap-1">Create Event</ModalHeader>
				<ModalBody>
					<Input type="text" label="Event Name" />
					<Input type="text" label="Event Location" />
					<Button color="primary" onClick={onClose}>Create Event</Button>
				</ModalBody>
			</>)}
			</ModalContent>
		</Modal>
	)
}

interface EventProps {
	name: string;
	location: string;
	onClick?: () => void;
}
function Event({ name, location, onClick }: EventProps) {
	return (
		<div className="flex w-full justify-between items-center active:opacity-50 transition-opacity duration-100" onClick={onClick}>
			<div className="flex flex-col">
				<h2 className="text-lg font-bold">{name}</h2>
				<h3 className="text-sm opacity-75">{location}</h3>
			</div>
			<ChevronRightIcon className="size-8"/>
		</div>
	)
}

export default function Main() {
	const router = useRouter();

	const logout = async () => {
		handleLogOut();
		router.replace("/");
	}

	return (<div className="h-[100svh] w-screen flex flex-col items-center">
		<CreateEventModal />
		<header className="w-full top-0 left-0 right-0 p-4 flex justify-between">
			<IconButton icon={<ArrowLeftStartOnRectangleIcon className="size-8"/>} onClick={logout} />
			<IconButton icon={<PlusIcon className="size-8"/>} onClick={onOpen} />
		</header>
		<main className="w-full flex-grow p-5 flex flex-col gap-3 overflow-hidden">
			<div className="flex items-end gap-3">
				<span style={{fontSize: "60px", lineHeight: "60px"}}>🏠</span>
				<h1 className="text-4xl font-bold text-center">Events</h1>
			</div>
			<Input isClearable type="text" placeholder="Search" startContent={<MagnifyingGlassIcon className="size-4" />} />
			<div className="flex flex-col gap-1.5 flex-grow overflow-y-auto scrollbar-hide">
				{[...Array(30)].map((_, index) => (
					<Event
						key={index}
						name={`Event Name ${index}`}
						location="Event Location"
						onClick={() => router.replace("/event")}
					/>
				))}
			</div>
		</main>
		<BottomNavbar items={[
			{ icon: "HomeIcon", label: "Home", active: true },
			{ icon: "UserIcon", label: "Profile", onClick: () => router.replace("/profile") },
		]} className="w-full self-end"/>
	</div>)
}
