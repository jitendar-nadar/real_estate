import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/db/users";
import UserForm from "../../UserForm";

export default async function EditUserPage({
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
        Edit user
      </h2>
      <UserForm
        mode="edit"
        userId={id}
        initial={{ name: user.name, email: user.email, role: user.role }}
      />
    </div>
  );
}
