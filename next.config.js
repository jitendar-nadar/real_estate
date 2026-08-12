/** @type {import('next').NextConfig} */

function resolveDeploymentUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXTAUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate?.trim()) continue;
    try {
      const raw = candidate.trim();
      const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
      const parsed = new URL(normalized);
      if (parsed.hostname) return parsed.origin;
    } catch {
      continue;
    }
  }

  return "http://localhost:3000";
}

const deploymentUrl = resolveDeploymentUrl();

const nextConfig = {
  env: {
    // Ensure build/prerender never sees empty URL env vars on Vercel
    NEXT_PUBLIC_SITE_URL: deploymentUrl,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL?.trim() || deploymentUrl,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
