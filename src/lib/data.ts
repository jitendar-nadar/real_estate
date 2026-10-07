import { Agent, Property } from "./types";
import * as db from "./db/properties";
import * as inquiriesDb from "./db/inquiries";
import * as agentsDb from "./db/agents";
import * as favoritesDb from "./db/favorites";

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

export async function getAllAgents(activeOnly = false): Promise<Agent[]> {
  return agentsDb.getAllAgents(activeOnly);
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  const agent = await agentsDb.getAgentById(id);
  return agent ?? undefined;
}

export async function getPropertiesByAgentId(agentId: string): Promise<Property[]> {
  return db.getPropertiesByAgentId(agentId);
}

export async function getFavoritePropertyIds(userId: string): Promise<string[]> {
  return favoritesDb.getFavoritePropertyIds(userId);
}
