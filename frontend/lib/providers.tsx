"use client";

import { DynamicContextProvider, mergeNetworks, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { NextUIProvider } from "@nextui-org/react";
import { useAccount, WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { useEffect } from "react";

function SwitchNetwork() {
    const { primaryWallet } = useDynamicContext();
    const { isConnected } = useAccount();

    useEffect(() => {
        const network = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "");
        (async () => {
            if (primaryWallet?.connector.supportsNetworkSwitching() && await primaryWallet?.getNetwork() !== network) {
                await primaryWallet.switchNetwork(network);
            }
        })();
    }, [isConnected, primaryWallet]);

    return (<></>);
}

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = new QueryClient();

    return (
        <NextUIProvider>
            <DynamicContextProvider
                theme="auto"
                settings={{
                    environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",
                    walletConnectors: [EthereumWalletConnectors],
                    overrides: {
                        evmNetworks: (networks) => mergeNetworks([{
                            chainId: 974399131,
                            networkId: 974399131,
                            name: "SKALE Nebula Hub",
                            iconUrls: ["https://cdn.prod.website-files.com/625c39b93541414104a1d654/66221a808e7f4596315967c6_skale-logo-white-cropped.webp"],
                            rpcUrls: ["https://testnet.skalenodes.com/v1/giant-half-dual-testnet"],
                            blockExplorerUrls: ["https://giant-half-dual-testnet.explorer.testnet.skalenodes.com"],
                            nativeCurrency: {
                                name: "sFUEL",
                                symbol: "sFUEL",
                                decimals: 18,
                            },
                        }], networks),
                    },
                    mobileExperience: 'redirect'
                }}
            >
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <DynamicWagmiConnector>
                            <SwitchNetwork />
                            {children}
                        </DynamicWagmiConnector>
                    </QueryClientProvider>
                </WagmiProvider>
            </DynamicContextProvider>
        </NextUIProvider>
    )
}
