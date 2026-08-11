import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecretSafe } from "./auth-secret";
import { verifyToken } from "./jwt";
import type { Role } from "./auth-types";

export interface ApiUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
}

export interface RequireAuthOptions {
  /** Allowed roles; user must have one of these. Defaults to any authenticated user. */
  roles?: Role[];
}

export interface AuthResult {
  user: ApiUser;
  error?: never;
  status?: never;
}

export interface AuthError {
  user?: never;
  error: string;
  status: number;
}

/**
 * Resolves the current user from either:
 * 1. Authorization: Bearer <JWT>
 * 2. NextAuth session cookie (for same-origin requests e.g. admin UI)
 * Returns an error object with status if unauthorized or forbidden.
 */
export async function requireApiAuth(
  request: NextRequest,
  options: RequireAuthOptions = {}
): Promise<AuthResult | AuthError> {
  const { roles } = options;

  // 1. Check Bearer token
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (bearerToken) {
    const payload = await verifyToken(bearerToken);
    if (!payload) {
      return { error: "Invalid or expired token", status: 401 };
    }
    const user: ApiUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      return { error: "Forbidden", status: 403 };
    }
    return { user };
  }

  // 2. Check NextAuth session (cookie)
  const token = await getToken({
    req: request,
    secret: getAuthSecretSafe(),
  });

  const userId = token?.sub ?? (token as { id?: string })?.id;
  if (!token?.email || !userId) {
    return { error: "Unauthorized", status: 401 };
  }

  const user: ApiUser = {
    id: userId,
    email: token.email,
    name: token.name ?? null,
    role: (token.role as Role) ?? "user",
  };

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return { error: "Forbidden", status: 403 };
  }

  return { user };
}
