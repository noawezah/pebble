import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site-origin";
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/ro"],
      disallow: ["/studio", "/design-system"],
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
