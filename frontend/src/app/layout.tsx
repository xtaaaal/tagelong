import type { Metadata } from "next";
import localFont from "next/font/local";
import { Albert_Sans, Poppins } from "next/font/google";
import "./globals.css";

import { getGlobalData, getGlobalPageMetadata } from "@/data/loaders";

import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";
import { AuthProvider } from "@/components/providers/auth-provider";

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

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const metadata = await getGlobalPageMetadata();
    return {
      title: metadata?.data?.attributes?.title ?? "Tagelong",
      description: metadata?.data?.attributes?.description ?? "Your travel companion",
    };
  } catch (error) {
    console.warn("Failed to load global metadata, using fallback:", error);
    return {
      title: "Tagelong",
      description: "Your travel companion"
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let header = {};
  let footer = {};

  try {
    const globalData = await getGlobalData();
    header = globalData?.data?.attributes?.header || {};
    footer = globalData?.data?.attributes?.footer || {};
  } catch (error) {
    console.warn("Failed to load global data, using fallback header/footer:", error);
    // Use empty objects as fallback - components will handle missing data gracefully
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${albertSans.variable} ${poppins.variable} antialiased bg-white`}
      >
        <AuthProvider>
          <Toaster position="bottom-center" />
          <Header data={header} />
          {children}
          <Footer data={footer} />
        </AuthProvider>
      </body>
    </html>
  );
}
