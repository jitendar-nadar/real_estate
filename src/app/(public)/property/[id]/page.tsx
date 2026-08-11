import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById, getAllProperties } from "@/lib/data";
import { formatPriceINR } from "@/lib/format";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";
import PropertyShareActions from "@/components/PropertyShareActions";
import PropertyCard from "@/components/PropertyCard";
import InquiryForm from "@/components/InquiryForm";
import PropertyMapEmbed from "@/components/PropertyMapEmbed";

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

  const allProperties = await getAllProperties();
  const related = allProperties
    .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .slice(0, 3);

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

  const mapQuery = encodeURIComponent(
    `${property.address}, ${property.city}, ${property.state} ${property.zip}`
  );

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
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="touch-target inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-3 shadow-sm transition"
                    >
                      Call agent
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium px-5 py-3 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Email agent
                    </a>
                  )}
                </div>
                <InquiryForm propertyId={property.id} propertyTitle={property.title} submitLabel="Send inquiry" />
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sr-only"
              >
                View location on map
              </a>

              <PropertyMapEmbed
                address={property.address}
                city={property.city}
                state={property.state}
                zip={property.zip}
              />

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <PropertyShareActions propertyUrl={propertyUrl} shareMessage={shareMessage} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14 border-t border-slate-200 dark:border-slate-700 pt-10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Related properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
