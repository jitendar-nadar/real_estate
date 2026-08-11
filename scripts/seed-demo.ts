/**
 * One-time demo bootstrap for local dev or live preview.
 * Usage: npm run seed:demo
 * Requires MONGODB_URI in .env.local (loaded automatically).
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
process.env.SEED_DEMO_DATA = "true";

async function main() {
  const { seedDbIfEmpty } = await import("../src/lib/db/seed");
  const { closeDb, isMongoConfigured } = await import("../src/lib/mongodb");

  if (!isMongoConfigured()) {
    console.error("Missing MONGODB_URI. Set it in .env.local first.");
    process.exit(1);
  }

  await seedDbIfEmpty();
  await closeDb();

  console.log("Demo seed complete.");
  console.log("  Super Admin: superadmin@primenest.com / superadmin123");
  console.log("  Admin:       admin@primenest.com / admin123");
  console.log("  User:        user@primenest.com / user123");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
