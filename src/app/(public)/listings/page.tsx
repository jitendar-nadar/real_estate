import type { Metadata } from "next";
import { Suspense } from "react";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { getAllProperties } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";
import { LISTINGS_PAGE_SIZE } from "@/lib/constants";
import { filterAndSortProperties, paginate, type ListingSearchParams } from "@/lib/property-filters";

const config = getSiteConfig();

export const metadata: Metadata = buildPageMetadata(
  config,
  "Property Listings",
  `Browse residential and commercial properties from ${config.companyName}.`
);

interface PageProps {
  searchParams: Promise<ListingSearchParams>;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const all = await getAllProperties();
  const filtered = filterAndSortProperties(all, params);
  const page = Math.max(1, Number(params.page) || 1);
  const { items, total, totalPages, page: currentPage } = paginate(
    filtered,
    page,
    LISTINGS_PAGE_SIZE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Property listings
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Search and filter available residential and commercial properties.
      </p>

      <Suspense fallback={<div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />}>
        <div className="mb-8">
          <SearchBar />
        </div>
      </Suspense>

      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {total} {total === 1 ? "property" : "properties"} found
        {totalPages > 1 && (
          <span className="text-slate-500"> · Page {currentPage} of {totalPages}</span>
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No properties match your filters. Try adjusting your search criteria.
          </p>
        </div>
      )}

      <Suspense fallback={null}>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
