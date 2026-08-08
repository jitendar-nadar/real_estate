import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db/inquiries";
import { requireApiAuth } from "@/lib/api-auth";
import { ADMIN_ROLES } from "@/lib/auth-types";
import { InquiryStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: InquiryStatus[] = ["new", "read", "archived"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const status = typeof body?.status === "string" ? (body.status as InquiryStatus) : null;
    if (!status || !STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const inquiry = await db.updateInquiryStatus(id, status);
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const ok = await db.deleteInquiry(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
