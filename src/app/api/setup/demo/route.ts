import { NextResponse } from "next/server";
import { bootstrapDemoData, isDemoSeedEnabled } from "@/lib/db/seed";
import { isMongoConfigured, pingMongo } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/** One-click demo bootstrap — open this URL in a browser after deploy. */
export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "MONGODB_URI is not configured on Vercel.",
        hint: "Add your MongoDB Atlas connection string in Vercel → Settings → Environment Variables.",
      },
      { status: 503 }
    );
  }

  const mongoConnected = await pingMongo();
  if (!mongoConnected) {
    return NextResponse.json(
      {
        success: false,
        error: "Cannot connect to MongoDB.",
        hint: "In MongoDB Atlas → Network Access, allow 0.0.0.0/0 (or Vercel IPs), then verify MONGODB_URI.",
      },
      { status: 503 }
    );
  }

  if (!isDemoSeedEnabled()) {
    return NextResponse.json(
      {
        success: false,
        error: "SEED_DEMO_DATA is not enabled.",
        hint: 'Set SEED_DEMO_DATA=true for Production in Vercel, redeploy, then open this URL again.',
        seedDemoEnabled: false,
      },
      { status: 403 }
    );
  }

  try {
    const { userCount, propertiesCount } = await bootstrapDemoData();
    return NextResponse.json({
      success: true,
      userCount,
      propertiesCount,
      logins: [
        { role: "Super Admin", email: "superadmin@primenest.com", password: "superadmin123" },
        { role: "Admin", email: "admin@primenest.com", password: "admin123" },
        { role: "User", email: "user@primenest.com", password: "user123" },
      ],
      message: "Demo ready — go to /login and sign in.",
    });
  } catch (error) {
    console.error("[setup/demo]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Demo bootstrap failed",
      },
      { status: 500 }
    );
  }
}
