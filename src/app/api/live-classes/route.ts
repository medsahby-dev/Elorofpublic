export const dynamic = "force-dynamic";

import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.query(`
      SELECT lc.id, lc.title, lc.description, lc.starts_at, lc.ends_at, lc.room_id, lc.provider, lc.status,
             c.title AS course_title,
             CONCAT(u.first_name, ' ', u.last_name) AS teacher_name
      FROM live_classes lc
      LEFT JOIN courses c ON c.id=lc.course_id
      LEFT JOIN users u ON u.id=lc.teacher_id
      WHERE lc.status IN ('scheduled','live') AND lc.starts_at >= NOW() - INTERVAL '2 hours'
      ORDER BY lc.starts_at ASC
    `);
    return Response.json({ success: true, classes: result.rows });
  } catch (error) {
    console.error("live-classes", error);
    return Response.json({ success: false, message: "Impossible de charger les classes en direct." }, { status: 500 });
  }
}
