"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const GUEST_KEY = "realestate-guest-favorites";

function readGuestFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeGuestFavorites(ids: string[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(ids));
}

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export default function FavoriteButton({ propertyId, className = "" }: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const syncState = useCallback(async () => {
    if (session?.user) {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) return;
        const data = await res.json();
        setFavorited((data.propertyIds as string[]).includes(propertyId));
      } catch {
        /* ignore */
      }
      return;
    }
    setFavorited(readGuestFavorites().includes(propertyId));
  }, [session?.user, propertyId]);

  useEffect(() => {
    if (status === "loading") return;
    void syncState();
  }, [status, syncState]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    if (!session?.user) {
      const guest = readGuestFavorites();
      const next = guest.includes(propertyId)
        ? guest.filter((id) => id !== propertyId)
        : [...guest, propertyId];
      writeGuestFavorites(next);
      setFavorited(next.includes(propertyId));
      return;
    }

    setLoading(true);
    try {
      if (favorited) {
        await fetch(`/api/favorites?propertyId=${encodeURIComponent(propertyId)}`, {
          method: "DELETE",
        });
        setFavorited(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });
        setFavorited(true);
      }
      router.refresh();
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      className={`rounded-full bg-white/90 dark:bg-slate-900/90 p-2 shadow-sm border border-slate-200 dark:border-slate-600 hover:scale-105 transition-transform disabled:opacity-60 ${className}`}
    >
      <svg
        className={`w-5 h-5 ${favorited ? "fill-red-500 text-red-500" : "fill-none text-slate-600 dark:text-slate-300"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
