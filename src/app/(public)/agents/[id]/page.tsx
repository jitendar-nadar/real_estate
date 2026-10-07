import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentById, getPropertiesByAgentId } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";
import PropertyCard from "@/components/PropertyCard";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgentById(id);
  const config = getSiteConfig();
  if (!agent || agent.active === false) {
    return buildPageMetadata(config, "Agent not found");
  }
  return buildPageMetadata(config, agent.name, agent.title ?? agent.bio ?? undefined);
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await getAgentById(id);
  if (!agent || agent.active === false) notFound();

  const listings = await getPropertiesByAgentId(agent.id);
  const photo = agent.photo?.trim() || FALLBACK_PHOTO;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/agents"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 mb-8 inline-block"
      >
        ← All agents
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="relative aspect-square max-w-sm rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image src={photo} alt={agent.name} fill className="object-cover" unoptimized />
          </div>
        </div>
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{agent.name}</h1>
          {agent.title && (
            <p className="mt-1 text-lg text-primary-600 dark:text-primary-400">{agent.title}</p>
          )}
          {agent.bio && (
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{agent.bio}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${agent.email}`}
              className="inline-flex rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5"
            >
              Email {agent.name.split(" ")[0]}
            </a>
            {agent.phone && (
              <a
                href={`tel:${agent.phone.replace(/\s/g, "")}`}
                className="inline-flex rounded-lg border border-slate-300 dark:border-slate-600 font-medium px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Call
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="mt-14 border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          Listings ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No active listings for this agent yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
