import { ObjectId } from "mongodb";
import { Agent } from "@/lib/types";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "agents";

function toAgent(doc: Agent & { _id?: ObjectId }): Agent {
  const { _id, ...rest } = doc;
  return rest as Agent;
}

export async function getAllAgents(activeOnly = false): Promise<Agent[]> {
  if (!isMongoConfigured()) return [];
  try {
    const db = await getDb();
    const filter = activeOnly ? { $or: [{ active: true }, { active: { $exists: false } }] } : {};
    const list = await db.collection<Agent>(COLLECTION).find(filter).sort({ name: 1 }).toArray();
    return list.map(toAgent);
  } catch (e) {
    console.error("getAllAgents error:", e);
    return [];
  }
}

export async function getAgentById(id: string): Promise<Agent | null> {
  if (!isMongoConfigured()) return null;
  try {
    const db = await getDb();
    const doc = await db.collection<Agent>(COLLECTION).findOne({ id });
    return doc ? toAgent(doc) : null;
  } catch (e) {
    console.error("getAgentById error:", e);
    return null;
  }
}

export async function createAgent(
  data: Omit<Agent, "id"> & { id?: string }
): Promise<Agent> {
  const db = await getDb();
  const agent: Agent = {
    id: data.id ?? new ObjectId().toString(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    title: data.title?.trim() || null,
    bio: data.bio?.trim() || null,
    photo: data.photo?.trim() || null,
    active: data.active !== false,
  };
  await db.collection<Agent>(COLLECTION).insertOne(agent);
  return agent;
}

export async function updateAgent(id: string, data: Partial<Omit<Agent, "id">>): Promise<Agent | null> {
  const db = await getDb();
  const updates: Partial<Agent> = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.email !== undefined) updates.email = data.email.trim().toLowerCase();
  if (data.phone !== undefined) updates.phone = data.phone?.trim() || null;
  if (data.title !== undefined) updates.title = data.title?.trim() || null;
  if (data.bio !== undefined) updates.bio = data.bio?.trim() || null;
  if (data.photo !== undefined) updates.photo = data.photo?.trim() || null;
  if (data.active !== undefined) updates.active = data.active;

  const result = await db.collection<Agent>(COLLECTION).findOneAndUpdate(
    { id },
    { $set: updates },
    { returnDocument: "after" }
  );
  return result ? toAgent(result as Agent & { _id?: ObjectId }) : null;
}

export async function deleteAgent(id: string): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  const db = await getDb();
  const result = await db.collection<Agent>(COLLECTION).deleteOne({ id });
  await db.collection("properties").updateMany({ agentId: id }, { $set: { agentId: null } });
  return (result.deletedCount ?? 0) > 0;
}
