import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user, response } = await requireAdmin(request);
  if (response) return response;
  try {
    const [stats, growth, courses, activity] = await Promise.all([
      db.query(`SELECT
        (SELECT COUNT(*)::int FROM users) AS users,
        (SELECT COUNT(*)::int FROM users WHERE role='student') AS students,
        (SELECT COUNT(*)::int FROM users WHERE role='teacher') AS teachers,
        (SELECT COUNT(*)::int FROM users WHERE created_at >= NOW()-INTERVAL '30 days') AS new_users_30d,
        (SELECT COUNT(*)::int FROM courses) AS courses,
        (SELECT COUNT(*)::int FROM courses WHERE published=true) AS published_courses,
        (SELECT COUNT(*)::int FROM enrollments) AS enrollments,
        (SELECT COALESCE(ROUND(AVG(progress))::int,0) FROM enrollments) AS avg_progress,
        (SELECT COUNT(*)::int FROM quiz_attempts) AS quiz_attempts,
        (SELECT COALESCE(ROUND(AVG(percentage))::int,0) FROM quiz_attempts WHERE percentage IS NOT NULL) AS avg_quiz_score,
        (SELECT COALESCE(SUM(xp_gained),0)::int FROM quiz_attempts) AS xp_awarded,
        (SELECT COUNT(*)::int FROM certificates) AS certificates`),
      db.query(`SELECT DATE_TRUNC('day', created_at)::date AS day, COUNT(*)::int AS count FROM users WHERE created_at >= CURRENT_DATE-INTERVAL '13 days' GROUP BY 1 ORDER BY 1`),
      db.query(`SELECT c.id,c.title,c.slug,c.status,c.published,c.lessons,c.updated_at,
        COALESCE(u.first_name||' '||u.last_name,'—') AS teacher_name,
        COALESCE((SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id),0)::int AS students,
        COALESCE((SELECT ROUND(AVG(cp.progress))::int FROM course_progress cp WHERE cp.course_id=c.id),0)::int AS avg_progress
        FROM courses c LEFT JOIN users u ON u.id=c.teacher_id ORDER BY c.updated_at DESC LIMIT 12`),
      db.query(`SELECT a.id,a.action,a.entity_type,a.entity_id,a.created_at,
        COALESCE(u.first_name||' '||u.last_name,u.email,'Système') AS actor
        FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_user_id ORDER BY a.created_at DESC LIMIT 12`)
    ]);
    return Response.json({success:true,data:{stats:stats.rows[0],growth:growth.rows,courses:courses.rows,activity:activity.rows,user:{id:user!.id}}},{headers:{"Cache-Control":"no-store"}});
  } catch (error) {
    console.error("admin-overview", error);
    return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de charger les statistiques d'administration."}},{status:500});
  }
}
