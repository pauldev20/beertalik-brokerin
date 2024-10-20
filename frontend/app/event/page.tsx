"use client";

import { ChevronLeftIcon, PlusIcon, WifiIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import BasicPage from "@/components/basicPage";
import abi from "@/contracts/partyAbi.json";
import { polygonAmoy } from "wagmi/chains";
import { useReadContract } from "wagmi";
import erc20abi from "@/contracts/erc20Abi.json";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

interface BeerProps {
	addr: string;
	party: string;
	usdc: string;
}
function Beer({ addr, party, usdc }: BeerProps) {
	const { primaryWallet } = useDynamicContext();
	const router = useRouter();

	let { data: balance } = useReadContract({
		abi: erc20abi,
		address: addr as `0x${string}`,
		functionName: 'balanceOf',
		args: [primaryWallet?.address],
		chainId: polygonAmoy.id
	});

	return (
		<Card onClick={() => router.replace(`/chart?beer=${addr}&party=${party}&usdc=${usdc}`)} isPressable>
			<CardBody className="w-full flex flex-row justify-between">
				<div className="flex gap-2">
					<h1 className="font-bold">{balance || 0}x</h1>
					<h2>Stuttgarter Hofbräu</h2>
				</div>
				<span>1.00 $</span>
			</CardBody>
		</Card>
	)
}

export default function EventPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	let { data: owner } = useReadContract({
		abi,
		address: searchParams.get("addr") as `0x${string}`,
		functionName: 'owner',
		chainId: polygonAmoy.id
	});
	let { data: beer } = useReadContract({
		abi,
		address: searchParams.get("addr") as `0x${string}`,
		functionName: 'beer',
		chainId: polygonAmoy.id
	});
	let { data: usdc } = useReadContract({
		abi,
		address: searchParams.get("addr") as `0x${string}`,
		functionName: 'usdc',
		chainId: polygonAmoy.id
	});

	return (
		<BasicPage
			topLeftBtn={<ChevronLeftIcon />}
			topLeftClick={() => router.replace("/main")}
			topRightBtn={owner ? <WifiIcon /> : <></>}
			topRightClick={() => console.log("scan")}
			emoji="🍺"
			pageTitle="Beers"
		>
			{beer === undefined && (<div className="flex flex-grow items-center justify-center gap-3">
				<Spinner size="lg"/>
			</div>)}
			{beer !== undefined && (<>
				<Beer addr={beer as string} party={searchParams.get("addr") || ""} usdc={usdc as string} />
				<Card isPressable isDisabled>
					<CardBody className="w-full flex flex-row justify-center">
						<PlusIcon className="size-4"/>
					</CardBody>
				</Card>
			</>)}
		</BasicPage>
	)
}
