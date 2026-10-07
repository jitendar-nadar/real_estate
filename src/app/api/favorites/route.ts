import { NextRequest, NextResponse } from "next/server";
import * as favoritesDb from "@/lib/db/favorites";
import { requireApiAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const propertyIds = await favoritesDb.getFavoritePropertyIds(user.id);
  return NextResponse.json({ propertyIds });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const propertyId = typeof body.propertyId === "string" ? body.propertyId.trim() : "";
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
  }

  await favoritesDb.addFavorite(user.id, propertyId);
  return NextResponse.json({ success: true, propertyId });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const propertyId = request.nextUrl.searchParams.get("propertyId")?.trim();
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId query param is required" }, { status: 400 });
  }

  await favoritesDb.removeFavorite(user.id, propertyId);
  return NextResponse.json({ success: true });
}
