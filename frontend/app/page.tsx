import ConnectWalletButton from "@/components/connectWallet";

import { siteConfig } from "@/lib/siteConfig";

export default function Home() {
    return (
        <main className="h-[100svh] w-full flex flex-col items-center justify-between">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex flex-col gap-3 items-center">
                    <span style={{fontSize: "200px", lineHeight: "200px"}}>🍺</span>
                    <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
                </div>
            </div>
            <div className="w-full flex-1 flex flex-col justify-end">
                <div className="mb-10 px-5">
                    <ConnectWalletButton />
                </div>
            </div>
        </main>
    );
}
