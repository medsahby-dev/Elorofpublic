import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const { user, response } = await requireAdmin(request); if (response) return response;
  try {
    const body = await request.json(); const id=Number(body?.id); const status=String(body?.status||"");
    if(!Number.isInteger(id)||id<=0||!["draft","in_review","published","archived"].includes(status)) return Response.json({success:false,error:{code:"INVALID_INPUT",message:"Cours ou statut invalide."}},{status:400});
    const published=status==="published";
    const result=await db.query(`UPDATE courses SET status=$1,published=$2,updated_at=NOW() WHERE id=$3 RETURNING id,title,status,published`,[status,published,id]);
    if(!result.rowCount) return Response.json({success:false,error:{code:"COURSE_NOT_FOUND",message:"Cours introuvable."}},{status:404});
    await audit(user!.id,"course.status_updated","course",id,{status,published});
    return Response.json({success:true,data:result.rows[0]});
  }catch(error){console.error("admin-course-update",error);return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de modifier le cours."}},{status:500});}
}
