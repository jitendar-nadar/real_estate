"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
}

interface AppShellProps {
  brand: ReactNode;
  nav: NavItem[];
  title: string;
  subtitle: string;
  sidebarLabel?: string;
  children: React.ReactNode;
}

export default function AppShell({
  brand,
  nav,
  title,
  subtitle,
  sidebarLabel = "Menu",
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (href: string) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-slate-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 py-6 px-4">
          <div className="mb-6">{brand}</div>
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 inline-block"
            onClick={() => setMenuOpen(false)}
          >
            ← Back to website
          </Link>
          <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-4">
            {sidebarLabel}
          </h2>
          <nav className="space-y-0.5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.href)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 min-w-0 lg:ml-0">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 sm:px-6 py-4 flex items-start gap-3">
          <button
            type="button"
            aria-label="Open sidebar menu"
            aria-expanded={menuOpen}
            className="lg:hidden mt-0.5 rounded-md border border-slate-300 dark:border-slate-600 p-2 text-slate-700 dark:text-slate-200"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
