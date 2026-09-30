export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    let result;
    if (user) {
      result = await db.query(
        `SELECT q.id, q.title, q.description, q.passing_score, q.max_attempts,
                c.slug AS course_slug, c.title AS course_title
         FROM quizzes q
         LEFT JOIN courses c ON c.id=q.course_id
         LEFT JOIN lessons l ON l.id=q.lesson_id
         LEFT JOIN course_modules m ON m.id=l.module_id
         WHERE q.published=true
           AND (
             (q.course_id IS NOT NULL AND EXISTS (SELECT 1 FROM enrollments e WHERE e.user_id=$1 AND e.course_id=q.course_id))
             OR (q.course_id IS NULL AND m.course_id IS NOT NULL AND EXISTS (SELECT 1 FROM enrollments e WHERE e.user_id=$1 AND e.course_id=m.course_id))
             OR COALESCE(l.is_preview,false)=true
           )
         ORDER BY q.created_at DESC, q.id DESC`, [user.id]
      );
    } else {
      result = await db.query(
        `SELECT q.id, q.title, q.description, q.passing_score, q.max_attempts,
                c.slug AS course_slug, c.title AS course_title
         FROM quizzes q
         LEFT JOIN courses c ON c.id=q.course_id
         LEFT JOIN lessons l ON l.id=q.lesson_id
         WHERE q.published=true AND COALESCE(l.is_preview,false)=true
         ORDER BY q.created_at DESC, q.id DESC`
      );
    }
    return Response.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("quizzes-list", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible de charger les quiz." } }, { status: 500 });
  }
}
