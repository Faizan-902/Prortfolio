import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://portfolio-seven-olive-11.vercel.app";
  const lastModified = new Date();
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
