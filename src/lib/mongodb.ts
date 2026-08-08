import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB_NAME || "realestate";

declare global {
  // Reuse one client across hot reloads (dev) and serverless invocations (prod).
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/** Returns true if MongoDB is configured and available. */
export function isMongoConfigured(): boolean {
  return Boolean(uri);
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("Missing MONGODB_URI environment variable"));
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

/** Lightweight connectivity check for health/diagnostics endpoints. */
export async function pingMongo(): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return true;
  } catch (error) {
    console.error("MongoDB ping failed:", error);
    return false;
  }
}

export async function closeDb(): Promise<void> {
  if (global._mongoClientPromise) {
    const client = await global._mongoClientPromise;
    await client.close();
    global._mongoClientPromise = undefined;
  }
}
