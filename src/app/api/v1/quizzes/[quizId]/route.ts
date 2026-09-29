import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const id = Number(quizId);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ success: false, error: { code: "INVALID_QUIZ", message: "Quiz invalide." } }, { status: 400 });
  }

  try {
    const quiz = await db.query(
      `SELECT q.id, q.title, q.description, q.course_id, q.lesson_id, q.passing_score, q.max_attempts,
              c.slug AS course_slug, c.title AS course_title
       FROM quizzes q
       LEFT JOIN courses c ON c.id=q.course_id
       WHERE q.id=$1 AND q.published=true LIMIT 1`,
      [id]
    );
    if (!quiz.rowCount) return Response.json({ success: false, error: { code: "QUIZ_NOT_FOUND", message: "Quiz introuvable." } }, { status: 404 });

    const q = quiz.rows[0];
    const lessonCourse = q.course_id ? null : await db.query(
      `SELECT m.course_id, c.slug AS course_slug, c.title AS course_title
       FROM lessons l JOIN course_modules m ON m.id=l.module_id JOIN courses c ON c.id=m.course_id
       WHERE l.id=$1 LIMIT 1`, [q.lesson_id]
    );
    const course = q.course_id ? { id: q.course_id, slug: q.course_slug, title: q.course_title } : lessonCourse?.rows[0] ? {
      id: lessonCourse.rows[0].course_id,
      slug: lessonCourse.rows[0].course_slug,
      title: lessonCourse.rows[0].course_title,
    } : null;

    const questions = await db.query(
      `SELECT qq.id, qq.question, qq.question_type, qq.explanation, qq.points, qq.position,
              COALESCE(json_agg(json_build_object('id',qa.id,'answer',qa.answer,'position',qa.position) ORDER BY qa.position) FILTER (WHERE qa.id IS NOT NULL), '[]'::json) AS choices
       FROM quiz_questions qq
       LEFT JOIN quiz_answers qa ON qa.question_id=qq.id
       WHERE qq.quiz_id=$1
       GROUP BY qq.id
       ORDER BY qq.position`, [id]
    );

    let enrolled = false;
    let attemptsUsed = 0;
    const user = await getCurrentUser(request);
    if (user && course) {
      const enrollment = await db.query(`SELECT 1 FROM enrollments WHERE user_id=$1 AND course_id=$2 LIMIT 1`, [user.id, course.id]);
      enrolled = Boolean(enrollment.rowCount);
      const attempts = await db.query(`SELECT COUNT(*)::int AS count FROM quiz_attempts WHERE user_id=$1 AND (quiz_id=$2 OR (quiz_id IS NULL AND quiz_slug=$2::text))`, [user.id, id]);
      attemptsUsed = Number(attempts.rows[0]?.count || 0);
    }

    return Response.json({
      success: true,
      data: {
        quiz: { id: q.id, title: q.title, description: q.description, passingScore: Number(q.passing_score), maxAttempts: q.max_attempts, enrolled, attemptsUsed, course },
        questions: questions.rows.map((row: any) => ({ ...row, points: Number(row.points) })),
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("quiz-get", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible de charger le quiz." } }, { status: 500 });
  }
}
