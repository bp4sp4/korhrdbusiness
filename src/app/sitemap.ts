import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const URL = "https://eduvisor.kr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지 경로
  const staticRoutes = [
    "/",
    "/about",
    "/eduservice",
    "/recruit",
    "/recruit/interview",
    "/faq",
    "/notice",
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // 동적 채용 공고 페이지 경로
  const { data: jobs, error } = await supabase
    .from("recruit_jobs")
    .select("id");

  if (error) {
    console.error("Error fetching jobs for sitemap:", error);
    return staticRoutes; // 에러 발생 시 정적 경로만 반환
  }

  const jobRoutes = jobs.map((job) => ({
    url: `${URL}/recruit/${job.id}`,
    lastModified: new Date().toISOString(),
  }));

  // 인터뷰 페이지 경로 (정적으로 추가)
  const interviewRoutes = [
    "/recruit/interview/doyeon",
    "/recruit/interview/eunhye",
    "/recruit/interview/hanpyeongsaeng3",
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticRoutes, ...jobRoutes, ...interviewRoutes];
}
