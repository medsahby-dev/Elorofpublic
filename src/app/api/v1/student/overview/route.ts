import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Connexion requise." } }, { status: 401 });

  try {
    const stats = await db.query(`
      SELECT
        (SELECT COUNT(*)::int FROM enrollments WHERE user_id=$1) AS enrolled_courses,
        (SELECT COUNT(*)::int FROM course_progress WHERE user_id=$1 AND progress=100) AS completed_courses,
        (SELECT COUNT(*)::int FROM lesson_progress WHERE user_id=$1 AND status='completed') AS completed_lessons,
        (SELECT COUNT(*)::int FROM lesson_progress WHERE user_id=$1) AS touched_lessons,
        (SELECT COUNT(*)::int FROM quiz_attempts WHERE user_id=$1) AS quiz_attempts,
        (SELECT COALESCE(ROUND(AVG(percentage))::int,0) FROM quiz_attempts WHERE user_id=$1 AND percentage IS NOT NULL) AS average_quiz_score,
        (SELECT COALESCE(SUM(xp_gained),0)::int FROM quiz_attempts WHERE user_id=$1) AS quiz_xp
    `, [user.id]);

    const continueResult = await db.query(`
      SELECT c.id, c.slug, c.title, c.category,
             COALESCE(cp.progress,e.progress,0)::int AS progress,
             COALESCE(cp.completed_lessons,0)::int AS completed_lessons,
             COALESCE(cp.total_lessons,0)::int AS total_lessons,
             cp.last_seen_at,
             l.id AS last_lesson_id,
             l.title AS last_lesson_title
      FROM enrollments e
      JOIN courses c ON c.id=e.course_id
      LEFT JOIN course_progress cp ON cp.user_id=e.user_id AND cp.course_id=e.course_id
      LEFT JOIN lessons l ON l.id=cp.last_lesson_id
      WHERE e.user_id=$1
      ORDER BY COALESCE(cp.last_seen_at,e.updated_at) DESC
      LIMIT 1
    `, [user.id]);

    const recentLessons = await db.query(`
      SELECT l.id, l.title, c.title AS course_title, c.slug AS course_slug,
             lp.status, lp.progress, lp.last_seen_at
      FROM lesson_progress lp
      JOIN lessons l ON l.id=lp.lesson_id
      JOIN course_modules m ON m.id=l.module_id
      JOIN courses c ON c.id=m.course_id
      WHERE lp.user_id=$1
      ORDER BY lp.last_seen_at DESC
      LIMIT 5
    `, [user.id]);

    const recentQuizzes = await db.query(`
      SELECT qa.id, qa.score, qa.total, qa.percentage, qa.passed, qa.xp_gained,
             qa.completed_at, q.title AS quiz_title, c.title AS course_title
      FROM quiz_attempts qa
      LEFT JOIN quizzes q ON q.id=qa.quiz_id
      LEFT JOIN courses c ON c.id=q.course_id
      WHERE qa.user_id=$1
      ORDER BY COALESCE(qa.completed_at,qa.created_at) DESC
      LIMIT 5
    `, [user.id]);

    const certificates = await db.query(`
      SELECT cert.id, cert.certificate_code, cert.issued_at, c.title AS course_title, c.slug AS course_slug
      FROM certificates cert
      JOIN courses c ON c.id=cert.course_id
      WHERE cert.user_id=$1
      ORDER BY cert.issued_at DESC
      LIMIT 10
    `, [user.id]);

    const s = stats.rows[0];
    const xp = Number(user.xp || 0);
    const badges = [
      { id: "first-lesson", icon: "🚀", title: "Premier pas", description: "Terminer ta première leçon", unlocked: Number(s.completed_lessons) >= 1 },
      { id: "five-lessons", icon: "📚", title: "Régularité", description: "Terminer 5 leçons", unlocked: Number(s.completed_lessons) >= 5 },
      { id: "xp-100", icon: "⭐", title: "100 XP", description: "Atteindre 100 XP", unlocked: xp >= 100 },
      { id: "quiz-five", icon: "🧠", title: "Esprit d'entraînement", description: "Réaliser 5 quiz", unlocked: Number(s.quiz_attempts) >= 5 },
      { id: "course-complete", icon: "🏆", title: "Parcours terminé", description: "Terminer un cours à 100 %", unlocked: Number(s.completed_courses) >= 1 }
    ];

    return Response.json({
      success: true,
      data: {
        user: {
          firstName: user.first_name,
          lastName: user.last_name,
          level: user.level,
          objective: user.objective,
          subscription: user.subscription,
          xp
        },
        stats: {
          enrolledCourses: Number(s.enrolled_courses),
          completedCourses: Number(s.completed_courses),
          completedLessons: Number(s.completed_lessons),
          quizAttempts: Number(s.quiz_attempts),
          averageQuizScore: Number(s.average_quiz_score),
          quizXp: Number(s.quiz_xp)
        },
        continueCourse: continueResult.rows[0] ?? null,
        recentLessons: recentLessons.rows,
        recentQuizzes: recentQuizzes.rows,
        certificates: certificates.rows,
        badges
      }
    });
  } catch (error) {
    console.error("student-overview", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible de charger ton espace élève." } }, { status: 500 });
  }
}
