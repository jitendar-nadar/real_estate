export type PropertyType = "house" | "apartment" | "condo" | "land" | "commercial";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number; // sq ft
  address: string;
  city: string;
  state: string;
  zip: string;
  images: string[];
  featured?: boolean;
  listingDate: string;
  /** ISO date string when soft-deleted; null/undefined = active */
  deletedAt?: string | null;
  /** User id who created the listing (for ownership) */
  createdBy?: string | null;
}

export interface SearchFilters {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  state?: string;
  city?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "area";
}

export type InquiryStatus = "new" | "read" | "archived";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string | null;
  propertyTitle?: string | null;
  status: InquiryStatus;
  createdAt: string;
}
