import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";

const config = getSiteConfig();

export const metadata: Metadata = buildPageMetadata(
  config,
  "Page not found",
  "The page you requested could not be found."
);

export default function NotFound() {
  const { companyName } = getSiteConfig();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        The page or property you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="touch-target inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
        >
          Go to {companyName}
        </Link>
        <Link
          href="/listings"
          className="touch-target inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Browse listings
        </Link>
      </div>
    </div>
  );
}
