import jwt from "jsonwebtoken";

export type AuthUser = {
  id: number;
  email: string;
  role: "student" | "teacher" | "parent" | "admin";
  firstName: string;
  lastName: string;
};

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters.");
  return value;
}

export function signToken(user: AuthUser) {
  return jwt.sign(user, secret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, secret()) as AuthUser;
}
