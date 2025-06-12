"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

interface ConsultationRequest {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  experience: string;
  field: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  created_at: string;
  status: "pending" | "approved" | "rejected" | "completed";
  requestDate?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          대기중
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          승인됨
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 border-red-200"
        >
          <XCircle className="w-3 h-3 mr-1" />
          거절됨
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          완료됨
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ConsultationAdminPage = () => {
  const [data, setData] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fieldFilter, setFieldFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchConsultations() {
      setLoading(true);
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
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
          status: item.status || "pending",
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
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesField = fieldFilter === "all" || item.field === fieldFilter;

      return matchesSearch && matchesStatus && matchesField;
    });
  }, [data, searchTerm, statusFilter, fieldFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const uniqueFields = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.field)));
  }, [data]);

  const handleStatusChange = async (id: string | number, newStatus: string) => {
    // DB 업데이트
    const { error } = await supabase
      .from("consultations")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      alert("상태 변경 실패: " + error.message);
      return;
    }
    // 변경 후 데이터 다시 불러오기
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus as ConsultationRequest["status"] }
          : item
      )
    );
  };

  const handleExcelDownload = () => {
    const exportData = filteredData.map((item) => ({
      이름: item.name,
      이메일: item.email,
      연락처: item.phone,
      경력: item.experience,
      분야: item.field,
      상담유형: item.consultationType,
      희망일: item.preferredDate,
      메시지: item.message,
      신청일: item.requestDate,
      상태: item.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "상담신청내역");
    XLSX.writeFile(workbook, "consultations.xlsx");
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  return (
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
          <Button className="gap-2" onClick={handleExcelDownload}>
            <Download className="w-4 h-4" />
            엑셀 다운로드
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">대기중</p>
                  <p className="text-2xl font-bold">
                    {data.filter((item) => item.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">승인됨</p>
                  <p className="text-2xl font-bold">
                    {data.filter((item) => item.status === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">완료됨</p>
                  <p className="text-2xl font-bold">
                    {data.filter((item) => item.status === "completed").length}
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
                  <p className="text-sm text-muted-foreground">거절됨</p>
                  <p className="text-2xl font-bold">
                    {data.filter((item) => item.status === "rejected").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="이름, 이메일, 연락처로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="approved">승인됨</SelectItem>
                  <SelectItem value="rejected">거절됨</SelectItem>
                  <SelectItem value="completed">완료됨</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fieldFilter} onValueChange={setFieldFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="분야 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 분야</SelectItem>
                  {uniqueFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">이름</TableHead>
                    <TableHead className="font-semibold">연락처</TableHead>
                    <TableHead className="font-semibold">경력</TableHead>
                    <TableHead className="font-semibold">분야</TableHead>
                    <TableHead className="font-semibold">상담유형</TableHead>
                    <TableHead className="font-semibold">희망일</TableHead>
                    <TableHead className="font-semibold">희망시간</TableHead>
                    <TableHead className="font-semibold">메시지</TableHead>
                    <TableHead className="font-semibold">상태</TableHead>
                    <TableHead className="font-semibold">신청일</TableHead>
                    <TableHead className="font-semibold text-center">
                      작업
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow
                      key={String(item.id)}
                      className="hover:bg-muted/30"
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {item.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {item.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          {item.experience}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.field}</Badge>
                      </TableCell>
                      <TableCell>{item.consultationType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {item.preferredDate}
                        </div>
                      </TableCell>
                      <TableCell>{item.preferredTime}</TableCell>
                      <TableCell>{item.message}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {item.requestDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="상세보기"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    String(item.id),
                                    "approved"
                                  )
                                }
                                className="text-blue-600"
                              >
                                승인
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    String(item.id),
                                    "rejected"
                                  )
                                }
                                className="text-red-600"
                              >
                                거절
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(
                                    String(item.id),
                                    "completed"
                                  )
                                }
                                className="text-green-600"
                              >
                                완료 처리
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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
  );
};

export default ConsultationAdminPage;
