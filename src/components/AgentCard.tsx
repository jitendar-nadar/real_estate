import Link from "next/link";
import Image from "next/image";
import type { Agent } from "@/lib/types";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop";

export default function AgentCard({ agent }: { agent: Agent }) {
  const photo = agent.photo?.trim() || FALLBACK_PHOTO;

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg transition-all"
    >
      <div className="relative aspect-square max-h-56 bg-slate-100 dark:bg-slate-700">
        <Image
          src={photo}
          alt={agent.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 33vw"
          unoptimized
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
          {agent.name}
        </h3>
        {agent.title && (
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">{agent.title}</p>
        )}
        {agent.bio && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{agent.bio}</p>
        )}
      </div>
    </Link>
  );
}
