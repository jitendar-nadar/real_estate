import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentById } from "@/lib/db/agents";
import AgentForm from "../../AgentForm";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgentById(id);
  if (!agent) notFound();

  return (
    <div>
      <Link
        href="/admin/agents"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 mb-6 inline-block"
      >
        ← Back to agents
      </Link>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Edit agent</h2>
      <AgentForm mode="edit" agentId={agent.id} initial={agent} />
    </div>
  );
}
