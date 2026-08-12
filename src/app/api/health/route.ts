import { NextResponse } from "next/server";
import { isMongoConfigured, pingMongo } from "@/lib/mongodb";
import {
  bootstrapDemoData,
  countDemoUsers,
  isDemoSeedEnabled,
} from "@/lib/db/seed";

export const dynamic = "force-dynamic";

const APP_VERSION = "1.2.0";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  let mongoConnected = false;
  let userCount = 0;
  let seedError: string | null = null;

  if (mongoConfigured) {
    mongoConnected = await pingMongo();
    if (mongoConnected) {
      userCount = await countDemoUsers();
      if (isDemoSeedEnabled() && userCount === 0) {
        try {
          await bootstrapDemoData();
          userCount = await countDemoUsers();
        } catch (error) {
          seedError = error instanceof Error ? error.message : "Auto-seed failed";
        }
      }
    }
  }

  const nextAuthSecretConfigured = Boolean(process.env.NEXTAUTH_SECRET?.trim());
  const nextAuthUrlConfigured = Boolean(process.env.NEXTAUTH_URL?.trim());
  const siteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
  const seedDemoEnabled = isDemoSeedEnabled();

  const loginReady =
    userCount > 0 && mongoConnected && nextAuthSecretConfigured;

  const healthy =
    loginReady && nextAuthUrlConfigured && siteUrlConfigured;

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
        seedDemoEnabled,
        userCount,
        loginReady,
      },
      ...(seedError ? { seedError } : {}),
      ...( !loginReady && seedDemoEnabled
        ? { bootstrapUrl: "/api/setup/demo" }
        : {}),
    },
    { status: healthy ? 200 : 503 }
  );
}

export async function POST() {
  try {
    const result = await bootstrapDemoData();
    return NextResponse.json({
      success: true,
      ...result,
      message: "Demo users synced. Login with superadmin@primenest.com / superadmin123",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Demo seed failed",
        setupUrl: "/api/setup/demo",
      },
      { status: error instanceof Error && error.message.includes("SEED_DEMO_DATA") ? 403 : 500 }
    );
  }
}
