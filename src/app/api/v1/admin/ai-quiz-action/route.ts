import {requireAdmin,audit} from "@/lib/admin";
import {db} from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 const {user,response}=await requireAdmin(request); if(response)return response;
 try{
  const body=await request.json(); const id=Number(body.id); const action=String(body.action||"");
  const r=await db.query("SELECT id,status FROM ai_quizzes WHERE id=$1",[id]);
  if(!r.rows[0])return Response.json({success:false,error:{code:"NOT_FOUND",message:"Quiz introuvable."}},{status:404});
  if(action==="validate"){
   await db.query("UPDATE ai_quizzes SET status='validated',validated_by=$2,validated_at=NOW(),updated_at=NOW() WHERE id=$1",[id,user!.id]);
   await audit(user!.id,"ai_quiz_validated","ai_quiz",id,{});
  }else if(action==="publish"){
   if(r.rows[0].status!=="validated")return Response.json({success:false,error:{code:"VALIDATION_REQUIRED",message:"Le quiz doit être validé avant publication."}},{status:409});
   await db.query("UPDATE ai_quizzes SET status='published',published_by=$2,published_at=NOW(),updated_at=NOW() WHERE id=$1",[id,user!.id]);
   await audit(user!.id,"ai_quiz_published","ai_quiz",id,{});
  }else return Response.json({success:false,error:{code:"INVALID_ACTION",message:"Action inconnue."}},{status:400});
  return Response.json({success:true});
 }catch(error){console.error("admin-ai-quiz-action",error);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de modifier le quiz."}},{status:500});}
}