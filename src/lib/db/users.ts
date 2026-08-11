import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { StoredUser, Role } from "@/lib/auth-types";
import { seedDbIfEmpty } from "./seed";

const COLLECTION = "users";

/** User without password (for API/list) */
export interface UserSafe {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  if (!isMongoConfigured()) return null;
  try {
    const db = await getDb();
    await seedDbIfEmpty();
    const normalized = email.trim().toLowerCase();
    const doc = await db.collection<StoredUser>(COLLECTION).findOne({
      email: { $regex: new RegExp(`^${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });
    return doc;
  } catch (err) {
    console.error("getUserByEmail error:", err);
    return null;
  }
}

export async function getAllUsers(): Promise<UserSafe[]> {
  if (!isMongoConfigured()) return [];
  const db = await getDb();
  await seedDbIfEmpty();
  const list = await db
    .collection<StoredUser>(COLLECTION)
    .find({})
    .project({ id: 1, email: 1, name: 1, role: 1 })
    .toArray();
  return list as UserSafe[];
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  if (!isMongoConfigured()) return null;
  const db = await getDb();
  await seedDbIfEmpty();
  const doc = await db.collection<StoredUser>(COLLECTION).findOne({ id });
  return doc;
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: Role;
}): Promise<UserSafe> {
  const db = await getDb();
  const existing = await getUserByEmail(data.email);
  if (existing) throw new Error("USER_EMAIL_EXISTS");
  const id = new ObjectId().toString();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user: StoredUser = {
    id,
    email: data.email.trim().toLowerCase(),
    name: data.name.trim(),
    passwordHash,
    role: data.role,
  };
  await db.collection<StoredUser>(COLLECTION).insertOne(user);
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; role?: Role; password?: string }
): Promise<UserSafe | null> {
  const db = await getDb();
  const doc = await db.collection<StoredUser>(COLLECTION).findOne({ id });
  if (!doc) return null;
  if (data.email !== undefined) {
    const newEmail = data.email.trim().toLowerCase();
    const existing = await getUserByEmail(newEmail);
    if (existing && existing.id !== id) throw new Error("USER_EMAIL_EXISTS");
  }
  const updates: Partial<StoredUser> = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.email !== undefined) updates.email = data.email.trim().toLowerCase();
  if (data.role !== undefined) updates.role = data.role;
  if (data.password !== undefined && data.password.length > 0) {
    updates.passwordHash = await bcrypt.hash(data.password, 10);
  }
  if (Object.keys(updates).length === 0) {
    return { id: doc.id, email: doc.email, name: doc.name, role: doc.role };
  }
  await db.collection<StoredUser>(COLLECTION).updateOne({ id }, { $set: updates });
  const updated = await getUserById(id);
  return updated ? { id: updated.id, email: updated.email, name: updated.name, role: updated.role } : null;
}

export async function deleteUser(id: string): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getDb();
  const result = await db.collection<StoredUser>(COLLECTION).deleteOne({ id });
  return (result.deletedCount ?? 0) > 0;
}
