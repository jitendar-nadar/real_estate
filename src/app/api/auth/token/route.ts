import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/users";
import { signToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/token
 * Body: { email: string, password: string }
 * Returns: { token: string, user: { id, email, name, role } }
 * Use the token in API requests: Authorization: Bearer <token>
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await verifyCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      token,
      expiresIn: "7d",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("Token route error:", e);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
