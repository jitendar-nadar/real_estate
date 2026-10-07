import Link from "next/link";
import { getAllAgents } from "@/lib/db/agents";
import AgentActions from "./AgentActions";

export default async function AdminAgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const agents = await getAllAgents(false);

  return (
    <div>
      {params.created === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">
          Agent created successfully.
        </div>
      )}
      {params.updated === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">
          Agent updated successfully.
        </div>
      )}
      {params.deleted === "1" && (
        <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-4 py-3 text-sm">
          Agent deleted.
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Agents ({agents.length})
      </h2>

      {agents.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 mb-4">No agents yet. Add your sales team.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{a.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{a.email}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{a.title ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                        a.active !== false
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {a.active !== false ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AgentActions agentId={a.id} agentName={a.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/admin/agents/new"
          className="inline-flex rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2"
        >
          Add agent
        </Link>
      </div>
    </div>
  );
}
