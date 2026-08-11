import type { Collection } from "mongodb";
import bcrypt from "bcryptjs";
import { Property } from "@/lib/types";
import { StoredUser } from "@/lib/auth-types";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

const PROPERTIES_COLLECTION = "properties";
const USERS_COLLECTION = "users";

export const SEED_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Spacious 3BHK in Koramangala",
    description:
      "Bright, well-ventilated 3BHK apartment with modern fittings. Gated community with 24/7 security, clubhouse, and parking. Walking distance to tech parks and metro.",
    price: 12500000,
    type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1650,
    address: "Block A, Green Valley Layout",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560034",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    featured: true,
    listingDate: "2024-03-01",
  },
  {
    id: "2",
    title: "Independent Villa with Garden",
    description:
      "4BHK villa in a premium locality with private garden and servant room. Modular kitchen, vitrified flooring. Near international school and hospitals.",
    price: 28500000,
    type: "house",
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    address: "Sector 57, Golf Course Road",
    city: "Gurgaon",
    state: "Haryana",
    zip: "122003",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    featured: true,
    listingDate: "2024-03-05",
  },
  {
    id: "3",
    title: "Sea-Facing Luxury Apartment",
    description:
      "3BHK with panoramic sea views. Premium amenities: gym, pool, party hall. Ready to move. In one of Mumbai's most sought-after towers.",
    price: 42000000,
    type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    address: "Tower 2, Ocean Heights",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400050",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    featured: true,
    listingDate: "2024-03-02",
  },
  {
    id: "4",
    title: "Affordable 2BHK for First-Time Buyers",
    description:
      "Compact 2BHK in a well-maintained society. New paint and fixtures. Close to market and bus stand. Bank loan available.",
    price: 3850000,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    address: "Saket Nagar, Phase 2",
    city: "Indore",
    state: "Madhya Pradesh",
    zip: "452001",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"],
    listingDate: "2024-03-08",
  },
  {
    id: "5",
    title: "Penthouse in Hitech City",
    description:
      "Stunning 4BHK penthouse with private terrace and city skyline views. High-end finishes, smart home features. Exclusive tower with concierge.",
    price: 52000000,
    type: "apartment",
    bedrooms: 4,
    bathrooms: 4,
    area: 3800,
    address: "Cyber Gateway, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    zip: "500081",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ],
    featured: true,
    listingDate: "2024-03-03",
  },
  {
    id: "6",
    title: "Heritage Bungalow in Jaipur",
    description:
      "Restored 3BHK heritage property with traditional architecture and modern comforts. Private courtyard, parking for two cars. In the heart of the old city.",
    price: 18500000,
    type: "house",
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    address: "C-Scheme, Near Central Park",
    city: "Jaipur",
    state: "Rajasthan",
    zip: "302001",
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"],
    listingDate: "2024-03-06",
  },
  {
    id: "7",
    title: "3BHK near Marina Beach",
    description:
      "Spacious apartment with partial sea view. Gated community, power backup, and rainwater harvesting. Walking distance to beach and shopping.",
    price: 9800000,
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    address: "ECR Road, Thiruvanmiyur",
    city: "Chennai",
    state: "Tamil Nadu",
    zip: "600041",
    images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"],
    listingDate: "2024-03-07",
  },
  {
    id: "8",
    title: "Residential Plot in Planned Sector",
    description:
      "Corner plot in approved colony. Clear title, ready for construction. Near NH and upcoming metro. Ideal for building your dream home.",
    price: 6500000,
    type: "land",
    bedrooms: 0,
    bathrooms: 0,
    area: 2000,
    address: "Sector 62, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    zip: "201301",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
    listingDate: "2024-03-04",
  },
];

const SEED_USERS_INPUT: { id: string; email: string; name: string; role: StoredUser["role"]; password: string }[] = [
  { id: "1", email: "superadmin@primenest.com", name: "Super Admin", role: "super_admin", password: "superadmin123" },
  { id: "2", email: "admin@primenest.com", name: "Admin", role: "admin", password: "admin123" },
  { id: "3", email: "user@primenest.com", name: "User", role: "user", password: "user123" },
  // Legacy demo emails (kept in sync for older deployments)
  { id: "1", email: "superadmin@estatehub.com", name: "Super Admin", role: "super_admin", password: "superadmin123" },
  { id: "2", email: "admin@estatehub.com", name: "Admin", role: "admin", password: "admin123" },
  { id: "3", email: "user@estatehub.com", name: "User", role: "user", password: "user123" },
];

export function isDemoSeedEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" || process.env.SEED_DEMO_DATA === "true"
  );
}

/** Upsert demo users so passwords/roles stay correct on live preview. */
async function syncDemoUsers(usersCol: Collection<StoredUser>): Promise<void> {
  for (const u of SEED_USERS_INPUT) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await usersCol.updateOne(
      { email: u.email.toLowerCase() },
      {
        $set: {
          id: u.id,
          email: u.email.toLowerCase(),
          name: u.name,
          role: u.role,
          passwordHash,
        },
      },
      { upsert: true }
    );
  }
}

export async function seedDbIfEmpty(): Promise<void> {
  if (!isMongoConfigured()) return;
  if (!isDemoSeedEnabled()) return;

  const db = await getDb();
  const propertiesCol = db.collection<Property>(PROPERTIES_COLLECTION);
  const usersCol = db.collection<StoredUser>(USERS_COLLECTION);

  const propertiesCount = await propertiesCol.countDocuments();

  if (propertiesCount === 0) {
    await propertiesCol.insertMany(
      SEED_PROPERTIES.map((p) => ({ ...p, createdBy: "2" }))
    );
  }

  // Always sync demo users when seeding is enabled (fixes live preview login)
  await syncDemoUsers(usersCol);
}

export async function countDemoUsers(): Promise<number> {
  if (!isMongoConfigured()) return 0;
  try {
    const db = await getDb();
    return db.collection(USERS_COLLECTION).countDocuments();
  } catch {
    return 0;
  }
}
