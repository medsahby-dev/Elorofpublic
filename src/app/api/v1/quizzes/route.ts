export const dynamic = "force-dynamic";

import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await db.query(
      `SELECT q.id, q.title, q.description, q.passing_score, q.max_attempts,
              c.slug AS course_slug, c.title AS course_title
       FROM quizzes q
       LEFT JOIN courses c ON c.id=q.course_id
       WHERE q.published=true
       ORDER BY q.created_at DESC, q.id DESC`
    );
    return Response.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("quizzes-list", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible de charger les quiz." } }, { status: 500 });
  }
}
