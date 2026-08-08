"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { InquiryStatus } from "@/lib/types";

interface InquiryActionsProps {
  inquiryId: string;
  status: InquiryStatus;
}

export default function InquiryActions({ inquiryId, status }: InquiryActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: InquiryStatus) {
    setLoading(true);
    try {
      await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this inquiry permanently?")) return;
    setLoading(true);
    try {
      await fetch(`/api/inquiries/${inquiryId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "new" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("read")}
          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50"
        >
          Mark read
        </button>
      )}
      {status !== "archived" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus("archived")}
          className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:underline disabled:opacity-50"
        >
          Archive
        </button>
      )}
      <button
        type="button"
        disabled={loading}
        onClick={handleDelete}
        className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
