import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";
import { buildRootMetadata } from "@/lib/metadata";
import { getPrimaryColorStyle, getSiteConfig } from "@/lib/site-config";

const SessionProvider = dynamic(() => import("@/components/SessionProvider"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export function generateMetadata(): Metadata {
  return buildRootMetadata(getSiteConfig());
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: getSiteConfig().primaryColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = getSiteConfig();
  const primaryColorStyle = getPrimaryColorStyle(siteConfig.primaryColor);

  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} style={primaryColorStyle}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
