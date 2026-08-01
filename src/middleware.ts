import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET must be set in production");
  }
  return "estatehub-dev-secret-change-in-production";
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin")) {
      if (!token) {
        const login = new URL("/login", req.url);
        login.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(login);
      }
      const role = token.role as string;
      if (role !== "super_admin" && role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    secret: getAuthSecret(),
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
