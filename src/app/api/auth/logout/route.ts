export async function POST() {
  const response = Response.json({ success: true });
  response.headers.append("Set-Cookie", "elprof_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax" + (process.env.NODE_ENV === "production" ? "; Secure" : ""));
  return response;
}
