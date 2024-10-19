import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

import Providers from "@/lib/providers";

import { siteConfig } from "@/lib/siteConfig";

const notoSans = Noto_Sans({ subsets: ["latin"] });
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Providers>
        <body
          className={clsx(notoSans.className, "antialiased")}
        >
          {children}
        </body>
      </Providers>
    </html>
  );
}
