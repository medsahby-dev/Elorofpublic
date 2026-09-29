export function jsonError(message: string, status = 400) {
  return Response.json({ success: false, message }, { status });
}

export function getAuthToken(request: Request) {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)elprof_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
