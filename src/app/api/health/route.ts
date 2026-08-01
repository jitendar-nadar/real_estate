import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  const nextAuthSecretConfigured = Boolean(process.env.NEXTAUTH_SECRET);
  const nextAuthUrlConfigured = Boolean(process.env.NEXTAUTH_URL);

  const healthy =
    mongoConfigured && nextAuthSecretConfigured && nextAuthUrlConfigured;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks: {
        mongoConfigured,
        nextAuthSecretConfigured,
        nextAuthUrlConfigured,
      },
    },
    { status: healthy ? 200 : 503 }
  );
}
