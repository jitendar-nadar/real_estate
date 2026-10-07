import { NextRequest, NextResponse } from "next/server";
import * as agentsDb from "@/lib/db/agents";
import { requireApiAuth } from "@/lib/api-auth";
import { ADMIN_ROLES } from "@/lib/auth-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const agents = await agentsDb.getAllAgents(true);
    return NextResponse.json(agents);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load agents" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, { roles: ADMIN_ROLES });
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    const agent = await agentsDb.createAgent({
      name,
      email,
      phone: typeof body.phone === "string" ? body.phone : null,
      title: typeof body.title === "string" ? body.title : null,
      bio: typeof body.bio === "string" ? body.bio : null,
      photo: typeof body.photo === "string" ? body.photo : null,
      active: body.active !== false,
    });
    return NextResponse.json(agent, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
