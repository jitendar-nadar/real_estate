import type { Metadata } from "next";
import { Suspense } from "react";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { getAllProperties } from "@/lib/data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSiteConfig } from "@/lib/site-config";
import { Property, PropertyType } from "@/lib/types";

const config = getSiteConfig();

export const metadata: Metadata = buildPageMetadata(
  config,
  "Property Listings",
  `Browse residential and commercial properties from ${config.companyName}.`
);

interface PageProps {
  searchParams: Promise<{ state?: string; city?: string; type?: string; minPrice?: string; maxPrice?: string; featured?: string }>;
}

function filterProperties(
  list: Property[],
  searchParams: {
    state?: string;
    city?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
  }
) {
  let filtered = [...list];
  if (searchParams.featured === "1") {
    filtered = filtered.filter((p) => p.featured);
  }
  if (searchParams.state) {
    filtered = filtered.filter((p) => p.state === searchParams.state);
  }
  if (searchParams.city) {
    filtered = filtered.filter((p) => p.city === searchParams.city);
  }
  if (searchParams.type) {
    filtered = filtered.filter((p) => p.type === (searchParams.type as PropertyType));
  }
  if (searchParams.minPrice) {
    const min = Number(searchParams.minPrice);
    if (!Number.isNaN(min)) filtered = filtered.filter((p) => p.price >= min);
  }
  if (searchParams.maxPrice) {
    const max = Number(searchParams.maxPrice);
    if (!Number.isNaN(max)) filtered = filtered.filter((p) => p.price <= max);
  }
  return filtered;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const all = await getAllProperties();
  const filtered = filterProperties(all, params);

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
        {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No properties match your filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
