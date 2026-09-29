import {db} from "@/lib/db";
import {requireTeacher} from "@/lib/teacher";
export const runtime="nodejs";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string;moduleId:string;lessonId:string}>}){
 const {user,response}=await requireTeacher(request); if(response)return response;
 const p=await params; const courseId=Number(p.id),moduleId=Number(p.moduleId),lessonId=Number(p.lessonId);
 try{
  const own=await db.query(`SELECT l.id FROM lessons l JOIN course_modules m ON m.id=l.module_id JOIN courses c ON c.id=m.course_id WHERE l.id=$1 AND m.id=$2 AND c.id=$3 AND (c.teacher_id=$4 OR $5 IN ('admin','superadmin'))`,[lessonId,moduleId,courseId,user!.id,user!.role]);
  if(!own.rowCount)return Response.json({success:false,error:{code:'FORBIDDEN',message:'Leçon inaccessible.'}},{status:403});
  const b=await request.json();
  const r=await db.query(`UPDATE lessons SET title=COALESCE($2,title),description=COALESCE($3,description),content=COALESCE($4,content),lesson_type=COALESCE($5,lesson_type),duration_minutes=$6,is_preview=COALESCE($7,is_preview),published=COALESCE($8,published),updated_at=NOW() WHERE id=$1 RETURNING *`,[lessonId,b.title!==undefined?String(b.title):null,b.description!==undefined?String(b.description):null,b.content!==undefined?String(b.content):null,['text','video','audio','pdf','interactive','quiz','assignment'].includes(String(b.lessonType))?String(b.lessonType):null,b.durationMinutes!==undefined?(b.durationMinutes?Number(b.durationMinutes):null):null,b.isPreview!==undefined?Boolean(b.isPreview):null,b.published!==undefined?Boolean(b.published):null]);
  return Response.json({success:true,data:r.rows[0]});
 }catch(e){console.error('lesson-patch',e);return Response.json({success:false,error:{code:'INTERNAL_ERROR',message:'Impossible de modifier la leçon.'}},{status:500});}
}
