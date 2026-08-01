import Link from "next/link";
import { Suspense } from "react";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { getFeaturedProperties } from "@/lib/data";
import { getSiteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const featured = await getFeaturedProperties();
  const { companyName, heroHeadline, heroSubheadline, contactPhone, contactEmail } =
    getSiteConfig();

  return (
    <>
      {/* Hero */}
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
            {(contactPhone || contactEmail) && (
              <Link
                href="/contact"
                className="touch-target inline-flex items-center rounded-lg border border-white/30 text-white font-semibold px-6 py-3 hover:bg-white/10 transition-colors"
              >
                Contact us
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Search */}
        <section className="mb-12 sm:mb-16 -mt-8 sm:-mt-10 relative z-10">
          <Suspense
            fallback={
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse shadow-lg" />
            }
          >
            <SearchBar />
          </Suspense>
        </section>

        {/* Featured */}
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
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Featured listings will appear here once properties are added.
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
      </div>
    </>
  );
}
