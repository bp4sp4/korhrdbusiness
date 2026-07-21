import { MetadataRoute } from "next";

const URL = "https://www.eduvisor.kr";

// 현재 운영 중인 페이지(홈, 소개)만 사이트맵에 포함
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${URL}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${URL}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];
}
