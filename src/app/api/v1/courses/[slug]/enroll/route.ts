import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return Response.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Connexion requise." } }, { status: 401 });
  const { slug } = await params;
  try {
    const course = await db.query(`SELECT id, slug, access, published FROM courses WHERE slug=$1 AND published=true LIMIT 1`, [slug]);
    if (!course.rowCount) return Response.json({ success: false, error: { code: "COURSE_NOT_FOUND", message: "Cours introuvable." } }, { status: 404 });
    if (course.rows[0].access === "premium" && user.subscription === "free") {
      return Response.json({ success: false, error: { code: "PREMIUM_REQUIRED", message: "Ce parcours nécessite un abonnement premium." } }, { status: 402 });
    }
    await db.query(
      `INSERT INTO enrollments(user_id, course_id, progress)
       VALUES($1,$2,0)
       ON CONFLICT (user_id, course_id) DO UPDATE SET updated_at=NOW()`,
      [user.id, course.rows[0].id]
    );
    return Response.json({ success: true, data: { enrolled: true, courseId: course.rows[0].id } });
  } catch (error) {
    console.error("course-enroll", error);
    return Response.json({ success: false, error: { code: "INTERNAL_ERROR", message: "Impossible de rejoindre ce cours." } }, { status: 500 });
  }
}
