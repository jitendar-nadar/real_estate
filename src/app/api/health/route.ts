import { NextResponse } from "next/server";
import { isMongoConfigured, pingMongo } from "@/lib/mongodb";
import { countDemoUsers, isDemoSeedEnabled, seedDbIfEmpty } from "@/lib/db/seed";

export const dynamic = "force-dynamic";

const APP_VERSION = "1.2.0";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  const mongoConnected = mongoConfigured ? await pingMongo() : false;
  const nextAuthSecretConfigured = Boolean(process.env.NEXTAUTH_SECRET?.trim());
  const nextAuthUrlConfigured = Boolean(process.env.NEXTAUTH_URL?.trim());
  const siteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
  const seedDemoEnabled = isDemoSeedEnabled();

  let userCount = 0;
  if (mongoConnected) {
    userCount = await countDemoUsers();
  }

  const healthy =
    mongoConnected &&
    nextAuthSecretConfigured &&
    nextAuthUrlConfigured &&
    siteUrlConfigured &&
    userCount > 0;

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
        loginReady: userCount > 0 && mongoConnected && nextAuthSecretConfigured,
      },
    },
    { status: healthy ? 200 : 503 }
  );
}

/** Force demo seed — only when SEED_DEMO_DATA=true (live preview bootstrap). */
export async function POST() {
  if (!isDemoSeedEnabled()) {
    return NextResponse.json(
      { error: "Demo seed disabled. Set SEED_DEMO_DATA=true on Vercel." },
      { status: 403 }
    );
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not configured" }, { status: 503 });
  }

  try {
    await seedDbIfEmpty();
    const userCount = await countDemoUsers();
    return NextResponse.json({
      success: true,
      userCount,
      message: "Demo users synced. Try logging in with superadmin@primenest.com / superadmin123",
    });
  } catch (error) {
    console.error("Demo seed failed:", error);
    return NextResponse.json({ error: "Demo seed failed" }, { status: 500 });
  }
}
