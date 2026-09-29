import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.elprof.online").replace(/\/$/, "");
  const staticRoutes = ["/", "/cours", "/classes"].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 }));
  try {
    const result = await db.query<{ slug: string; updated_at: string }>("SELECT slug, updated_at FROM courses WHERE published = true ORDER BY updated_at DESC");
    const courses = result.rows.map((course) => ({ url: `${base}/cours/${encodeURIComponent(course.slug)}`, lastModified: new Date(course.updated_at), changeFrequency: "weekly" as const, priority: 0.8 }));
    return [...staticRoutes, ...courses];
  } catch {
    return staticRoutes;
  }
}
