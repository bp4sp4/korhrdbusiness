"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
} from "lucide-react";
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

interface AdminActionLog {
  id: number;
  action_type: string;
  target_id: number;
  target_name: string;
  prev_status?: string;
  new_status?: string;
  memo?: string;
  admin_email: string;
  created_at: string;
}

function statusToKorean(status: string) {
  if (status === "approved") return "합격";
  if (status === "rejected") return "불합격";
  if (status === "pending") return "대기";
  return status;
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
  const [showHistory, setShowHistory] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<AdminActionLog[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  useEffect(() => {
    async function fetchRole() {
      setRoleLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRole(null);
        setRoleLoading(false);
        return;
      }
      const { data: admin } = await supabase
        .from("admins")
        .select("role")
        .eq("email", user.email)
        .single();
      setRole(admin?.role || null);
      setRoleLoading(false);
    }
    fetchRole();
  }, []);

  const getJobTitle = (job_id: number) =>
    jobs.find((j) => j.id === job_id)?.title || "-";

  const handleStatusChange = async (id: number, status: string) => {
    await supabase.from("recruit_applications").update({ status }).eq("id", id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    // 로그 저장
    await supabase.from("admin_action_logs").insert([
      {
        action_type: "상태변경",
        target_id: id,
        target_name: applications.find((a) => a.id === id)?.name || "",
        prev_status: applications.find((a) => a.id === id)?.status || "",
        new_status: status,
        created_at: new Date().toISOString(),
        admin_email:
          (await supabase.auth.getUser()).data.user?.email || "unknown",
      },
    ]);
  };

  const handleDelete = async (id: number) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;

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

    // 3. 삭제 로그 저장 (로그인한 계정 이메일로)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const adminEmail = user?.email || "unknown";
    await supabase.from("admin_action_logs").insert([
      {
        action_type: "삭제",
        target_id: id,
        target_name: app.name,
        created_at: new Date().toISOString(),
        admin_email: adminEmail,
      },
    ]);
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

  useEffect(() => {
    if (showHistory) {
      supabase
        .from("admin_action_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30)
        .then(({ data }) => setHistoryLogs(data || []));
    }
  }, [showHistory]);

  const handleBulkDelete = async () => {
    if (!window.confirm("정말 선택한 지원자를 모두 삭제하시겠습니까?")) return;
    for (const id of selectedIds) {
      await handleDelete(id);
    }
    setSelectedIds([]);
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
            <div className="flex gap-2">
              <Button className="gap-2" onClick={handleExcelDownload}>
                <Download className="w-4 h-4" />
                엑셀 다운로드
              </Button>
              {selectedIds.length > 0 &&
                (role === "super" || role === "manager") && (
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    className="gap-2"
                  >
                    선택 삭제
                  </Button>
                )}
              {/* 히스토리 버튼: super만 노출 */}
              {role === "super" && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowHistory(true)}
                >
                  <History className="w-4 h-4" />
                  히스토리 보기
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 border border-gray-200 shadow-lg p-6 rounded-2xl">
            <Card className="transition-shadow rounded-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  <CheckCircle className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-base text-blue-700 font-semibold">합격</p>
                  <p className="text-3xl font-extrabold">
                    {statusCounts.approved}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-shadow  rounded-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-full">
                  <XCircle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <p className="text-base text-red-700 font-semibold">불합격</p>
                  <p className="text-3xl font-extrabold">
                    {statusCounts.rejected}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="-shadow  rounded-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-yellow-50 rounded-full">
                  <AlertCircle className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <p className="text-base text-yellow-700 font-semibold">
                    대기
                  </p>
                  <p className="text-3xl font-extrabold">
                    {statusCounts.pending}
                  </p>
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
                  <th className="p-2">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((a) => selectedIds.includes(a.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(paginatedData.map((a) => a.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
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
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(a.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds((prev) => [...prev, a.id]);
                          } else {
                            setSelectedIds((prev) =>
                              prev.filter((id) => id !== a.id)
                            );
                          }
                        }}
                      />
                    </td>
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
                      {/* 상태수정 드롭다운: role이 있으면 활성화, 없으면 disabled */}
                      <select
                        value={a.status}
                        onChange={(e) =>
                          handleStatusChange(a.id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                        disabled={roleLoading || !role}
                      >
                        <option value="pending">대기</option>
                        <option value="approved">합격</option>
                        <option value="rejected">불합격</option>
                      </select>
                    </td>
                    <td className="p-2">
                      {/* 삭제 버튼: super, manager만 노출 */}
                      {(role === "super" || role === "manager") && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(a.id)}
                        >
                          삭제
                        </Button>
                      )}
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

          {/* 히스토리 모달 */}
          {showHistory && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
                <button
                  className="absolute top-2 right-2 text-xl"
                  onClick={() => setShowHistory(false)}
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-2">최근 작업 내역</h2>
                <ul className="text-sm text-gray-700 max-h-96 overflow-y-auto space-y-3">
                  {historyLogs.length === 0 && <li>작업 내역이 없습니다.</li>}
                  {historyLogs.map((log) => (
                    <li
                      key={log.id}
                      className="flex flex-col gap-1 border-b pb-2 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                        <span className="font-semibold text-blue-700">
                          {log.admin_email}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {log.action_type}
                        </span>
                        <span className="mx-1">-</span>
                        <span className="font-semibold">{log.target_name}</span>
                        {log.action_type === "상태변경" && (
                          <span className="ml-2 text-gray-600">
                            (
                            <span className="font-medium">
                              {statusToKorean(log.prev_status || "")}
                            </span>
                            <span className="mx-1">→</span>
                            <span className="font-medium">
                              {statusToKorean(log.new_status || "")}
                            </span>
                            )
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuthGuard>
  );
}
