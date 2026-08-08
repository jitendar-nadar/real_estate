import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { Property } from "@/lib/types";
import { seedDbIfEmpty } from "./seed";

const COLLECTION = "properties";

/** Query for non–soft-deleted documents (existing docs may lack deletedAt) */
const notDeleted = { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] };

function toProperty(doc: Property & { _id?: ObjectId }): Property {
  const { _id, ...rest } = doc;
  return rest as Property;
}

async function withDb<T>(fallback: T, fn: (db: Awaited<ReturnType<typeof getDb>>) => Promise<T>): Promise<T> {
  if (!isMongoConfigured()) return fallback;
  try {
    const db = await getDb();
    return await fn(db);
  } catch (e) {
    console.error("Database error:", e);
    return fallback;
  }
}

export async function getAllProperties(): Promise<Property[]> {
  return withDb([], async (db) => {
    await seedDbIfEmpty();
    const list = await db
      .collection<Property>(COLLECTION)
      .find(notDeleted)
      .toArray();
    return list.map(toProperty);
  });
}

/** All properties including soft-deleted (for admin) */
export async function getAllPropertiesForAdmin(): Promise<Property[]> {
  return withDb([], async (db) => {
    await seedDbIfEmpty();
    const list = await db.collection<Property>(COLLECTION).find({}).toArray();
    return list.map(toProperty);
  });
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return withDb(null, async (db) => {
    await seedDbIfEmpty();
    const doc = await db
      .collection<Property>(COLLECTION)
      .findOne({ id, $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] });
    return doc ? toProperty(doc) : null;
  });
}

/** By id including soft-deleted (for admin edit) */
export async function getPropertyByIdForAdmin(id: string): Promise<Property | null> {
  return withDb(null, async (db) => {
    await seedDbIfEmpty();
    const doc = await db.collection<Property>(COLLECTION).findOne({ id });
    return doc ? toProperty(doc) : null;
  });
}

/** Properties created by a user (includes soft-deleted for dashboard) */
export async function getPropertiesByUserId(userId: string): Promise<Property[]> {
  return withDb([], async (db) => {
    await seedDbIfEmpty();
    const list = await db.collection<Property>(COLLECTION).find({ createdBy: userId }).toArray();
    return list.map(toProperty);
  });
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return withDb([], async (db) => {
    await seedDbIfEmpty();
    const list = await db
      .collection<Property>(COLLECTION)
      .find({ $and: [{ featured: true }, notDeleted] })
      .toArray();
    return list.map(toProperty);
  });
}

export async function createProperty(
  data: Omit<Property, "id" | "listingDate" | "deletedAt"> & { createdBy?: string | null }
): Promise<Property> {
  const db = await getDb();
  const id = new ObjectId().toString();
  const listingDate = new Date().toISOString().slice(0, 10);
  const property: Property = {
    id,
    listingDate,
    deletedAt: null,
    createdBy: data.createdBy ?? null,
    ...data,
  };
  await db.collection<Property>(COLLECTION).insertOne(property as Property & { _id?: ObjectId });
  return property;
}

/** Check if property exists and is owned by userId. Legacy docs without createdBy are not considered owned by anyone. */
export async function isPropertyOwnedBy(id: string, userId: string): Promise<boolean> {
  const doc = await withDb(null, async (db) =>
    db.collection<Property>(COLLECTION).findOne({ id }, { projection: { createdBy: 1 } })
  );
  if (!doc) return false;
  const createdBy = (doc as { createdBy?: string | null }).createdBy;
  return createdBy === userId;
}

export async function updateProperty(
  id: string,
  data: Partial<Omit<Property, "id" | "listingDate">>
): Promise<Property | null> {
  const db = await getDb();
  const result = await db.collection<Property>(COLLECTION).findOneAndUpdate(
    { id },
    { $set: data },
    { returnDocument: "after" }
  );
  return result ? toProperty(result as Property & { _id?: ObjectId }) : null;
}

/** Soft delete: set deletedAt. Returns updated property or null. */
export async function softDeleteProperty(id: string): Promise<Property | null> {
  const db = await getDb();
  const deletedAt = new Date().toISOString();
  const result = await db.collection<Property>(COLLECTION).findOneAndUpdate(
    { id },
    { $set: { deletedAt } },
    { returnDocument: "after" }
  );
  return result ? toProperty(result as Property & { _id?: ObjectId }) : null;
}

/** Restore soft-deleted property. */
export async function restoreProperty(id: string): Promise<Property | null> {
  const db = await getDb();
  const result = await db.collection<Property>(COLLECTION).findOneAndUpdate(
    { id },
    { $set: { deletedAt: null } },
    { returnDocument: "after" }
  );
  return result ? toProperty(result as Property & { _id?: ObjectId }) : null;
}

/** Hard delete (for future use if needed). */
export async function hardDeleteProperty(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection<Property>(COLLECTION).deleteOne({ id });
  return (result.deletedCount ?? 0) > 0;
}
