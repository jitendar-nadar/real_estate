"use client";

import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";

interface AgentSelectFieldProps {
  value: string;
  onChange: (agentId: string) => void;
  label?: string;
}

export default function AgentSelectField({
  value,
  onChange,
  label = "Listing agent",
}: AgentSelectFieldProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/agents");
        if (!res.ok) return;
        const data = (await res.json()) as Agent[];
        if (!cancelled) setAgents(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white disabled:opacity-60"
      >
        <option value="">No agent assigned</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
            {a.title ? ` — ${a.title}` : ""}
          </option>
        ))}
      </select>
      {!loading && agents.length === 0 && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Add agents in Admin → Agents to assign listings.
        </p>
      )}
    </div>
  );
}
