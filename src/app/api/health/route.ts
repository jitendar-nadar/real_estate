import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const APP_VERSION = "1.1.1";

export async function GET() {
  console.log(`[health] real-estate-app v${APP_VERSION}`);

  const mongoConfigured = isMongoConfigured();
  const nextAuthSecretConfigured = Boolean(process.env.NEXTAUTH_SECRET);
  const nextAuthUrlConfigured = Boolean(process.env.NEXTAUTH_URL);

  const healthy =
    mongoConfigured && nextAuthSecretConfigured && nextAuthUrlConfigured;

  console.log(`[real-estate-app] health check v${APP_VERSION} — ${healthy ? "ok" : "degraded"}`);

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      app: "real-estate-app",
      version: APP_VERSION,
      checks: {
        mongoConfigured,
        nextAuthSecretConfigured,
        nextAuthUrlConfigured,
      },
    },
    { status: healthy ? 200 : 503 }
  );
}
