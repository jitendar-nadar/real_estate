import type { Metadata } from "next";
import type { SiteConfig } from "./site-config";
import { getSiteBaseUrl } from "./site-config";

export function buildRootMetadata(config: SiteConfig): Metadata {
  const metadataBase = new URL(getSiteBaseUrl());

  return {
    metadataBase,
    title: {
      default: `${config.companyName} – Premium Real Estate`,
      template: `%s | ${config.companyName}`,
    },
    description: config.tagline,
    keywords: [
      "real estate",
      "properties",
      "homes",
      "commercial",
      config.companyName,
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: config.companyName,
      title: `${config.companyName} – Premium Real Estate`,
      description: config.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.companyName} – Premium Real Estate`,
      description: config.tagline,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildPageMetadata(
  config: SiteConfig,
  title: string,
  description?: string
): Metadata {
  const desc = description ?? config.tagline;
  return {
    title,
    description: desc,
    openGraph: {
      title: `${title} | ${config.companyName}`,
      description: desc,
    },
  };
}
