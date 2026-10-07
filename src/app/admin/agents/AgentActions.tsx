"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AgentActions({ agentId, agentName }: { agentId: string; agentName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete agent "${agentName}"? Listings will be unassigned.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/agents/${agentId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/agents?deleted=1");
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
        href={`/agents/${agentId}`}
        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
        target="_blank"
      >
        Public profile
      </Link>
      <Link
        href={`/admin/agents/${agentId}/edit`}
        className="rounded border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded border border-red-300 dark:border-red-800 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-60"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
