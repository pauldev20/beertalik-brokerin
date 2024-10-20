import { http, createConfig } from "wagmi";
import { polygonAmoy, sepolia } from "wagmi/chains";

export const config = createConfig({
    chains: [polygonAmoy, sepolia],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
        [polygonAmoy.id]: http(),
        [sepolia.id]: http()
    },
});

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
