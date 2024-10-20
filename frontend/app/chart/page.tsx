"use client";

import { Button, Card, CardBody, Spinner, useDisclosure } from "@nextui-org/react";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { erc20Abi, formatUnits } from "viem";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useReadContract } from "wagmi";

import ConnectWristbandModal from "@/components/connectWristbandModal";
import BasicPage from "@/components/basicPage";

import useBeerBalance from "@/hooks/useBeerBalance";
import useAddressName from "@/hooks/useAddressName";
import useLogin from "@/hooks/useLogin";

import partyAbi from "@/contracts/partyAbi.json";
import { config } from "@/lib/wagmi";

export default function ChartPage() {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [chartData, setChartData] = useState([]);
	const { primaryWallet } = useDynamicContext();
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const { beerBalance, refetchBeer } = useBeerBalance(searchParams.get("beer") as `0x${string}`);
	const { name } = useAddressName();
	useLogin();

	const { data: USDCBalance, refetch: refetchUSDC } = useReadContract({
		abi: erc20Abi,
		address: searchParams.get("usdc") as `0x${string}`,
		functionName: 'balanceOf',
		args: [primaryWallet?.address as `0x${string}`],
		// @ts-expect-error idk
		chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
	});

	async function buyBeer() {
		try {
			if (name === undefined) {
				onOpen();
				return;
			}
			setLoading(true);
			const resultAllow = await writeContract(config, {
				abi: erc20Abi,
				address: searchParams.get("usdc") as `0x${string}`,
				functionName: 'approve',
				args: [
					searchParams.get("party") as `0x${string}`,
					BigInt(10000000)
				],
				// @ts-expect-error idk
				chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
			});
			await waitForTransactionReceipt(config, {
				hash: resultAllow,
				confirmations: 1
			});
			const resultBuy = await writeContract(config, {
				abi: partyAbi,
				address: searchParams.get("party") as `0x${string}`,
				functionName: 'buy',
				// @ts-expect-error idk
				chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
			});
			await waitForTransactionReceipt(config, {
				hash: resultBuy,
				confirmations: 1
			});
			await refetchBeer();
			await refetchChart();
			await refetchUSDC();
			setLoading(false);
		} catch (e) {
			console.log(e);
			setLoading(false);
		}
	}

	// @ts-expect-error idk
	function convertToChartData(data) {
		// @ts-expect-error idk
		const formatPrice = price => parseFloat(price) / 1000000;
		const result = [["Time", "", "", "", ""]];
		// @ts-expect-error idk
		data.forEach((item, index) => {
			const price = formatPrice(item.price);
			const previousPrice = index > 0 ? formatPrice(data[index - 1].price) : price;
			
			result.push([item.blockNumber, previousPrice, previousPrice, price, price]);
		});
		return result;
	}
	const getMedianOfAllNumbers = (data: (string | number)[][]): number => {
		const calculateMedian = (arr: number[]): number => {
		  const sortedArr = arr.sort((a, b) => a - b);
		  const mid = Math.floor(sortedArr.length / 2);
		  return sortedArr.length % 2 !== 0
			? sortedArr[mid]
			: (sortedArr[mid - 1] + sortedArr[mid]) / 2;
		};
		const allNumbers = data
		  .slice(1)
		  .flatMap(row => row.slice(1).map(value => Number(value)))
		  .filter(num => !isNaN(num));
		return calculateMedian(allNumbers);
	};
	const query = gql`{
		purchases(first: 1000, orderBy: blockNumber, orderDirection: asc) {
		  price
		  blockNumber
		}
	}`;
	const { data, status, refetch: refetchChart } = useQuery({
		queryKey: ['data'],
		async queryFn() {
		  return await request(process.env.NEXT_PUBLIC_GRAPH_URL || "", query)
		}
	});
	useEffect(() => {
		if (status === "success") {
			// @ts-expect-error idk
			setChartData(convertToChartData(data["purchases"]));
		}
	}, [data, status]);

	return (<>
		<ConnectWristbandModal isOpen={isOpen} onOpenChange={onOpenChange} />
		<BasicPage
			topLeftBtn={<ChevronLeftIcon />}
			topLeftClick={() => router.replace(`/event?addr=${searchParams.get("party")}`)}
		>
			{(chartData.length === 0 || USDCBalance === undefined) && <div className="flex flex-grow items-center justify-center gap-3">
				<Spinner size="lg" />
			</div>}
			{(chartData.length > 0 && USDCBalance !== undefined) && (<>
				<h1 className="text-2xl font-bold text-center">Stuttgarter Hofbräu</h1>
				<h2 className="text-lg text-center opacity-75">Your Current Amount: {beerBalance?.toString()}</h2>
				<Chart
					chartType="CandlestickChart"
					width="100%"
					height="400px"
					loader={<Spinner size="lg" />}
					data={chartData}
					options={{
						legend: "none",
						bar: { groupWidth: "100%" },
						candlestick: {
						fallingColor: { strokeWidth: 0, fill: "#a52714" },
						risingColor: { strokeWidth: 0, fill: "#0f9d58" },
						},
						backgroundColor: "transparent",
						tooltip: { trigger: "none" },
						fontSize: 14,
						hAxis: {
							textStyle: {
								color: "white",
							},
						},
						vAxis: {
							textStyle: {
								color: "white",
							},
							viewWindow: {
								min: Math.max(getMedianOfAllNumbers(chartData) - 4, 0),
								max: getMedianOfAllNumbers(chartData) + 4
							},
						},
						chartArea: {
							left: 30,
							top: 5,
							right: 0,
							bottom: 5,
							width: "100%",
							height: "80%",
						},
					}}
				/>
				<div className="mt-auto flex- flex-col gap-2">
					<Card className="my-3">
						<CardBody>
							<h2 className="text-xl font-bold">Your USDC: {formatUnits(USDCBalance || BigInt(0), 6).toString()}$</h2>
						</CardBody>
					</Card>
					<div className="flex justify-between gap-3">
						<Button color="success" className="flex-grow" onClick={buyBeer} isLoading={loading}>
							Buy
						</Button>
						<Button color="danger" className="flex-grow" isDisabled>
							Sell
						</Button>
					</div>
				</div>
			</>)}
		</BasicPage>
	</>)
}
