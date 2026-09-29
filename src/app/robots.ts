import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.elprof.online";
  return {
    rules: [{ userAgent: "*", allow: ["/"], disallow: ["/api/", "/admin", "/teacher", "/dashboard", "/quiz", "/connexion"] }],
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
  };
}
