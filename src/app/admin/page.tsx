import Link from "next/link";
import { getAdminProperties } from "@/lib/data";
import { formatPriceINR } from "@/lib/format";
import AdminPropertyActions from "@/components/AdminPropertyActions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; updated?: string; deleted?: string; restored?: string }>;
}) {
  const params = await searchParams;
  const properties = await getAdminProperties();

  return (
    <div>
      {params.added === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">
          Property added successfully. It will appear on the listings.
        </div>
      )}
      {params.updated === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">
          Property updated successfully.
        </div>
      )}
      {params.deleted === "1" && (
        <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-4 py-3 text-sm">
          Property soft-deleted. It is hidden from listings and can be restored.
        </div>
      )}
      {params.restored === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">
          Property restored. It will appear on the listings again.
        </div>
      )}
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        All properties ({properties.length})
      </h2>

      {properties.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          No properties yet. Add your first one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Title
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Location
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Price
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Type
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-slate-100 dark:border-slate-700/50 last:border-0 ${p.deletedAt ? "bg-slate-50 dark:bg-slate-800/70 opacity-90" : ""}`}
                >
                  <td className="px-4 py-3 text-slate-900 dark:text-white max-w-[200px] truncate">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {p.city}, {p.state}
                  </td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white whitespace-nowrap">
                    {formatPriceINR(p.price)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 capitalize">
                    {p.type}
                  </td>
                  <td className="px-4 py-3">
                    {p.deletedAt ? (
                      <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                        Deleted
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <AdminPropertyActions
                      propertyId={p.id}
                      deletedAt={p.deletedAt ?? undefined}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2"
        >
          Add property
        </Link>
      </div>
    </div>
  );
}
