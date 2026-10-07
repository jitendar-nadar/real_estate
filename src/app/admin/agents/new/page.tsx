import Link from "next/link";
import AgentForm from "../AgentForm";

export default function NewAgentPage() {
  return (
    <div>
      <Link
        href="/admin/agents"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 mb-6 inline-block"
      >
        ← Back to agents
      </Link>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Add agent</h2>
      <AgentForm mode="create" />
    </div>
  );
}
