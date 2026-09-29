import { db } from "@/lib/db";
import { requireTeacher } from "@/lib/teacher";
export const runtime="nodejs";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string;moduleId:string}>}){
 const {user,response}=await requireTeacher(request);
 if(response)return response;
 const p=await params; const courseId=Number(p.id), moduleId=Number(p.moduleId);
 try{
  const own=await db.query(`SELECT c.id FROM courses c JOIN course_modules m ON m.course_id=c.id WHERE c.id=$1 AND m.id=$2 AND (c.teacher_id=$3 OR $4 IN ('admin','superadmin'))`,[courseId,moduleId,user!.id,user!.role]);
  if(!own.rowCount)return Response.json({success:false,error:{code:'FORBIDDEN',message:'Module inaccessible.'}},{status:403});
  const b=await request.json();
  const r=await db.query(`UPDATE course_modules SET title=COALESCE($3,title),description=COALESCE($4,description),published=COALESCE($5,published),updated_at=NOW() WHERE id=$1 AND course_id=$2 RETURNING *`,[moduleId,courseId,b.title!==undefined?String(b.title):null,b.description!==undefined?String(b.description):null,b.published!==undefined?Boolean(b.published):null]);
  return Response.json({success:true,data:r.rows[0]});
 }catch(e){console.error('module-patch',e);return Response.json({success:false,error:{code:'INTERNAL_ERROR',message:'Impossible de modifier le module.'}},{status:500});}
}
