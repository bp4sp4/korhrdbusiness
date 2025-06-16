"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import React from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

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
  website_url?: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;

    // 1. Storage 파일 삭제
    const filesToDelete = [];
    if (app.resume_url) {
      const resumePath = app.resume_url.split("/recruit-files/")[1];
      if (resumePath) filesToDelete.push(resumePath);
    }
    if (app.portfolio_url) {
      const portfolioPath = app.portfolio_url.split("/recruit-files/")[1];
      if (portfolioPath) filesToDelete.push(portfolioPath);
    }
    if (filesToDelete.length > 0) {
      await supabase.storage.from("recruit-files").remove(filesToDelete);
    }

    // 2. DB에서 지원자 삭제
    await supabase.from("recruit_applications").delete().eq("id", id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // 검색/필터/페이지네이션
  const filteredData = applications.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 상태별 통계
  const statusCounts = {
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    const exportData = filteredData.map((a) => ({
      이름: a.name,
      이메일: a.email,
      연락처: a.phone,
      공고명: getJobTitle(a.job_id),
      지원일: a.created_at?.split("T")[0],
      상태: a.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "지원자목록");
    XLSX.writeFile(workbook, "recruit_applications.xlsx");
  };

  if (loading) return <div className="p-8 text-center text-lg">로딩 중...</div>;

  return (
    <AdminAuthGuard>
      <div className="min-h-screen mt-20 bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                설계사 지원자 관리
              </h1>
              <p className="text-muted-foreground mt-1">
                총 {filteredData.length}명의 지원자가 있습니다.
              </p>
            </div>
            <Button className="gap-2" onClick={handleExcelDownload}>
              <Download className="w-4 h-4" />
              엑셀 다운로드
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">합격</p>
                    <p className="text-2xl font-bold">
                      {statusCounts.approved}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">불합격</p>
                    <p className="text-2xl font-bold">
                      {statusCounts.rejected}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">대기</p>
                    <p className="text-2xl font-bold">{statusCounts.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter/Search Bar */}
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
            <input
              type="text"
              placeholder="이름, 이메일, 연락처 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-40"
            >
              <option value="all">전체 상태</option>
              <option value="pending">대기</option>
              <option value="approved">합격</option>
              <option value="rejected">불합격</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">지원일</th>
                  <th className="p-2">공고명</th>
                  <th className="p-2">이름</th>
                  <th className="p-2">이메일</th>
                  <th className="p-2">연락처</th>
                  <th className="p-2">이력서</th>
                  <th className="p-2">포트폴리오 파일</th>
                  <th className="p-2">포트폴리오 URL</th>
                  <th className="p-2">개인 웹사이트</th>
                  <th className="p-2">상태</th>
                  <th className="p-2">관리</th>
                  <th className="p-2">상세</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{a.created_at?.split("T")[0]}</td>
                    <td className="p-2">{getJobTitle(a.job_id)}</td>
                    <td className="p-2">{a.name}</td>
                    <td className="p-2">{a.email}</td>
                    <td className="p-2">{a.phone}</td>
                    <td className="p-2">
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
                    <td className="p-2">
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
                    <td className="p-2">
                      {a.portfolio_url && a.portfolio_url.startsWith("http") ? (
                        <a
                          href={a.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          바로가기
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      {a.website_url ? (
                        <a
                          href={a.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          바로가기
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      <select
                        value={a.status}
                        onChange={(e) =>
                          handleStatusChange(a.id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">대기</option>
                        <option value="approved">합격</option>
                        <option value="rejected">불합격</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(a.id)}
                      >
                        삭제
                      </Button>
                    </td>
                    <td className="p-2">
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
            {paginatedData.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                지원 내역이 없습니다.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredData.length > 0 ? (
                <>
                  {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} 항목
                </>
              ) : (
                "항목이 없습니다"
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          </div>

          {/* 상세 모달 */}
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
                    포트폴리오 파일:{" "}
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
                  <div>
                    포트폴리오 URL:{" "}
                    {selected.portfolio_url &&
                    selected.portfolio_url.startsWith("http") ? (
                      <a
                        href={selected.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        바로가기
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div>
                    개인 웹사이트:{" "}
                    {selected.website_url ? (
                      <a
                        href={selected.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        바로가기
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div>
                    상태:{" "}
                    {selected.status === "pending"
                      ? "대기중"
                      : selected.status === "approved"
                      ? "합격"
                      : selected.status === "rejected"
                      ? "불합격"
                      : selected.status}
                  </div>
                  <div>지원일: {selected.created_at?.split("T")[0]}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuthGuard>
  );
}
