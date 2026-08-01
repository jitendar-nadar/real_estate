import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db/properties";
import { requireApiAuth } from "@/lib/api-auth";

/** GET /api/properties/my – list properties created by the current user (any auth) */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const properties = await db.getPropertiesByUserId(user.id);
    return NextResponse.json(properties);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load properties" }, { status: 500 });
  }
}
