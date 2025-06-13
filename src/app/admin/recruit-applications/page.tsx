"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: number;
  job_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  experience: string;
  introduction: string;
  cover_letter: string;
  resume_url: string;
  portfolio_url: string;
  created_at: string;
  status: string;
}

interface Job {
  id: number;
  title: string;
}

export default function RecruitApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: apps } = await supabase
        .from("recruit_applications")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: jobs } = await supabase
        .from("recruit_jobs")
        .select("id, title");
      setApplications(apps || []);
      setJobs(jobs || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const getJobTitle = (job_id: number) =>
    jobs.find((j) => j.id === job_id)?.title || "-";

  const handleStatusChange = async (id: number, status: string) => {
    await supabase.from("recruit_applications").update({ status }).eq("id", id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from("recruit_applications").delete().eq("id", id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">설계사 지원자 관리</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>지원일</th>
            <th>공고명</th>
            <th>이름</th>
            <th>이메일</th>
            <th>연락처</th>
            <th>이력서</th>
            <th>포트폴리오</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id} className="border-b">
              <td>{a.created_at?.split("T")[0]}</td>
              <td>{getJobTitle(a.job_id)}</td>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.phone}</td>
              <td>
                {a.resume_url ? (
                  <a
                    href={a.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      다운로드
                    </Button>
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {a.portfolio_url ? (
                  <a
                    href={a.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      다운로드
                    </Button>
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">대기</option>
                  <option value="approved">합격</option>
                  <option value="rejected">불합격</option>
                </select>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(a.id)}
                >
                  삭제
                </Button>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(a)}
                >
                  상세보기
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          지원 내역이 없습니다.
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">
              {selected.name} 지원 상세
            </h2>
            <div className="space-y-2 text-sm">
              <div>공고명: {getJobTitle(selected.job_id)}</div>
              <div>이메일: {selected.email}</div>
              <div>연락처: {selected.phone}</div>
              <div>주소: {selected.address}</div>
              <div>생년월일: {selected.birth_date}</div>
              <div>경력: {selected.experience}</div>
              <div>자기소개: {selected.introduction}</div>
              <div>지원동기: {selected.cover_letter}</div>
              <div>
                이력서:{" "}
                {selected.resume_url ? (
                  <a
                    href={selected.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    다운로드
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div>
                포트폴리오:{" "}
                {selected.portfolio_url ? (
                  <a
                    href={selected.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    다운로드
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div>상태: {selected.status}</div>
              <div>지원일: {selected.created_at?.split("T")[0]}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
