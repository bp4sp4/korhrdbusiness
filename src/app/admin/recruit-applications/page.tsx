"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  History,
} from "lucide-react";
import * as XLSX from "xlsx";
import React from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface Application {
  id: number;
  job_id: number;
  name: string;
  email?: string; // 선택적 필드로 변경
  phone: string;
  address: string; // 거주지 (서울, 경기/인천, 그외)
  birth_date?: string; // 선택적 필드로 변경
  introduction: string; // 하고싶은말
  cover_letter?: string; // 선택적 필드로 변경
  resume_url?: string; // 선택적 필드로 변경
  portfolio_file_url?: string; // 선택적 필드로 변경
  portfolio_url?: string; // 선택적 필드로 변경
  website_url?: string;
  created_at: string;
  status: string;
  consent?: string; // 동의 여부
  educations?: {
    graduationDate: string;
    type: string;
    school: string;
    major: string;
    score: string;
    graduationStatus: string;
    entranceYear: string;
    graduationYear: string;
  }[]; // 선택적 필드로 변경
  experiences?: {
    period: string;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
  }[]; // 선택적 필드로 변경
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


export default function RecruitApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showHistory, setShowHistory] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<AdminActionLog[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

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


  const handleDelete = async (id: number) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;

    // 1. Storage 파일 삭제
    const filesToDelete = [];
    if (app.resume_url) {
      const resumePath = app.resume_url.split("/recruit-files/")[1];
      if (resumePath) filesToDelete.push(resumePath);
    }
    if (app.portfolio_file_url) {
      const portfolioPath = app.portfolio_file_url.split("/recruit-files/")[1];
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
      (a.email && a.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.phone.includes(searchTerm) ||
      (a.address && a.address.includes(searchTerm));
    return matchesSearch;
  });
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  // 엑셀 다운로드
  const handleExcelDownload = () => {
    const exportData = filteredData.map((a) => ({
      이름: a.name,
      이메일: a.email || "-",
      연락처: a.phone,
      거주지: a.address || "-",
      하고싶은말: a.introduction || "-",
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

          {/* Filter/Search Bar */}
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
            <input
              type="text"
              placeholder="이름, 연락처, 거주지 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-64"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-center">
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
                  <th className="p-2 text-center">지원일</th>
                  <th className="p-2 text-center">공고명</th>
                  <th className="p-2 text-center">이름</th>
                  <th className="p-2 text-center">연락처</th>
                  <th className="p-2 text-center">거주지</th>
                  <th className="p-2 text-center">하고싶은말</th>
                  <th className="p-2 text-center">관리</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center">
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
                    <td className="p-2 text-center">{a.created_at?.split("T")[0]}</td>
                    <td className="p-2 text-center">{getJobTitle(a.job_id)}</td>
                    <td className="p-2 text-center">{a.name}</td>
                    <td className="p-2 text-center">{a.phone}</td>
                    <td className="p-2 text-center">{a.address || "-"}</td>
                    <td className="p-2 text-center max-w-xs">
                      {a.introduction && a.introduction.length > 30 ? (
                        <button
                          onClick={() => setSelectedMessage(a.introduction)}
                          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate block w-full"
                        >
                          {a.introduction.substring(0, 30)}...
                        </button>
                      ) : (
                        <span>{a.introduction || "-"}</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
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

          {/* 하고싶은말 팝업 모달 */}
          <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>하고싶은말</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {selectedMessage || "-"}
                </p>
              </div>
            </DialogContent>
          </Dialog>

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
