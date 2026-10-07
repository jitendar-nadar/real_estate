import { getDb, isMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "favorites";

export async function getFavoritePropertyIds(userId: string): Promise<string[]> {
  if (!isMongoConfigured()) return [];
  try {
    const db = await getDb();
    const docs = await db
      .collection<{ userId: string; propertyId: string }>(COLLECTION)
      .find({ userId })
      .toArray();
    return docs.map((d) => d.propertyId);
  } catch (e) {
    console.error("getFavoritePropertyIds error:", e);
    return [];
  }
}

export async function isFavorite(userId: string, propertyId: string): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ userId, propertyId });
  return Boolean(doc);
}

export async function addFavorite(userId: string, propertyId: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { userId, propertyId },
    { $set: { userId, propertyId, createdAt: new Date().toISOString() } },
    { upsert: true }
  );
}

export async function removeFavorite(userId: string, propertyId: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).deleteOne({ userId, propertyId });
}
