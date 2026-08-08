import { Property } from "./types";
import * as db from "./db/properties";
import * as inquiriesDb from "./db/inquiries";

export async function getAllProperties(): Promise<Property[]> {
  return db.getAllProperties();
}

export async function getAllInquiries() {
  return inquiriesDb.getAllInquiries();
}

export async function getInquiryCounts() {
  return inquiriesDb.getInquiryCounts();
}

/** All properties including soft-deleted (admin only) */
export async function getAdminProperties(): Promise<Property[]> {
  return db.getAllPropertiesForAdmin();
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const property = await db.getPropertyById(id);
  return property ?? undefined;
}

/** Single property including soft-deleted (admin only) */
export async function getAdminPropertyById(id: string): Promise<Property | undefined> {
  const property = await db.getPropertyByIdForAdmin(id);
  return property ?? undefined;
}

/** Properties created by a user (for My Listings dashboard) */
export async function getMyProperties(userId: string): Promise<Property[]> {
  return db.getPropertiesByUserId(userId);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return db.getFeaturedProperties();
}
