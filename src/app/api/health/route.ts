import { NextResponse } from "next/server";
import { isMongoConfigured, pingMongo } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const APP_VERSION = "1.2.0";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  const mongoConnected = mongoConfigured ? await pingMongo() : false;
  const nextAuthSecretConfigured = Boolean(process.env.NEXTAUTH_SECRET?.trim());
  const nextAuthUrlConfigured = Boolean(process.env.NEXTAUTH_URL?.trim());
  const siteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

  const healthy =
    mongoConnected &&
    nextAuthSecretConfigured &&
    nextAuthUrlConfigured &&
    siteUrlConfigured;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      app: "real-estate-app",
      version: APP_VERSION,
      checks: {
        mongoConfigured,
        mongoConnected,
        nextAuthSecretConfigured,
        nextAuthUrlConfigured,
        siteUrlConfigured,
      },
    },
    { status: healthy ? 200 : 503 }
  );
}
