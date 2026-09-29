import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Connexion requise." } }, { status: 401 });
  const { lessonId } = await params;
  const numericLessonId = Number(lessonId);
  if (!Number.isInteger(numericLessonId) || numericLessonId <= 0) return Response.json({ success: false, error: { code: "INVALID_LESSON", message: "Leçon invalide." } }, { status: 400 });

  try {
    const body = await request.json().catch(() => ({}));
    const requestedProgress = Number(body.progress ?? 100);
    const progress = Math.max(0, Math.min(100, Number.isFinite(requestedProgress) ? requestedProgress : 100));
    const status = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";

    const lesson = await db.query(
      `SELECT l.id, m.course_id FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE l.id=$1 AND l.published=true LIMIT 1`,
      [numericLessonId]
    );
    if (!lesson.rowCount) return Response.json({ success: false, error: { code: "LESSON_NOT_FOUND", message: "Leçon introuvable." } }, { status: 404 });

    const courseId = lesson.rows[0].course_id;
    const enrolled = await db.query(`SELECT 1 FROM enrollments WHERE user_id=$1 AND course_id=$2`, [user.id, courseId]);
    if (!enrolled.rowCount) return Response.json({ success: false, error: { code: "NOT_ENROLLED", message: "Inscription au cours requise." } }, { status: 403 });

    await db.query(
      `INSERT INTO lesson_progress(user_id, lesson_id, status, progress, started_at, completed_at, last_seen_at)
       VALUES($1,$2,$3,$4,CASE WHEN $4 > 0 THEN NOW() ELSE NULL END,CASE WHEN $3='completed' THEN NOW() ELSE NULL END,NOW())
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET
         status=EXCLUDED.status,
         progress=GREATEST(lesson_progress.progress, EXCLUDED.progress),
         started_at=COALESCE(lesson_progress.started_at, EXCLUDED.started_at),
         completed_at=CASE WHEN EXCLUDED.status='completed' THEN COALESCE(lesson_progress.completed_at, NOW()) ELSE lesson_progress.completed_at END,
         last_seen_at=NOW()`,
      [user.id, numericLessonId, status, progress]
    );

    const totals = await db.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE lp.status='completed')::int AS completed
       FROM lessons l
       JOIN course_modules m ON m.id=l.module_id
       LEFT JOIN lesson_progress lp ON lp.lesson_id=l.id AND lp.user_id=$1
       WHERE m.course_id=$2 AND m.published=true AND l.published=true`,
      [user.id, courseId]
    );
    const total = totals.rows[0].total;
    const completed = totals.rows[0].completed;
    const courseProgress = total ? Math.round((completed / total) * 100) : 0;

    await db.query(
      `INSERT INTO course_progress(user_id, course_id, progress, completed_lessons, total_lessons, last_lesson_id, completed_at, last_seen_at)
       VALUES($1,$2,$3,$4,$5,$6,CASE WHEN $3=100 THEN NOW() ELSE NULL END,NOW())
       ON CONFLICT(user_id, course_id) DO UPDATE SET
         progress=EXCLUDED.progress,
         completed_lessons=EXCLUDED.completed_lessons,
         total_lessons=EXCLUDED.total_lessons,
         last_lesson_id=EXCLUDED.last_lesson_id,
         completed_at=CASE WHEN EXCLUDED.progress=100 THEN COALESCE(course_progress.completed_at,NOW()) ELSE course_progress.completed_at END,
         last_seen_at=NOW()`,
      [user.id, courseId, courseProgress, completed, total, numericLessonId]
    );
    await db.query(`UPDATE enrollments SET progress=$1, updated_at=NOW() WHERE user_id=$2 AND course_id=$3`, [courseProgress, user.id, courseId]);

    let certificate = null;
    if (courseProgress === 100) {
      const existing = await db.query(`SELECT id, certificate_code, issued_at FROM certificates WHERE user_id=$1 AND course_id=$2 LIMIT 1`, [user.id, courseId]);
      if (existing.rowCount) {
        certificate = existing.rows[0];
      } else {
        const code = `ELP-${new Date().getFullYear()}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
        const created = await db.query(
          `INSERT INTO certificates(user_id, course_id, certificate_code) VALUES($1,$2,$3) ON CONFLICT(user_id,course_id) DO UPDATE SET certificate_code=certificates.certificate_code RETURNING id, certificate_code, issued_at`,
          [user.id, courseId, code]
        );
        certificate = created.rows[0];
      }
    }

    return Response.json({ success: true, data: { lessonId: numericLessonId, progress, status, courseProgress, certificate } });
  } catch (error) {
    console.error("lesson-progress", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible d'enregistrer la progression." } }, { status: 500 });
  }
}
