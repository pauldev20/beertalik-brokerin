import { http, createConfig } from "wagmi";
import { polygonAmoy, flowTestnet, skaleNebula, morphHolesky } from "wagmi/chains";

export const config = createConfig({
    chains: [polygonAmoy, flowTestnet, skaleNebula, morphHolesky],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
        [polygonAmoy.id]: http(),
        [flowTestnet.id]: http(),
        [skaleNebula.id]: http("https://mainnet.skalenodes.com/v1/green-giddy-denebola"),
        [morphHolesky.id]: http(),
    },
});

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
