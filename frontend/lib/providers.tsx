"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { NextUIProvider } from "@nextui-org/react";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = new QueryClient();

    return (
        <NextUIProvider>
            <DynamicContextProvider
                theme="auto"
                settings={{
                    environmentId: "fb7c1871-69a6-4f92-a54c-8c85bbb70b8c",
                    walletConnectors: [EthereumWalletConnectors],
                }}
            >
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <DynamicWagmiConnector>
                            {children}
                        </DynamicWagmiConnector>
                    </QueryClientProvider>
                </WagmiProvider>
            </DynamicContextProvider>
        </NextUIProvider>
    )
}
