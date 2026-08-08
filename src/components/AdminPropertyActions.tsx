"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminPropertyActionsProps {
  propertyId: string;
  deletedAt?: string;
  /** Base path for edit link and redirects: "admin" | "dashboard" */
  basePath?: "admin" | "dashboard";
}

export default function AdminPropertyActions({
  propertyId,
  deletedAt,
  basePath = "admin",
}: AdminPropertyActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"delete" | "restore" | null>(null);
  const redirectBase = basePath === "dashboard" ? "/dashboard" : "/admin/properties";
  const viewHref =
    basePath === "dashboard"
      ? `/dashboard/properties/${propertyId}`
      : `/property/${propertyId}`;
  const editHref =
    basePath === "dashboard"
      ? `/dashboard/properties/${propertyId}/edit`
      : `/admin/properties/${propertyId}/edit`;

  const handleDelete = async () => {
    if (!confirm("Soft-delete this property? It will be hidden from listings and can be restored later.")) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
      if (res.ok) {
        router.push(`${redirectBase}?deleted=1`);
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
        router.push(`${redirectBase}?restored=1`);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to restore");
      }
    } finally {
      setLoading(null);
    }
  };

  const isDeleted = Boolean(deletedAt);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isDeleted && (
        <>
          <Link
            href={viewHref}
            className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
          >
            View
          </Link>
          <Link
            href={editHref}
            className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading !== null}
            className="rounded border border-red-300 dark:border-red-800 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60"
          >
            {loading === "delete" ? "Deleting…" : "Delete"}
          </button>
        </>
      )}
      {isDeleted && (
        <>
          <Link
            href={viewHref}
            className="text-slate-600 dark:text-slate-400 hover:underline text-sm font-medium"
          >
            View
          </Link>
          <button
          type="button"
          onClick={handleRestore}
          disabled={loading !== null}
          className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading === "restore" ? "Restoring…" : "Restore"}
        </button>
        </>
      )}
    </div>
  );
}
