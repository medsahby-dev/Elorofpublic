import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ success:false,error:{code:"UNAUTHENTICATED",message:"Connexion requise."}},{status:401});
  try {
    const result = await db.query(
      `SELECT c.id,c.slug,c.title,c.description,c.level,c.category,c.access,c.duration,
              COALESCE(cp.progress,e.progress,0)::int AS progress,
              COALESCE(cp.completed_lessons,0)::int AS completed_lessons,
              COALESCE(cp.total_lessons,(SELECT COUNT(*) FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE m.course_id=c.id AND m.published=true AND l.published=true),0)::int AS total_lessons,
              cp.last_lesson_id
       FROM enrollments e
       JOIN courses c ON c.id=e.course_id
       LEFT JOIN course_progress cp ON cp.user_id=e.user_id AND cp.course_id=e.course_id
       WHERE e.user_id=$1 ORDER BY COALESCE(cp.last_seen_at,e.updated_at) DESC`, [user.id]
    );
    return Response.json({success:true,data:result.rows});
  } catch(error) {
    console.error("my-courses",error);
    return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de charger tes cours."}},{status:500});
  }
}
