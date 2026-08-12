"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface LoginFormProps {
  companyName: string;
  showDemoAccounts?: boolean;
}

export default function LoginForm({ companyName, showDemoAccounts = false }: LoginFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const authError = searchParams.get("error");
  const [email, setEmail] = useState("superadmin@primenest.com");
  const [password, setPassword] = useState("superadmin123");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const errorFromQuery =
    authError === "Configuration"
      ? "Server configuration issue. Set NEXTAUTH_SECRET and NEXTAUTH_URL on Vercel, then redeploy."
      : authError === "AccessDenied"
        ? "Access denied. Please sign in with a valid account."
        : authError === "Verification"
          ? "Session verification failed. Clear cookies and try again."
          : "";

  async function setupDemo() {
    setSeeding(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/setup/demo");
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || data.hint || "Demo setup failed");
        return;
      }
      setInfo(data.message || "Demo accounts ready. Sign in below.");
    } catch {
      setError("Could not reach /api/setup/demo. Check deployment and MongoDB.");
    } finally {
      setSeeding(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError(
          "Invalid email or password. Click “Setup demo accounts” below if this is a fresh Vercel deploy."
        );
        setLoading(false);
        return;
      }
      if (res?.url) {
        window.location.assign(res.url);
        return;
      }
      window.location.assign(callbackUrl);
    } catch {
      setError("Something went wrong. Open /api/health to diagnose.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Sign in to your {companyName} account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          {(error || errorFromQuery) && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 text-sm">
              {error || errorFromQuery}
            </div>
          )}
          {info && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 text-sm">
              {info}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-medium py-2.5"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={setupDemo}
            disabled={seeding}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 text-sm"
          >
            {seeding ? "Setting up demo…" : "Setup demo accounts"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="text-primary-600 dark:text-primary-400 hover:underline">
            ← Back to home
          </Link>
        </p>

        {(showDemoAccounts || process.env.NODE_ENV === "development") && (
          <div className="mt-8 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <p className="font-medium mb-2">Demo accounts:</p>
            <ul className="space-y-1">
              <li>Super Admin: superadmin@primenest.com / superadmin123</li>
              <li>Admin: admin@primenest.com / admin123</li>
              <li>User: user@primenest.com / user123</li>
            </ul>
            <p className="mt-2">
              Or open{" "}
              <a href="/api/setup/demo" className="text-primary-600 dark:text-primary-400 hover:underline">
                /api/setup/demo
              </a>{" "}
              in the browser first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
