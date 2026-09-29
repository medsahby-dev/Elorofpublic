import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { getAuthToken, jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const raw = getAuthToken(request);
    if (!raw) return jsonError("Session requise.", 401);
    const auth = verifyToken(raw);
    const result = await db.query(
      `SELECT id, first_name, last_name, email, role, level, objective, subscription, xp, created_at
       FROM users WHERE id=$1`, [auth.id]
    );
    if (!result.rowCount) return jsonError("Utilisateur introuvable.", 404);
    return Response.json({ success: true, user: result.rows[0] });
  } catch {
    return jsonError("Session invalide.", 401);
  }
}
