import { polygonAmoy, flowTestnet, skaleNebula, morphHolesky, sepolia } from "wagmi/chains";
import { http, createConfig } from "wagmi";

export const config = createConfig({
    chains: [sepolia],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
        [sepolia.id]: http()
    },
});

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
