import Link from "next/link";
import { Suspense } from "react";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { getFeaturedProperties, getAllProperties } from "@/lib/data";
import { getSiteConfig } from "@/lib/site-config";
import { PropertyType } from "@/lib/types";

const PROPERTY_TYPES: { type: PropertyType; label: string; description: string }[] = [
  { type: "apartment", label: "Apartments", description: "Urban flats and high-rise living" },
  { type: "house", label: "Houses", description: "Independent homes and villas" },
  { type: "condo", label: "Condos", description: "Condominiums and shared-ownership units" },
  { type: "commercial", label: "Commercial", description: "Offices, retail, and business spaces" },
  { type: "land", label: "Land", description: "Residential and commercial plots" },
];

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedProperties(), getAllProperties()]);
  const { companyName, heroHeadline, heroSubheadline, contactPhone, contactEmail } =
    getSiteConfig();

  const cities = new Set(all.map((p) => p.city)).size;
  const typeCounts = PROPERTY_TYPES.map((t) => ({
    ...t,
    count: all.filter((p) => p.type === t.type).length,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-primary-300 font-medium text-sm uppercase tracking-widest mb-4">
            {companyName}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
            {heroHeadline}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            {heroSubheadline}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/listings"
              className="touch-target inline-flex items-center rounded-lg bg-white text-slate-900 font-semibold px-6 py-3 hover:bg-slate-100 transition-colors shadow-lg"
            >
              Browse listings
            </Link>
            <Link
              href="/contact"
              className="touch-target inline-flex items-center rounded-lg border border-white/30 text-white font-semibold px-6 py-3 hover:bg-white/10 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {all.length > 0 && (
        <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{all.length}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Active listings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{featured.length}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Featured properties</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{cities}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Cities covered</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">5</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Property types</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="mb-12 sm:mb-16 -mt-8 sm:-mt-10 relative z-10">
          <Suspense
            fallback={
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse shadow-lg" />
            }
          >
            <SearchBar />
          </Suspense>
        </section>

        {all.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Browse by property type
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {typeCounts.map(({ type, label, description, count }) => (
                <Link
                  key={type}
                  href={`/listings?type=${type}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
                  <p className="mt-3 text-sm font-medium text-primary-600 dark:text-primary-400">
                    {count} {count === 1 ? "listing" : "listings"} →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                Featured properties
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Handpicked listings from our portfolio
              </p>
            </div>
            <Link
              href="/listings"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline touch-target inline-flex items-center shrink-0"
            >
              View all →
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : all.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {all.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Listings will appear here once properties are added.
              </p>
              <Link
                href="/listings"
                className="mt-4 inline-block text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Browse all listings
              </Link>
            </div>
          )}
        </section>

        <section className="mt-14 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-10 sm:px-10 text-white">
          <h2 className="text-2xl font-bold">Ready to find your next property?</h2>
          <p className="mt-2 text-primary-100 max-w-xl">
            Browse verified listings, send an inquiry, or contact our team for personalized assistance.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/listings"
              className="inline-flex rounded-lg bg-white text-primary-700 font-semibold px-6 py-3 hover:bg-primary-50 transition"
            >
              Explore listings
            </Link>
            {(contactPhone || contactEmail) && (
              <Link
                href="/contact"
                className="inline-flex rounded-lg border border-white/40 font-semibold px-6 py-3 hover:bg-white/10 transition"
              >
                Get in touch
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
