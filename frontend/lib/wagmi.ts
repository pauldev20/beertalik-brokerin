import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

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
