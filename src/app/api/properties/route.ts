import { NextRequest, NextResponse } from "next/server";
import { Property, PropertyType } from "@/lib/types";
import * as db from "@/lib/db/properties";
import { requireApiAuth } from "@/lib/api-auth";
import { ADMIN_ROLES } from "@/lib/auth-types";
import { DEFAULT_PROPERTY_IMAGE } from "@/lib/constants";

const PROPERTY_TYPES: PropertyType[] = ["house", "apartment", "condo", "land", "commercial"];

function validateBody(body: unknown): { ok: true; data: Omit<Property, "id" | "listingDate"> } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid body" };
  }
  const b = body as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const price = typeof b.price === "number" ? b.price : Number(b.price);
  const type = typeof b.type === "string" && PROPERTY_TYPES.includes(b.type as PropertyType) ? (b.type as PropertyType) : null;
  const bedrooms = typeof b.bedrooms === "number" ? b.bedrooms : Number(b.bedrooms) || 0;
  const bathrooms = typeof b.bathrooms === "number" ? b.bathrooms : Number(b.bathrooms) || 0;
  const area = typeof b.area === "number" ? b.area : Number(b.area) || 0;
  const address = typeof b.address === "string" ? b.address.trim() : "";
  const city = typeof b.city === "string" ? b.city.trim() : "";
  const state = typeof b.state === "string" ? b.state.trim() : "";
  const zip = typeof b.zip === "string" ? b.zip.trim() : "";
  const featured = Boolean(b.featured);
  let images: string[] = [];
  if (Array.isArray(b.images)) {
    images = b.images.filter((u): u is string => typeof u === "string").slice(0, 10);
  } else if (typeof b.images === "string") {
    images = b.images.split(/[\n,]/).map((s) => s.trim()).filter(Boolean).slice(0, 10);
  }

  if (!title) return { ok: false, error: "Title is required" };
  if (!(price > 0)) return { ok: false, error: "Valid price is required" };
  if (!type) return { ok: false, error: "Valid type is required" };
  if (!(area > 0)) return { ok: false, error: "Valid area (sq ft) is required" };
  if (!city) return { ok: false, error: "City is required" };
  if (!state) return { ok: false, error: "State is required" };
  if (!zip) return { ok: false, error: "Pincode is required" };

  return {
    ok: true,
    data: {
      title,
      description,
      price,
      type,
      bedrooms: Math.max(0, Math.floor(bedrooms)),
      bathrooms: Math.max(0, Math.floor(bathrooms)),
      area: Math.max(0, Math.floor(area)),
      address,
      city,
      state,
      zip,
      images: images.length ? images : [DEFAULT_PROPERTY_IMAGE],
      featured,
    },
  };
}

function applyFeaturedForRole(
  featured: boolean,
  role: string
): boolean {
  if (!featured) return false;
  return ADMIN_ROLES.includes(role as import("@/lib/auth-types").Role);
}

export async function GET() {
  try {
    const properties = await db.getAllProperties();
    return NextResponse.json(properties);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load properties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = validateBody(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const newProperty = await db.createProperty({
      ...result.data,
      featured: applyFeaturedForRole(result.data.featured ?? false, user.role),
      createdBy: user.id,
    });
    return NextResponse.json(newProperty, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save property" }, { status: 500 });
  }
}
