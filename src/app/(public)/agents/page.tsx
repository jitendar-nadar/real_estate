import { getAllAgents } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";
import AgentCard from "@/components/AgentCard";

export async function generateMetadata() {
  const config = getSiteConfig();
  return buildPageMetadata(config, "Our agents", "Meet the team helping you find your next property.");
}

export default async function AgentsPage() {
  const agents = await getAllAgents(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Our agents</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
        Browse profiles and listings from our licensed sales team.
      </p>

      {agents.length === 0 ? (
        <p className="mt-10 text-slate-600 dark:text-slate-400">Agent profiles will appear here soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
