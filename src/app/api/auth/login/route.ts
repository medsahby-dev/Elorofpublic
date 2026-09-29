import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!email || !password) return jsonError("E-mail et mot de passe obligatoires.");

    const result = await db.query(
      `SELECT id, first_name, last_name, email, role, level, objective, subscription, xp, password_hash
       FROM users WHERE email=$1`, [email]
    );
    if (!result.rowCount) return jsonError("Identifiants incorrects.", 401);
    const row = result.rows[0];
    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return jsonError("Identifiants incorrects.", 401);

    const user = { id: Number(row.id), email: row.email, role: row.role, firstName: row.first_name, lastName: row.last_name };
    const { password_hash: _passwordHash, ...safeUser } = row;
    const token = signToken(user);
    const response = Response.json({ success: true, token, user: safeUser });
    response.headers.append("Set-Cookie", `elprof_token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    return response;
  } catch (error) {
    console.error("login", error);
    return jsonError("Connexion impossible pour le moment.", 500);
  }
}
