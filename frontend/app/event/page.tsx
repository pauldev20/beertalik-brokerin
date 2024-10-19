"use client";

import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Card, CardBody } from "@nextui-org/react";
import BasicPage from "@/components/basicPage";
import { useRouter } from "next/navigation";

function Beer() {
	const router = useRouter();

	return (
		<Card onClick={() => router.replace("/chart")} isPressable>
			<CardBody className="w-full flex flex-row justify-between">
				<div className="flex gap-2">
					<h1 className="font-bold">1x</h1>
					<h2>Stuttgarter Hofbräu</h2>
				</div>
				<span>1.00 $</span>
			</CardBody>
		</Card>
	)
}

export default function EventPage() {
	const router = useRouter();

	return (
		<BasicPage
			topLeftBtn={<ChevronLeftIcon />}
			topLeftClick={() => router.replace("/main")}
			emoji="🍺"
			pageTitle="Beers"
		>
			<Beer />
			<Card isPressable isDisabled>
				<CardBody className="w-full flex flex-row justify-center">
					<PlusIcon className="size-4"/>
				</CardBody>
			</Card>
		</BasicPage>
	)
}
