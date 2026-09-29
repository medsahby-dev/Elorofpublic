import { db } from "@/lib/db";
import { requireTeacher } from "@/lib/teacher";
export const runtime="nodejs";
async function access(id:number,user:any){
  const r=await db.query(`SELECT * FROM courses WHERE id=$1 LIMIT 1`,[id]); if(!r.rowCount) return null;
  if(r.rows[0].teacher_id!==user.id && !["admin","superadmin"].includes(String(user.role))) return false;
  return r.rows[0];
}
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {user,response}=await requireTeacher(request); if(response)return response; const id=Number((await params).id); if(!Number.isInteger(id))return Response.json({success:false,error:{code:"INVALID_ID",message:"Cours invalide."}},{status:400});
 try{const course=await access(id,user);if(course===null)return Response.json({success:false,error:{code:"NOT_FOUND",message:"Cours introuvable."}},{status:404});if(course===false)return Response.json({success:false,error:{code:"FORBIDDEN",message:"Accès interdit."}},{status:403});
 const modules=await db.query(`SELECT m.id,m.title,m.description,m.position,m.published,COALESCE(json_agg(json_build_object('id',l.id,'title',l.title,'slug',l.slug,'description',l.description,'content',l.content,'lessonType',l.lesson_type,'durationMinutes',l.duration_minutes,'position',l.position,'isPreview',l.is_preview,'published',l.published) ORDER BY l.position) FILTER(WHERE l.id IS NOT NULL),'[]'::json) lessons FROM course_modules m LEFT JOIN lessons l ON l.module_id=m.id WHERE m.course_id=$1 GROUP BY m.id ORDER BY m.position`,[id]);
 return Response.json({success:true,data:{course,modules:modules.rows}});
 }catch(error){console.error("teacher-course-get",error);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de charger le cours."}},{status:500});}}
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 const {user,response}=await requireTeacher(request);if(response)return response;const id=Number((await params).id);if(!Number.isInteger(id))return Response.json({success:false,error:{code:"INVALID_ID",message:"Cours invalide."}},{status:400});
 try{const course=await access(id,user);if(course===null)return Response.json({success:false,error:{code:"NOT_FOUND",message:"Cours introuvable."}},{status:404});if(course===false)return Response.json({success:false,error:{code:"FORBIDDEN",message:"Accès interdit."}},{status:403});const body=await request.json();
 const status=body.status?String(body.status):course.status; if(!['draft','in_review','published','archived'].includes(status))return Response.json({success:false,error:{code:"INVALID_STATUS",message:"Statut invalide."}},{status:400});
 if(status==='published'){const count=await db.query(`SELECT COUNT(*)::int count FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE m.course_id=$1 AND m.published=true AND l.published=true`,[id]);if(Number(count.rows[0].count)<1)return Response.json({success:false,error:{code:"COURSE_EMPTY",message:"Publiez au moins un module et une leçon avant de publier le cours."}},{status:422});}
 await db.query(`UPDATE courses SET lessons=(SELECT COUNT(*) FROM lessons l JOIN course_modules m ON m.id=l.module_id WHERE m.course_id=$1 AND l.published=true) WHERE id=$1`,[id]);
 const result=await db.query(`UPDATE courses SET title=COALESCE($2,title),description=COALESCE($3,description),level=COALESCE($4,level),category=COALESCE($5,category),access=COALESCE($6,access),duration=$7,status=$8,published=$8='published',updated_at=NOW() WHERE id=$1 RETURNING *`,[id,body.title!==undefined?String(body.title):null,body.description!==undefined?String(body.description):null,body.level!==undefined?String(body.level):null,body.category!==undefined?String(body.category):null,body.access==='premium'?'premium':body.access==='free'?'free':null,body.duration!==undefined?(body.duration?String(body.duration):null):course.duration,status]);
 return Response.json({success:true,data:result.rows[0]});
 }catch(error){console.error("teacher-course-patch",error);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de modifier le cours."}},{status:500});}}
