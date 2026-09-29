import { db } from "@/lib/db";
import { requireTeacher } from "@/lib/teacher";

export const runtime = "nodejs";

function slugify(value:string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,100) || `cours-${Date.now()}`;
}

export async function GET(request:Request) {
  const {user,response}=await requireTeacher(request); if(response) return response;
  try {
    const result=await db.query(`SELECT c.id,c.slug,c.title,c.description,c.level,c.category,c.access,c.lessons,c.duration,c.published,c.status,c.created_at,c.updated_at,
      COALESCE((SELECT COUNT(*) FROM course_modules m WHERE m.course_id=c.id),0)::int AS module_count,
      COALESCE((SELECT COUNT(*) FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE m.course_id=c.id),0)::int AS lesson_count,
      COALESCE((SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id),0)::int AS student_count
      FROM courses c WHERE c.teacher_id=$1 OR $2 IN ('admin','superadmin') ORDER BY c.updated_at DESC`,[user!.id,user!.role]);
    return Response.json({success:true,data:result.rows});
  } catch(error){ console.error("teacher-courses",error); return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de charger les cours."}},{status:500}); }
}

export async function POST(request:Request) {
  const {user,response}=await requireTeacher(request); if(response) return response;
  try {
    const body=await request.json();
    const title=String(body?.title||"").trim();
    if(title.length<3) return Response.json({success:false,error:{code:"INVALID_TITLE",message:"Le titre doit contenir au moins 3 caractères."}},{status:400});
    const base=slugify(body.slug||title); let slug=base; let n=2;
    while((await db.query(`SELECT 1 FROM courses WHERE slug=$1 LIMIT 1`,[slug])).rowCount) slug=`${base}-${n++}`;
    const result=await db.query(`INSERT INTO courses(teacher_id,slug,title,description,level,category,access,lessons,duration,published,status) VALUES($1,$2,$3,$4,$5,$6,$7,0,$8,false,'draft') RETURNING *`,[
      user!.id,slug,title,String(body.description||""),String(body.level||""),String(body.category||"Général"),body.access==='premium'?'premium':'free',body.duration?String(body.duration):null
    ]);
    return Response.json({success:true,data:result.rows[0]},{status:201});
  } catch(error){ console.error("teacher-course-create",error); return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de créer le cours."}},{status:500}); }
}
