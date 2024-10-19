import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

import Providers from "@/lib/providers";

import { siteConfig } from "@/lib/siteConfig";

const notoSans = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        startupImage: "/icon-512x512.png",
    }
};
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={clsx(notoSans.className, "antialiased")}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
