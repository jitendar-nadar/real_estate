import { ObjectId } from "mongodb";
import { Inquiry, InquiryStatus } from "@/lib/types";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "inquiries";

function toInquiry(doc: Inquiry & { _id?: ObjectId }): Inquiry {
  const { _id, ...rest } = doc;
  return rest as Inquiry;
}

function newId(): string {
  return String(Date.now()) + Math.random().toString(36).slice(2, 9);
}

export async function createInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
}): Promise<Inquiry> {
  if (!isMongoConfigured()) {
    throw new Error("Missing MONGODB_URI environment variable");
  }
  const db = await getDb();
  const inquiry: Inquiry = {
    id: newId(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    propertyId: data.propertyId ?? null,
    propertyTitle: data.propertyTitle ?? null,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await db.collection<Inquiry>(COLLECTION).insertOne(inquiry);
  return inquiry;
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  if (!isMongoConfigured()) return [];
  try {
    const db = await getDb();
    const list = await db
      .collection<Inquiry>(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return list.map(toInquiry);
  } catch (error) {
    console.error("getAllInquiries error:", error);
    return [];
  }
}

export async function getInquiryCounts(): Promise<{
  total: number;
  new: number;
}> {
  if (!isMongoConfigured()) return { total: 0, new: 0 };
  try {
    const db = await getDb();
    const col = db.collection<Inquiry>(COLLECTION);
    const [total, newCount] = await Promise.all([
      col.countDocuments(),
      col.countDocuments({ status: "new" }),
    ]);
    return { total, new: newCount };
  } catch (error) {
    console.error("getInquiryCounts error:", error);
    return { total: 0, new: 0 };
  }
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<Inquiry | null> {
  if (!isMongoConfigured()) return null;
  const db = await getDb();
  const result = await db.collection<Inquiry>(COLLECTION).findOneAndUpdate(
    { id },
    { $set: { status } },
    { returnDocument: "after" }
  );
  return result ? toInquiry(result) : null;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getDb();
  const result = await db.collection<Inquiry>(COLLECTION).deleteOne({ id });
  return result.deletedCount === 1;
}
