import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSessionSafe } from "@/lib/auth";
import { getAllProperties, getFavoritePropertyIds } from "@/lib/data";
import PropertyCard from "@/components/PropertyCard";

export default async function FavoritesPage() {
  const session = await getServerSessionSafe();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/favorites");

  const [ids, properties] = await Promise.all([
    getFavoritePropertyIds(session.user.id),
    getAllProperties(),
  ]);
  const favorites = properties.filter((p) => ids.includes(p.id));

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Saved properties</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Properties you saved while signed in. Use the heart icon on listings to add or remove.
      </p>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">You have no saved properties yet.</p>
          <Link
            href="/listings"
            className="inline-flex rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2"
          >
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
