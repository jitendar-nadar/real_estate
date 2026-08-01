import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminPropertyById } from "@/lib/data";
import { canAccessAdmin } from "@/lib/auth-types";
import EditPropertyForm from "@/app/admin/properties/[id]/edit/EditPropertyForm";

export default async function DashboardEditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  if (!session?.user?.id) return null;

  const property = await getAdminPropertyById(id);
  if (!property) notFound();

  const isAdmin = canAccessAdmin(session.user.role);
  const isOwner = property.createdBy === session.user.id;
  if (!isAdmin && !isOwner) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 inline-block"
      >
        ← Back to my listings
      </Link>

      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Edit property
      </h2>
      {property.deletedAt && (
        <p className="text-amber-600 dark:text-amber-400 text-sm mb-4">
          This listing is currently hidden. You can restore it from My listings.
        </p>
      )}

      <EditPropertyForm
        property={property}
        successRedirect="/dashboard?updated=1"
        backHref="/dashboard"
      />
    </div>
  );
}
