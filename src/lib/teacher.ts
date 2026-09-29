import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

export async function requireTeacher(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return { user: null, response: Response.json({ success:false, error:{code:"UNAUTHENTICATED",message:"Connexion requise."} }, {status:401}) };
  if (!["teacher","admin","superadmin"].includes(String(user.role))) {
    return { user: null, response: Response.json({ success:false, error:{code:"FORBIDDEN",message:"Accès réservé aux enseignants."} }, {status:403}) };
  }
  return { user, response: null };
}
