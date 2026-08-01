import Link from "next/link";
import UserForm from "../UserForm";

export default function NewUserPage() {
  return (
    <div className="max-w-md">
      <Link
        href="/admin/users"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 inline-block"
      >
        ← Back to users
      </Link>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
        Add user
      </h2>
      <UserForm mode="create" />
    </div>
  );
}
