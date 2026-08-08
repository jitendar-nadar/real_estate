import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { getServerSessionSafe } from "@/lib/auth";
import { buildRootMetadata } from "@/lib/metadata";
import { getPrimaryColorStyle, getSiteConfig } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteConfig = getSiteConfig();

export const metadata: Metadata = buildRootMetadata(siteConfig);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: siteConfig.primaryColor,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSessionSafe();
  const primaryColorStyle = getPrimaryColorStyle(siteConfig.primaryColor);

  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} style={primaryColorStyle}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
