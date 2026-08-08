import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/data";
import { formatPriceINR } from "@/lib/format";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";
import PropertyShareActions from "@/components/PropertyShareActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);
  const config = getSiteConfig();

  if (!property) {
    return buildPageMetadata(config, "Property not found");
  }

  return {
    ...buildPageMetadata(
      config,
      property.title,
      `${formatPriceINR(property.price)} · ${property.city}, ${property.state}`
    ),
    openGraph: property.images[0]
      ? { images: [{ url: property.images[0] }] }
      : undefined,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const { contactPhone, contactEmail, siteUrl } = getSiteConfig();

  const [primaryImage, ...restImages] = property.images;

  const baseUrl = siteUrl ?? "http://localhost:3000";
  const propertyUrl = `${baseUrl}/property/${property.id}`;
  const shareMessage = [
    `${property.title}`,
    `${property.city}, ${property.state} • ${formatPriceINR(property.price)}`,
    property.description ? `${property.description.slice(0, 120)}${property.description.length > 120 ? "…" : ""}` : "",
    `View full details: ${propertyUrl}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium mb-6 hover:text-primary-600 dark:hover:text-primary-400 transition-colors touch-target"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
            <Image
              src={primaryImage}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              unoptimized
            />
          </div>
          {restImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {restImages.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700"
                >
                  <Image
                    src={src}
                    alt={`${property.title} ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="sticky top-24">
            <span className="inline-block px-2 py-1 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md capitalize mb-2">
              {property.type}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {property.title}
            </h1>
            <p className="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPriceINR(property.price)}
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {property.address}, {property.city}, {property.state} – {property.zip}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              {property.bedrooms > 0 && (
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Bedrooms</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">{property.bedrooms}</dd>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Bathrooms</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">{property.bathrooms}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Area</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">
                  {property.area.toLocaleString()} sq ft
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Pincode</dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{property.zip}</dd>
              </div>
            </dl>

            <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              {property.description}
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Contact agent</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Call agent
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium px-5 py-3 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Email agent
                    </a>
                  )}
                  {!contactPhone && !contactEmail && (
                    <Link
                      href="/contact"
                      className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                    >
                      Contact us for inquiries →
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <PropertyShareActions propertyUrl={propertyUrl} shareMessage={shareMessage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
