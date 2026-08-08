import { Property, PropertyType, SearchFilters } from "./types";

export interface ListingSearchParams {
  state?: string;
  city?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  sort?: string;
  featured?: string;
  page?: string;
}

export function filterAndSortProperties(
  list: Property[],
  searchParams: ListingSearchParams
): Property[] {
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
  if (searchParams.bedrooms) {
    const minBedrooms = Number(searchParams.bedrooms);
    if (!Number.isNaN(minBedrooms)) {
      filtered = filtered.filter((p) => p.bedrooms >= minBedrooms);
    }
  }
  if (searchParams.bathrooms) {
    const minBathrooms = Number(searchParams.bathrooms);
    if (!Number.isNaN(minBathrooms)) {
      filtered = filtered.filter((p) => p.bathrooms >= minBathrooms);
    }
  }

  const sort = searchParams.sort as SearchFilters["sort"] | undefined;
  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "area":
      filtered.sort((a, b) => b.area - a.area);
      break;
    case "newest":
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime()
      );
      break;
  }

  return filtered;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; totalPages: number; page: number } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  };
}
