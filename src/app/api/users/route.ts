import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db/users";
import { requireApiAuth } from "@/lib/api-auth";
import { ADMIN_ROLES } from "@/lib/auth-types";
import { Role } from "@/lib/auth-types";

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const users = await db.getAllUsers();
    return NextResponse.json(users);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

const ROLES: Role[] = ["super_admin", "admin", "user"];

function validateBody(body: unknown): { ok: true; data: { email: string; name: string; password: string; role: Role } } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const password = typeof b.password === "string" ? b.password : "";
  const role = typeof b.role === "string" && ROLES.includes(b.role as Role) ? (b.role as Role) : null;
  if (!email) return { ok: false, error: "Email is required" };
  if (!name) return { ok: false, error: "Name is required" };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters" };
  if (!role) return { ok: false, error: "Valid role is required" };
  return { ok: true, data: { email, name, password, role } };
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const actor = "user" in auth ? auth.user : null;
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json().catch(() => ({}));
    const result = validateBody(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    if (result.data.role === "super_admin" && actor.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admin can create super admin users" }, { status: 403 });
    }
    const user = await db.createUser(result.data);
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "USER_EMAIL_EXISTS") {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
