"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardPropertyActionsProps {
  propertyId: string;
  deletedAt?: string;
}

export default function DashboardPropertyActions({
  propertyId,
  deletedAt,
}: DashboardPropertyActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"delete" | "restore" | null>(null);
  const isDeleted = Boolean(deletedAt);

  const handleDelete = async () => {
    if (!confirm("Remove this listing? It will be hidden from the site and you can restore it later.")) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard?deleted=1");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setLoading("restore");
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      if (res.ok) {
        router.push("/dashboard?restored=1");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to restore");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isDeleted && (
        <>
          <Link
            href={`/property/${propertyId}`}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            View on site
          </Link>
          <Link
            href={`/dashboard/properties/${propertyId}/edit`}
            className="rounded-lg bg-primary-600 hover:bg-primary-700 px-3 py-2 text-sm font-medium text-white"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading !== null}
            className="rounded-lg border border-red-300 dark:border-red-800 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60"
          >
            {loading === "delete" ? "Removing…" : "Remove"}
          </button>
        </>
      )}
      {isDeleted && (
        <button
          type="button"
          onClick={handleRestore}
          disabled={loading !== null}
          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading === "restore" ? "Restoring…" : "Restore listing"}
        </button>
      )}
    </div>
  );
}
