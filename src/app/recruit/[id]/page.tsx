"use client";
import { useParams } from "next/navigation";

const jobs = [
  {
    id: 1,
    title: "보험설계사 (위촉직 대면 FC, 직영)",
    tags: ["비즈니스", "보험영업", "상담", "손해보험"],
    date: "2025.06.05",
    status: "단기계약직",
    description: "이곳에 상세 설명을 작성하세요.",
  },
  // ...다른 채용 데이터
];

export default function RecruitDetailPage() {
  const params = useParams();
  const jobId = Number(params.id);
  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return <div className="p-8">채용 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto mt-10 py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <div className="mb-2 text-gray-500">{job.tags.join(" · ")}</div>
      <div className="mb-2 text-sm text-gray-400">{job.date}</div>
      <div className="mb-6">{job.status}</div>
      <div className="mb-8">{job.description}</div>
      {/* 지원 폼 등 추가 가능 */}
    </main>
  );
}
