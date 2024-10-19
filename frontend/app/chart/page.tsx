"use client";

import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useQuery } from '@tanstack/react-query';
import BasicPage from "@/components/basicPage";
import { gql, request } from 'graphql-request';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chart } from "react-google-charts";
// @ts-expect-error idk
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";

interface ConnectWristbandModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}
function ConnectWristbandModal({ isOpen, onOpenChange}: ConnectWristbandModalProps) {
	const [loading, setLoading] = useState(false);

	async function btnClick() {
		setLoading(true);
		try {
			console.log(await execHaloCmdWeb({
			  name: "sign",
			  keyNo: 1,
			  message: "010203"
			}));
			setLoading(false);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton isDismissable={!loading}>
			<ModalContent>
				<ModalHeader>Set Name & Wristband</ModalHeader>
				<ModalBody>
					<Input type="text" label="Username" />
					<Button color="primary" className="mb-5" isLoading={loading} onClick={btnClick}>
						Connect Wristband
					</Button>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default function BeerPage() {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [chartData, setChartData] = useState([]);
	const router = useRouter();

	// const result = useEnsName({
	// 	address: '0x0000000000000000000000000000000000001337',
	// 	chainId: sepolia.id
	// });

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
		purchases(first: 10, orderBy: blockNumber) {
		  price
		  blockNumber
		}
	}`;
	const { data, status } = useQuery({
		queryKey: ['data'],
		async queryFn() {
		  return await request('https://api.studio.thegraph.com/query/92107/beertik/version/latest', query)
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
			topLeftClick={() => router.replace("/event")}
		>
			{chartData.length === 0 && <div className="flex flex-grow items-center justify-center gap-3">
				<Spinner size="lg" />
			</div>}
			{chartData.length > 0 && (<>
				<h1 className="text-2xl font-bold text-center">Stuttgarter Hofbräu</h1>
				<h2 className="text-lg text-center opacity-75">Your Current Amount: 0</h2>
				<Chart 
					chartType="CandlestickChart"
					width="100%"
					height="400px"
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
				<div className="mt-auto flex justify-between gap-3">
					<Button color="success" className="flex-grow" onClick={onOpen}>
						Buy
					</Button>
					<Button color="danger" className="flex-grow">
						Sell
					</Button>
				</div>
			</>)}
		</BasicPage>
	</>)
}
