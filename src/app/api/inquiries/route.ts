import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db/inquiries";
import { requireApiAuth } from "@/lib/api-auth";
import { ADMIN_ROLES } from "@/lib/auth-types";

export const dynamic = "force-dynamic";

function validateBody(
  body: unknown
): { ok: true; data: { name: string; email: string; phone?: string; message: string; propertyId?: string; propertyTitle?: string } } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : undefined;
  const message = typeof b.message === "string" ? b.message.trim() : "";
  const propertyId = typeof b.propertyId === "string" ? b.propertyId.trim() : undefined;
  const propertyTitle = typeof b.propertyTitle === "string" ? b.propertyTitle.trim() : undefined;

  if (!name) return { ok: false, error: "Name is required" };
  if (!email || !email.includes("@")) return { ok: false, error: "Valid email is required" };
  if (!message || message.length < 10) return { ok: false, error: "Message must be at least 10 characters" };

  return { ok: true, data: { name, email, phone, message, propertyId, propertyTitle } };
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const inquiries = await db.getAllInquiries();
    return NextResponse.json(inquiries);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = validateBody(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    const inquiry = await db.createInquiry(result.data);
    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
