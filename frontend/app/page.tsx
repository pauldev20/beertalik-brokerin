import ConnectWalletButton from "@/components/connectWallet";
import { siteConfig } from "@/lib/siteConfig";

export default function Home() {
    return (
        <main className="h-[100svh] w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-12">
                <div className="flex flex-col gap-3 items-center">
                    <span style={{fontSize: "140px", lineHeight: "140px"}}>🍺</span>
                    <h1 className="text-3xl font-bold">{siteConfig.name}</h1>
                </div>
                <ConnectWalletButton />
            </div>
        </main>
    );
}
