import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const roles = new Set(["student","teacher","parent","admin"]);

export async function GET(request: Request) {
  const { response } = await requireAdmin(request); if (response) return response;
  const url = new URL(request.url); const q = url.searchParams.get("q")?.trim() || "";
  try {
    const result = await db.query(`SELECT id,first_name,last_name,email,role,level,subscription,xp,created_at FROM users
      WHERE ($1='' OR email ILIKE '%'||$1||'%' OR first_name ILIKE '%'||$1||'%' OR last_name ILIKE '%'||$1||'%')
      ORDER BY created_at DESC LIMIT 100`, [q]);
    return Response.json({success:true,data:result.rows});
  } catch (error) { console.error("admin-users",error); return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de charger les utilisateurs."}},{status:500}); }
}

export async function PATCH(request: Request) {
  const { user, response } = await requireAdmin(request); if (response) return response;
  try {
    const body = await request.json(); const id = Number(body?.id); const role = String(body?.role || "");
    if (!Number.isInteger(id) || id <= 0 || !roles.has(role)) return Response.json({success:false,error:{code:"INVALID_INPUT",message:"Utilisateur ou rôle invalide."}},{status:400});
    if (id === user!.id && role !== "admin") return Response.json({success:false,error:{code:"SELF_LOCKOUT","message":"Vous ne pouvez pas retirer votre propre rôle administrateur."}},{status:409});
    const result = await db.query(`UPDATE users SET role=$1, updated_at=NOW() WHERE id=$2 RETURNING id,first_name,last_name,email,role`,[role,id]);
    if (!result.rowCount) return Response.json({success:false,error:{code:"USER_NOT_FOUND",message:"Utilisateur introuvable."}},{status:404});
    await audit(user!.id,"user.role_updated","user",id,{role});
    return Response.json({success:true,data:result.rows[0]});
  } catch(error){ console.error("admin-user-update",error); return Response.json({success:false,error:{code:"INTERNAL_ERROR",message:"Impossible de modifier l'utilisateur."}},{status:500}); }
}
