"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        We couldn&apos;t load this page. Please try again.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="touch-target px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="touch-target inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 font-medium"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
