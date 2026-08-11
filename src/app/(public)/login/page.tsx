import type { Metadata } from "next";
import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";
import LoginForm from "./LoginForm";

const config = getSiteConfig();

export const metadata: Metadata = buildPageMetadata(
  config,
  "Sign In",
  `Sign in to your ${config.companyName} account.`
);

export default function LoginPage() {
  const { companyName } = getSiteConfig();
  const showDemoAccounts = process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "true";

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center text-slate-500 dark:text-slate-400">
            Loading…
          </div>
        </div>
      }
    >
      <LoginForm companyName={companyName} showDemoAccounts={showDemoAccounts} />
    </Suspense>
  );
}
