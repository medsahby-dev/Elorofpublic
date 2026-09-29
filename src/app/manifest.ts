import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EL PROF",
    short_name: "EL PROF",
    description: "Plateforme éducative premium pour apprendre, pratiquer et progresser.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fb",
    theme_color: "#111827",
    lang: "fr",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
