import Link from "next/link";
import Image from "next/image";
import { Property } from "@/lib/types";
import { formatPriceINR } from "@/lib/format";

export default function PropertyCard({ property }: { property: Property }) {
  const [firstImage] = property.images;

  return (
    <Link
      href={`/property/${property.id}`}
      className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
    >
      <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <Image
          src={firstImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {property.featured && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-primary-500 text-white rounded-md">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 rounded-md capitalize">
          {property.type}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {property.title}
        </h3>
        <p className="mt-1 text-lg font-bold text-primary-600 dark:text-primary-400">
          {formatPriceINR(property.price)}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {property.city}, {property.state}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          {property.bedrooms > 0 && <span>{property.bedrooms} BHK</span>}
          {property.bathrooms > 0 && <span>{property.bathrooms} baths</span>}
          <span>{property.area.toLocaleString()} sq ft</span>
        </div>
      </div>
    </Link>
  );
}
