import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminPropertyById } from "@/lib/data";
import EditPropertyForm from "./EditPropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getAdminPropertyById(id);
  if (!property) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 inline-block"
      >
        ← Back to admin
      </Link>

      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Edit property
      </h2>
      {property.deletedAt && (
        <p className="text-amber-600 dark:text-amber-400 text-sm mb-4">
          This property is soft-deleted. You can edit and then restore it from the admin list.
        </p>
      )}

      <EditPropertyForm property={property} />
    </div>
  );
}
