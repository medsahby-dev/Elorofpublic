import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { getAuthToken } from "@/lib/api";

export async function getCurrentUser(request: Request) {
  const token = getAuthToken(request);
  if (!token) return null;
  try {
    const auth = verifyToken(token);
    const result = await db.query(
      `SELECT id, first_name, last_name, email, role, level, objective, subscription, xp
       FROM users WHERE id=$1 LIMIT 1`,
      [auth.id]
    );
    return result.rows[0] ?? null;
  } catch {
    return null;
  }
}
