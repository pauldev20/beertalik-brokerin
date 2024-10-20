"use client";

import { ChevronLeftIcon, PlusIcon, WifiIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import BasicPage from "@/components/basicPage";
import abi from "@/contracts/partyAbi.json";
import { polygonAmoy } from "wagmi/chains";
import { useReadContract } from "wagmi";
import useBeerBalance from "@/hooks/useBeerBalance";
import useBeerPrice from "@/hooks/useBeerPrice";
import WalletAddress from "@/components/walletAddress";

interface BeerProps {
	addr: string;
	party: string;
	usdc: string;
}
function Beer({ addr, party, usdc }: BeerProps) {
	const { beerBalance, isLoading } = useBeerBalance(addr as `0x${string}`);
	const { beerPrice, isLoading: isLoadingPrice } = useBeerPrice(party);
	const router = useRouter();

	return (
		<Card onClick={() => router.replace(`/chart?beer=${addr}&party=${party}&usdc=${usdc}`)} isPressable={!isLoading}>
			<CardBody className="w-full flex flex-row justify-between">
				{(isLoading || isLoadingPrice) && <Spinner size="sm" className="ml-auto mr-auto" />}
				{(!isLoading && !isLoadingPrice) && (<>
					<div className="flex gap-2">
						<h1 className="font-bold">{beerBalance?.toString()}x</h1>
						<h2>Stuttgarter Hofbräu</h2>
					</div>
					<span>{beerPrice?.toString()} $</span>
				</>)}
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
				<WalletAddress className="self-center mt-auto"/>
			</>)}
		</BasicPage>
	)
}
