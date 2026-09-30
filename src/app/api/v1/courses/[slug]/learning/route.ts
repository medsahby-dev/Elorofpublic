import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const courseResult = await db.query(
      `SELECT id, slug, title, description, level, category, access, lessons, duration
       FROM courses WHERE slug=$1 AND published=true LIMIT 1`, [slug]
    );
    if (!courseResult.rowCount) return Response.json({ success:false, error:{code:"COURSE_NOT_FOUND",message:"Cours introuvable."}}, {status:404});
    const course = courseResult.rows[0];
    const user = await getCurrentUser(request);
    const modulesResult = await db.query(
      `SELECT m.id, m.title, m.description, m.position,
        COALESCE(json_agg(json_build_object(
          'id',l.id,'title',l.title,'slug',l.slug,'description',l.description,
          'content',l.content,'lessonType',l.lesson_type,'durationMinutes',l.duration_minutes,
          'position',l.position,'isPreview',l.is_preview,
          'progress',COALESCE(lp.progress,0),'progressStatus',COALESCE(lp.status,'not_started'),
          'completed',COALESCE(lp.status='completed',false),
          'resources',COALESCE((SELECT json_agg(json_build_object('id',r.id,'title',r.title,'resourceType',r.resource_type,'url',r.url,'position',r.position) ORDER BY r.position) FROM lesson_resources r WHERE r.lesson_id=l.id),'[]'::json),
          'quizzes',COALESCE((SELECT json_agg(json_build_object('id',q.id,'title',q.title,'description',q.description,'passingScore',q.passing_score,'maxAttempts',q.max_attempts) ORDER BY q.id) FROM quizzes q WHERE q.lesson_id=l.id AND q.published=true),'[]'::json)
        ) ORDER BY l.position) FILTER (WHERE l.id IS NOT NULL),'[]'::json) AS lessons
       FROM course_modules m
       LEFT JOIN lessons l ON l.module_id=m.id AND l.published=true
       WHERE m.course_id=$1 AND m.published=true
       GROUP BY m.id ORDER BY m.position`, [course.id]
    );
    let progress = null;
    let enrolled = false;
    if (user) {
      const p = await db.query(`SELECT EXISTS(SELECT 1 FROM enrollments WHERE user_id=$1 AND course_id=$2) AS enrolled, COALESCE((SELECT progress FROM course_progress WHERE user_id=$1 AND course_id=$2),(SELECT progress FROM enrollments WHERE user_id=$1 AND course_id=$2),0)::int AS progress`, [user.id, course.id]);
      enrolled = p.rows[0].enrolled;
      progress = p.rows[0].progress;
    }
    const modules = modulesResult.rows.map((module:any) => ({
      ...module,
      lessons: (module.lessons || []).map((lesson:any) => ({
        ...lesson,
        // Full lesson content is available to enrolled learners; public visitors only receive previews.
        content: enrolled || lesson.isPreview ? lesson.content : null,
        resources: enrolled || lesson.isPreview ? lesson.resources : [],
        quizzes: enrolled || lesson.isPreview ? lesson.quizzes : [],
      })),
    }));
    return Response.json({success:true,data:{course,modules,enrolled,progress,user:user?{id:user.id,subscription:user.subscription}:null}});
  } catch (error) {
    console.error("course-learning", error);
    return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de charger le parcours."}},{status:500});
  }
}
