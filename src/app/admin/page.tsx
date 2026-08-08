import Link from "next/link";
import { getAdminProperties, getAllProperties } from "@/lib/data";
import { getAllInquiries, getInquiryCounts } from "@/lib/data";
import { getAllUsers } from "@/lib/db/users";

export default async function AdminDashboardPage() {
  const [properties, adminProperties, inquiries, inquiryCounts, users] = await Promise.all([
    getAllProperties(),
    getAdminProperties(),
    getAllInquiries(),
    getInquiryCounts(),
    getAllUsers(),
  ]);

  const activeCount = properties.length;
  const featuredCount = properties.filter((p) => p.featured).length;
  const recentInquiries = inquiries.slice(0, 5);

  const stats = [
    { label: "Active listings", value: activeCount, href: "/admin/properties" },
    { label: "Featured", value: featuredCount, href: "/listings?featured=1" },
    { label: "New inquiries", value: inquiryCounts.new, href: "/admin/inquiries" },
    { label: "Team members", value: users.length, href: "/admin/users" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Overview of listings, inquiries, and team activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent inquiries</h3>
            <Link href="/admin/inquiries" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">No inquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{inquiry.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{inquiry.email}</p>
                  {inquiry.propertyTitle && (
                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 truncate">
                      Re: {inquiry.propertyTitle}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Quick actions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/properties/new"
              className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              + Add property
            </Link>
            <Link
              href="/admin/users/new"
              className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              + Add user
            </Link>
            <Link
              href="/admin/properties"
              className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              Manage properties ({adminProperties.length})
            </Link>
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              View public site →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
