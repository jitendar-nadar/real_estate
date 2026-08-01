"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserActionsProps {
  userId: string;
  userEmail: string;
  currentUserId?: string | null;
}

export default function UserActions({ userId, userEmail, currentUserId }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete user "${userEmail}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/users?deleted=1");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/users/${userId}`}
        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
      >
        View
      </Link>
      <Link
        href={`/admin/users/${userId}/edit`}
        className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        Edit
      </Link>
      {userId !== currentUserId && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded border border-red-300 dark:border-red-800 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60"
        >
          {loading ? "Deleting…" : "Delete"}
        </button>
      )}
    </div>
  );
}
