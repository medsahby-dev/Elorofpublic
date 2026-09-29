import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  try {
    await db.query("SELECT 1");
    return NextResponse.json({
      status: "ok",
      database: "connected",
      version: process.env.APP_VERSION ?? "3.9.0",
      uptime: Math.round(process.uptime()),
      responseMs: Date.now() - started,
    }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({
      status: "degraded",
      database: "unavailable",
      version: process.env.APP_VERSION ?? "3.9.0",
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
