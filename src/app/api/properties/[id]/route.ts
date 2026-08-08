import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db/properties";
import { requireApiAuth } from "@/lib/api-auth";
import { PropertyType } from "@/lib/types";
import { ADMIN_ROLES } from "@/lib/auth-types";

const PROPERTY_TYPES: PropertyType[] = ["house", "apartment", "condo", "land", "commercial"];

function validatePatchBody(
  body: unknown
): { ok: true; data: Partial<Omit<import("@/lib/types").Property, "id" | "listingDate">> } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  if (b.title !== undefined) {
    const v = typeof b.title === "string" ? b.title.trim() : "";
    if (!v) return { ok: false, error: "Title cannot be empty" };
    data.title = v;
  }
  if (b.description !== undefined) data.description = typeof b.description === "string" ? b.description.trim() : "";
  if (b.price !== undefined) {
    const v = typeof b.price === "number" ? b.price : Number(b.price);
    if (!(v > 0)) return { ok: false, error: "Price must be positive" };
    data.price = v;
  }
  if (b.type !== undefined) {
    if (typeof b.type !== "string" || !PROPERTY_TYPES.includes(b.type as PropertyType)) {
      return { ok: false, error: "Invalid type" };
    }
    data.type = b.type;
  }
  if (b.bedrooms !== undefined) data.bedrooms = Math.max(0, Math.floor(Number(b.bedrooms) || 0));
  if (b.bathrooms !== undefined) data.bathrooms = Math.max(0, Math.floor(Number(b.bathrooms) || 0));
  if (b.area !== undefined) {
    const v = Math.max(0, Math.floor(Number(b.area) || 0));
    if (v === 0) return { ok: false, error: "Area must be positive" };
    data.area = v;
  }
  if (b.address !== undefined) data.address = typeof b.address === "string" ? b.address.trim() : "";
  if (b.city !== undefined) {
    const v = typeof b.city === "string" ? b.city.trim() : "";
    if (!v) return { ok: false, error: "City cannot be empty" };
    data.city = v;
  }
  if (b.state !== undefined) {
    const v = typeof b.state === "string" ? b.state.trim() : "";
    if (!v) return { ok: false, error: "State cannot be empty" };
    data.state = v;
  }
  if (b.zip !== undefined) {
    const v = typeof b.zip === "string" ? b.zip.trim() : "";
    if (!v) return { ok: false, error: "Pincode cannot be empty" };
    data.zip = v;
  }
  if (b.featured !== undefined) data.featured = Boolean(b.featured);
  if (b.images !== undefined) {
    if (Array.isArray(b.images)) {
      data.images = b.images.filter((u): u is string => typeof u === "string").slice(0, 10);
    } else if (typeof b.images === "string") {
      data.images = b.images.split(/[\n,]/).map((s) => (s as string).trim()).filter(Boolean).slice(0, 10);
    }
  }
  if (Object.keys(data).length === 0 && !b.restore) return { ok: false, error: "No valid fields to update" };
  return { ok: true, data: data as Partial<Omit<import("@/lib/types").Property, "id" | "listingDate">> };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await db.getPropertyById(id);
    if (!property) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load property" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const isAdmin = ADMIN_ROLES.includes(user.role);
    const canEdit = isAdmin || (await db.isPropertyOwnedBy(id, user.id));
    if (!canEdit) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json().catch(() => ({}));
    if (body?.restore === true) {
      const property = await db.restoreProperty(id);
      if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(property);
    }
    const result = validatePatchBody(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    if (result.data.featured !== undefined && !isAdmin) {
      delete result.data.featured;
    }
    const property = await db.getPropertyByIdForAdmin(id);
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await db.updateProperty(id, result.data);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = "user" in auth ? auth.user : null;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const isAdmin = ADMIN_ROLES.includes(user.role);
    const canDelete = isAdmin || (await db.isPropertyOwnedBy(id, user.id));
    if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const property = await db.softDeleteProperty(id);
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(property);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
