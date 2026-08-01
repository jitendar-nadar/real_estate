"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import { useState, type ReactNode } from "react";
import { canAccessAdmin } from "@/lib/auth-types";

interface HeaderProps {
  logo: ReactNode;
  initialSession?: Session | null;
}

export default function Header({ logo, initialSession }: HeaderProps) {
  const { data: clientSession, status } = useSession();
  const session = clientSession ?? initialSession ?? null;
  const isLoading = status === "loading" && !session;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Listings" },
    { href: "/listings?featured=1", label: "Featured" },
  ];

  const showAdmin = session?.user?.role && canAccessAdmin(session.user.role);

  const desktopLinkClass =
    "text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors touch-target flex items-center";
  const mobileLinkClass =
    "block py-3 px-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium touch-target w-full text-left";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {logo}

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={desktopLinkClass}>
                {link.label}
              </Link>
            ))}
            {session && (
              <Link href="/dashboard" className={desktopLinkClass}>
                My listings
              </Link>
            )}
            {showAdmin && (
              <Link href="/admin" className={desktopLinkClass}>
                Admin
              </Link>
            )}
            {session ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={desktopLinkClass}
              >
                Logout
              </button>
            ) : (
              !isLoading && (
                <Link href="/login" className={desktopLinkClass}>
                  Login
                </Link>
              )
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden touch-target flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-nav" className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={closeMenu} className={mobileLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {session && (
                <li>
                  <Link href="/dashboard" onClick={closeMenu} className={mobileLinkClass}>
                    My listings
                  </Link>
                </li>
              )}
              {showAdmin && (
                <li>
                  <Link href="/admin" onClick={closeMenu} className={mobileLinkClass}>
                    Admin
                  </Link>
                </li>
              )}
              {session ? (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: "/" });
                    }}
                    className={mobileLinkClass}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                !isLoading && (
                  <li>
                    <Link href="/login" onClick={closeMenu} className={mobileLinkClass}>
                      Login
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
