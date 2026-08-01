import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/db/users";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  user: "User",
};

export default async function UserViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();

  return (
    <div className="max-w-md">
      <Link
        href="/admin/users"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 inline-block"
      >
        ← Back to users
      </Link>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
        User details
      </h2>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4">
        <div>
          <dt className="text-sm text-slate-500 dark:text-slate-400">Name</dt>
          <dd className="font-medium text-slate-900 dark:text-white mt-0.5">{user.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt>
          <dd className="font-medium text-slate-900 dark:text-white mt-0.5">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500 dark:text-slate-400">Role</dt>
          <dd className="mt-0.5">
            <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </dd>
        </div>
      </div>
      <div className="mt-6">
        <Link
          href={`/admin/users/${id}/edit`}
          className="inline-flex rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2"
        >
          Edit user
        </Link>
      </div>
    </div>
  );
}
