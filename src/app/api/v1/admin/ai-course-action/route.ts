import {requireAdmin,audit} from "@/lib/admin";
import {db} from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 const {user,response}=await requireAdmin(request); if(response)return response;
 try{
  const body=await request.json(); const id=Number(body.id); const action=String(body.action||"");
  const current=await db.query("SELECT id,status FROM ai_course_drafts WHERE id=$1",[id]);
  if(!current.rows[0])return Response.json({success:false,error:{code:"NOT_FOUND",message:"Brouillon introuvable."}},{status:404});
  if(current.rows[0].status==="published")return Response.json({success:false,error:{code:"ALREADY_PUBLISHED",message:"Ce cours est déjà publié."}},{status:409});
  if(action==="validate"){
   await db.query("UPDATE ai_course_drafts SET status='validated',validated_by=$2,validated_at=NOW(),updated_at=NOW() WHERE id=$1",[id,user!.id]);
   await audit(user!.id,"ai_course_validated","ai_course",id,{});
  }else if(action==="publish"){
   if(current.rows[0].status!=="validated")return Response.json({success:false,error:{code:"VALIDATION_REQUIRED",message:"Le cours doit être validé par l’administrateur avant publication."}},{status:409});
   await db.query("UPDATE ai_course_drafts SET status='published',published_by=$2,published_at=NOW(),updated_at=NOW() WHERE id=$1",[id,user!.id]);
   await audit(user!.id,"ai_course_published","ai_course",id,{});
  }else if(action==="save"){
   const content=body.studentContent;
   await db.query("UPDATE ai_course_drafts SET title=COALESCE($2,title),course_content=COALESCE($3::jsonb,course_content),updated_at=NOW() WHERE id=$1",[id,body.title?String(body.title):null,content?JSON.stringify(content):null]);
   await audit(user!.id,"ai_course_edited","ai_course",id,{});
  }else return Response.json({success:false,error:{code:"INVALID_ACTION",message:"Action inconnue."}},{status:400});
  return Response.json({success:true});
 }catch(error){console.error("admin-ai-course-action",error);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de modifier le cours."}},{status:500});}
}