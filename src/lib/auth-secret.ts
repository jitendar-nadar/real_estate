const DEV_SECRET = "estatehub-dev-secret-change-in-production";
const BUILD_SECRET = "build-time-placeholder-secret-minimum-32-chars";

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Returns the auth signing secret. Throws in production runtime if unset.
 * Uses a placeholder during `next build` so CI/Vercel builds succeed before
 * env vars are injected — you must still set NEXTAUTH_SECRET on Vercel.
 */
export function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (secret) return secret;
  if (isBuildPhase()) return BUILD_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET must be set in production");
  }
  return DEV_SECRET;
}

/** Same as getAuthSecret but also accepts JWT_SECRET override. */
export function getJwtSecret(): string {
  const secret =
    process.env.JWT_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (secret) return secret;
  if (isBuildPhase()) return BUILD_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET or NEXTAUTH_SECRET must be set in production");
  }
  return DEV_SECRET;
}
