import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db/users";
import { requireApiAuth } from "@/lib/api-auth";
import { ADMIN_ROLES } from "@/lib/auth-types";
import { Role } from "@/lib/auth-types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const user = await db.getUserById(id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}

const ROLES: Role[] = ["super_admin", "admin", "user"];

function validatePatchBody(
  body: unknown
): { ok: true; data: { name?: string; email?: string; role?: Role; password?: string } } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;
  const data: { name?: string; email?: string; role?: Role; password?: string } = {};
  if (b.name !== undefined) {
    const v = typeof b.name === "string" ? b.name.trim() : "";
    if (!v) return { ok: false, error: "Name cannot be empty" };
    data.name = v;
  }
  if (b.email !== undefined) {
    const v = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
    if (!v) return { ok: false, error: "Email cannot be empty" };
    data.email = v;
  }
  if (b.role !== undefined) {
    if (typeof b.role !== "string" || !ROLES.includes(b.role as Role)) {
      return { ok: false, error: "Invalid role" };
    }
    data.role = b.role as Role;
  }
  if (b.password !== undefined) {
    const v = typeof b.password === "string" ? b.password : "";
    if (v.length > 0 && v.length < 6) return { ok: false, error: "Password must be at least 6 characters" };
    if (v.length > 0) data.password = v;
  }
  if (Object.keys(data).length === 0) return { ok: false, error: "No valid fields to update" };
  return { ok: true, data };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const result = validatePatchBody(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    const user = await db.updateUser(id, result.data);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    if (e instanceof Error && e.message === "USER_EMAIL_EXISTS") {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    if (id === user.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }
    const ok = await db.deleteUser(id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
