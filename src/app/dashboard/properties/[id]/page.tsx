import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminPropertyById } from "@/lib/data";
import { formatPriceINR } from "@/lib/format";
import { canAccessAdmin } from "@/lib/auth-types";
import DashboardPropertyActions from "./DashboardPropertyActions";

export default async function DashboardPropertyViewPage({
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

  const [primaryImage, ...restImages] = property.images;
  const isDeleted = Boolean(property.deletedAt);

  return (
    <div className="max-w-4xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium mb-6 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to my listings
      </Link>

      {isDeleted && (
        <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-4 py-3 text-sm">
          This listing is hidden from the public. Restore it to show it again.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
            {property.title}
          </h1>
          <DashboardPropertyActions
            propertyId={property.id}
            deletedAt={property.deletedAt ?? undefined}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
              <Image
                src={primaryImage}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
            {restImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {restImages.slice(0, 4).map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <Image src={src} alt="" fill className="object-cover" sizes="25vw" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="inline-block px-2 py-1 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md capitalize mb-2">
              {property.type}
            </span>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPriceINR(property.price)}
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {property.address}, {property.city}, {property.state} – {property.zip}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {property.bedrooms > 0 && (
                <>
                  <dt className="text-slate-500 dark:text-slate-400">Bedrooms</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{property.bedrooms}</dd>
                </>
              )}
              {property.bathrooms > 0 && (
                <>
                  <dt className="text-slate-500 dark:text-slate-400">Bathrooms</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{property.bathrooms}</dd>
                </>
              )}
              <dt className="text-slate-500 dark:text-slate-400">Area</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{property.area.toLocaleString()} sq ft</dd>
            </dl>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
