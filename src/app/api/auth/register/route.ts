import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!firstName || !lastName || !email || !password) return jsonError("Tous les champs sont obligatoires.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return jsonError("Adresse e-mail invalide.");
    if (password.length < 8) return jsonError("Le mot de passe doit contenir au moins 8 caractères.");

    const existing = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rowCount) return jsonError("Un compte existe déjà avec cette adresse e-mail.", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users(first_name,last_name,email,password_hash) VALUES($1,$2,$3,$4)
       RETURNING id, first_name, last_name, email, role, level, objective, subscription, xp`,
      [firstName, lastName, email, passwordHash]
    );
    const row = result.rows[0];
    const user = { id: Number(row.id), email: row.email, role: row.role, firstName: row.first_name, lastName: row.last_name };
    const token = signToken(user);
    const response = Response.json({ success: true, token, user: row }, { status: 201 });
    response.headers.append("Set-Cookie", `elprof_token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    return response;
  } catch (error) {
    console.error("register", error);
    return jsonError("Impossible de créer le compte pour le moment.", 500);
  }
}
