import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { getGlobalData, getGlobalPageMetadata } from "@/data/loaders";

import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";

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

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getGlobalPageMetadata();

  return {
    title: metadata?.data?.attributes?.title ?? "Tagelong",
    description: metadata?.data?.attributes?.description ?? "Your travel companion",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await getGlobalData();
  const header = globalData?.data?.attributes?.header || {};
  const footer = globalData?.data?.attributes?.footer || {};

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-center" />
        <Header data={header} />
        {children}
        <Footer data={footer} />
      </body>
    </html>
  );
}
