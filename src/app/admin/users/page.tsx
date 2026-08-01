import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllUsers } from "@/lib/db/users";
import UserActions from "./UserActions";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  user: "User",
};

export default async function UserMasterPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const users = await getAllUsers();
  const currentUserId = session?.user?.id ?? null;

  return (
    <div>
      {params.created === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">
          User created successfully.
        </div>
      )}
      {params.updated === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 text-sm">
          User updated successfully.
        </div>
      )}
      {params.deleted === "1" && (
        <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-4 py-3 text-sm">
          User deleted.
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        User management ({users.length})
      </h2>

      {users.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 mb-4">No users yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Role
                </th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-100 dark:border-slate-700/50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <UserActions userId={u.id} userEmail={u.email} currentUserId={currentUserId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/admin/users/new"
          className="inline-flex items-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2"
        >
          Add user
        </Link>
      </div>
    </div>
  );
}
