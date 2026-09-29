import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Connexion requise." } }, { status: 401 });
  const { slug } = await params;
  try {
    const result = await db.query(
      `SELECT c.id AS course_id, c.slug, COALESCE(cp.progress,e.progress,0)::int AS progress,
              COALESCE(cp.completed_lessons,0)::int AS completed_lessons,
              COALESCE(cp.total_lessons,(SELECT COUNT(*) FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE m.course_id=c.id AND m.published=true AND l.published=true),0)::int AS total_lessons,
              cp.last_lesson_id
       FROM courses c
       LEFT JOIN enrollments e ON e.course_id=c.id AND e.user_id=$1
       LEFT JOIN course_progress cp ON cp.course_id=c.id AND cp.user_id=$1
       WHERE c.slug=$2 AND c.published=true LIMIT 1`,
      [user.id, slug]
    );
    if (!result.rowCount) return Response.json({ success: false, error: { code: "COURSE_NOT_FOUND", message: "Cours introuvable." } }, { status: 404 });
    return Response.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("course-progress", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible de charger la progression." } }, { status: 500 });
  }
}
