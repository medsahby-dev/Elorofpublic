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
   const source=await db.query("SELECT * FROM ai_course_drafts WHERE id=$1",[id]);
   const d=source.rows[0];
   const slugBase=String(d.title).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)||"cours-ia";
   const slug=slugBase+"-"+id;
   const content=JSON.stringify(d.course_content||{});
   const description=String((d.course_content||{}).introduction||"Cours de français créé avec Prof IA et validé par l'administrateur.");
   await db.query(
    "INSERT INTO courses(slug,title,description,level,category,access,lessons,duration,published,ai_draft_id,student_content,ai_generated,published_by,published_at) VALUES($1,$2,$3,$4,$5,'free',1,$6,true,$7,$8::jsonb,true,$9,NOW()) ON CONFLICT(ai_draft_id) DO UPDATE SET published=true,student_content=EXCLUDED.student_content,published_by=EXCLUDED.published_by,published_at=NOW(),updated_at=NOW()",
    [slug,d.title,description,d.level_label,d.activity,String(d.duration)+" min",id,content,user!.id]
   );
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