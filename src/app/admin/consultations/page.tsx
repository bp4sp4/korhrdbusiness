"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import FilterBar from "@/components/admin/FilterBar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface ConsultationRequest {
  id: string | number;
  name: string;
  phone: string;
  experience: string;
  field: string;
  consent: boolean;
  created_at: string;
  requestDate?: string;
}

const ConsultationAdminPage = () => {
  const [data, setData] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchConsultations() {
      setLoading(true);
      const { data, error } = await supabase
        .from("consultations")
        .select("id, name, phone, experience, field, consent, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
      setData(
        (data as ConsultationRequest[]).map((item) => ({
          ...item,
          requestDate: item.created_at?.split("T")[0] || "",
        }))
      );
      setLoading(false);
    }
    fetchConsultations();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm);

      const matchesField = fieldFilter === "all" || item.field === fieldFilter;
      return matchesSearch && matchesField;
    });
  }, [data, searchTerm, fieldFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const uniqueFields = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.field)));
  }, [data]);

  const handleExcelDownload = () => {
    const exportData = filteredData.map((item) => ({
      이름: item.name,
      연락처: item.phone,
      학력: item.experience,
      관심분야: item.field,
      개인정보동의: item.consent ? "동의" : "미동의",
      신청일: item.requestDate,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "상담신청내역");
    XLSX.writeFile(workbook, "consultations.xlsx");
  };

  // 전체 선택 핸들러
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 개별 선택 핸들러
  const handleSelectOne = (id: string | number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  // 선택 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm("선택한 항목을 모두 삭제하시겠습니까?")) return;
    const { error } = await supabase
      .from("consultations")
      .delete()
      .in("id", selectedIds);
    if (!error) {
      setData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
      setSelectedIds([]);
    } else {
      alert("삭제 실패: " + error.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen mt-20 bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                상담 신청 관리
              </h1>
              <p className="text-muted-foreground mt-1">
                총 {filteredData.length}개의 상담 신청이 있습니다.
              </p>
            </div>
            <div className="flex gap-2 md:mb-0">
              <Button className="gap-2" onClick={handleExcelDownload}>
                <Download className="w-4 h-4" />
                엑셀 다운로드
              </Button>
              <Button
                variant="destructive"
                disabled={selectedIds.length === 0}
                onClick={handleDeleteSelected}
              >
                선택 삭제
              </Button>
            </div>
          </div>

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fieldFilter={fieldFilter}
            setFieldFilter={setFieldFilter}
            uniqueFields={uniqueFields}
          />

          <table className="w-full text-sm mt-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((item) =>
                        selectedIds.includes(item.id)
                      )
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="p-2">이름</th>
                <th className="p-2">연락처</th>
                <th className="p-2">학력</th>
                <th className="p-2">관심분야</th>
                <th className="p-2">개인정보동의</th>
                <th className="p-2">신청일</th>
                <th className="p-2">관리</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) =>
                        handleSelectOne(item.id, e.target.checked)
                      }
                    />
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.phone}</td>
                  <td className="p-2">{item.experience}</td>
                  <td className="p-2">{item.field}</td>
                  <td className="p-2">{item.consent ? "동의" : "미동의"}</td>
                  <td className="p-2">{item.requestDate}</td>
                  <td className="p-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (!confirm("정말 삭제하시겠습니까?")) return;
                        const { error } = await supabase
                          .from("consultations")
                          .delete()
                          .eq("id", item.id);
                        if (!error) {
                          setData((prev) =>
                            prev.filter((row) => row.id !== item.id)
                          );
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== item.id)
                          );
                        } else {
                          alert("삭제 실패: " + error.message);
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default ConsultationAdminPage;
