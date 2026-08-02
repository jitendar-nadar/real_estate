import * as jose from "jose";
import type { Role } from "./auth-types";
import { getJwtSecret } from "./auth-secret";

const alg = "HS256";

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string | null;
  role: Role;
  iat?: number;
  exp?: number;
}

export async function signToken(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
  const key = new TextEncoder().encode(getJwtSecret());
  return new jose.SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const key = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jose.jwtVerify(token, key);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: (payload.name as string) ?? null,
      role: payload.role as Role,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
