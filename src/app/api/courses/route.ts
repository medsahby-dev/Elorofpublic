export const dynamic = "force-dynamic";

import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.query(`SELECT id, slug, title, description, level, category, access, lessons, duration FROM courses WHERE published=true ORDER BY id`);
    return Response.json({ success: true, courses: result.rows });
  } catch (error) {
    console.error("courses", error);
    return Response.json({ success: false, message: "Impossible de charger les cours." }, { status: 500 });
  }
}
