import { generatePrimaryPalette, primaryPaletteToCssVars } from "./color-utils";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface SiteConfig {
  companyName: string;
  companyLogo: string | null;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryColor: string;
  siteUrl: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  address: string | null;
  socialLinks: SocialLinks;
}

const DEFAULTS: SiteConfig = {
  companyName: "Your Realty",
  companyLogo: null,
  tagline: "Discover premium residential and commercial properties tailored to your needs.",
  heroHeadline: "Find your next property with confidence",
  heroSubheadline:
    "Browse verified listings, filter by location and budget, and connect with our team on any device.",
  primaryColor: "#0284c7",
  siteUrl: null,
  contactPhone: null,
  contactEmail: null,
  address: null,
  socialLinks: {},
};

function parseSocialLinks(raw: string | undefined): SocialLinks {
  if (!raw?.trim()) return {};

  try {
    const parsed = JSON.parse(raw) as SocialLinks;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, value]) => typeof value === "string" && value.trim().length > 0
      )
    ) as SocialLinks;
  } catch {
    return {};
  }
}

function readEnv(key: string): string | undefined {
  return process.env[key]?.trim() || undefined;
}

/** Absolute site URL for metadata, sitemap, and share links — never empty. */
export function getSiteBaseUrl(): string {
  const candidates = [
    readEnv("NEXT_PUBLIC_SITE_URL"),
    readEnv("NEXTAUTH_URL"),
    readEnv("VERCEL_URL") ? `https://${readEnv("VERCEL_URL")}` : undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const url = candidate.startsWith("http") ? candidate : `https://${candidate}`;
      return new URL(url).origin;
    } catch {
      continue;
    }
  }

  return "http://localhost:3000";
}

export function getSiteConfig(): SiteConfig {
  const socialLinks = parseSocialLinks(readEnv("NEXT_PUBLIC_SOCIAL_LINKS"));

  const individualSocialKeys: Array<[keyof SocialLinks, string]> = [
    ["facebook", "NEXT_PUBLIC_SOCIAL_FACEBOOK"],
    ["instagram", "NEXT_PUBLIC_SOCIAL_INSTAGRAM"],
    ["twitter", "NEXT_PUBLIC_SOCIAL_TWITTER"],
    ["linkedin", "NEXT_PUBLIC_SOCIAL_LINKEDIN"],
    ["youtube", "NEXT_PUBLIC_SOCIAL_YOUTUBE"],
    ["whatsapp", "NEXT_PUBLIC_SOCIAL_WHATSAPP"],
  ];

  for (const [key, envKey] of individualSocialKeys) {
    const value = readEnv(envKey);
    if (value) socialLinks[key] = value;
  }

  return {
    companyName: readEnv("NEXT_PUBLIC_COMPANY_NAME") ?? DEFAULTS.companyName,
    companyLogo: readEnv("NEXT_PUBLIC_COMPANY_LOGO") ?? DEFAULTS.companyLogo,
    tagline: readEnv("NEXT_PUBLIC_COMPANY_TAGLINE") ?? DEFAULTS.tagline,
    heroHeadline:
      readEnv("NEXT_PUBLIC_HERO_HEADLINE") ?? DEFAULTS.heroHeadline,
    heroSubheadline:
      readEnv("NEXT_PUBLIC_HERO_SUBHEADLINE") ?? DEFAULTS.heroSubheadline,
    primaryColor: readEnv("NEXT_PUBLIC_PRIMARY_COLOR") ?? DEFAULTS.primaryColor,
    siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? null,
    contactPhone: readEnv("NEXT_PUBLIC_CONTACT_PHONE") ?? DEFAULTS.contactPhone,
    contactEmail: readEnv("NEXT_PUBLIC_CONTACT_EMAIL") ?? DEFAULTS.contactEmail,
    address: readEnv("NEXT_PUBLIC_COMPANY_ADDRESS") ?? DEFAULTS.address,
    socialLinks,
  };
}

export function getPrimaryColorStyle(
  primaryColor?: string
): Record<string, string> {
  const palette = generatePrimaryPalette(primaryColor ?? getSiteConfig().primaryColor);
  return primaryPaletteToCssVars(palette);
}

export const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};
