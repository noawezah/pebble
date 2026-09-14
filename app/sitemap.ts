import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-origin";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  if (!origin) return [];
  return ["", "/ro"].map((path) => ({
    url: `${origin}${path}`,
    alternates: { languages: { en: origin, ro: `${origin}/ro` } },
  }));
}
