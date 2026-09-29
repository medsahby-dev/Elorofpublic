import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return { user: null, response: Response.json({ success:false, error:{code:"UNAUTHENTICATED",message:"Connexion requise."} }, {status:401}) };
  if (user.role !== "admin" && user.role !== "superadmin") {
    return { user: null, response: Response.json({ success:false, error:{code:"FORBIDDEN",message:"Accès réservé aux administrateurs."} }, {status:403}) };
  }
  return { user, response: null };
}

export async function audit(actorId:number, action:string, entityType?:string, entityId?:number, metadata:Record<string,unknown>={}) {
  await db.query(
    `INSERT INTO audit_logs(actor_user_id, action, entity_type, entity_id, metadata) VALUES($1,$2,$3,$4,$5::jsonb)`,
    [actorId, action, entityType ?? null, entityId ?? null, JSON.stringify(metadata)]
  );
}
