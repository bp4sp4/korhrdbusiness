"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Filter,
  Grid,
  List,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Custom hook for pagination
function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
}: {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
}) {
  const pages = [];
  const showLeftEllipsis =
    currentPage > Math.ceil(paginationItemsToDisplay / 2);
  const showRightEllipsis =
    currentPage < totalPages - Math.floor(paginationItemsToDisplay / 2);

  let startPage = Math.max(
    1,
    currentPage - Math.floor(paginationItemsToDisplay / 2)
  );
  let endPage = Math.min(totalPages, startPage + paginationItemsToDisplay - 1);

  if (endPage - startPage + 1 < paginationItemsToDisplay) {
    startPage = Math.max(1, endPage - paginationItemsToDisplay + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return { pages, showLeftEllipsis, showRightEllipsis };
}

// NumberedPagination component
type NumberedPaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
  onPageChange: (page: number) => void;
};

function NumberedPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  onPageChange,
}: NumberedPaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  const handlePageChange = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#"
            onClick={handlePageChange(currentPage - 1)}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {showLeftEllipsis && (
          <PaginationItem>
            <span className="px-3 py-2">...</span>
          </PaginationItem>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={handlePageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showRightEllipsis && (
          <PaginationItem>
            <span className="px-3 py-2">...</span>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href="#"
            onClick={handlePageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// Types
interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

interface NoticeFormData {
  title: string;
  content: string;
}

// Main component
function NoticeHomepage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<NoticeFormData>({
    title: "",
    content: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data: admins } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email);
      setIsAdmin(Array.isArray(admins) && admins.length > 0);
    }
    checkAdmin();
  }, []);

  // Filter and sort notices
  useEffect(() => {
    async function fetchNotices() {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        alert(error.message);
        return;
      }
      setNotices(data || []);
    }
    fetchNotices();
  }, []);

  useEffect(() => {
    let filtered = notices.filter((notice) => {
      const matchesSearch =
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    filtered.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    setFilteredNotices(filtered);
    setCurrentPage(1);
  }, [notices, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  // Handlers
  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      alert(error.message);
      return;
    }
    setNotices(data || []);
  };

  const handleCreateNotice = async () => {
    const { data, error } = await supabase.from("notices").insert([
      {
        title: formData.title,
        content: formData.content,
        author: "관리자",
      },
    ]);
    if (error) {
      alert("저장 실패: " + error.message);
      return;
    }
    await fetchNotices();
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditNotice = async () => {
    if (!selectedNotice) return;
    const { data, error } = await supabase
      .from("notices")
      .update({
        title: formData.title,
        content: formData.content,
      })
      .eq("id", selectedNotice.id);
    if (error) {
      alert("수정 실패: " + error.message);
      return;
    }
    await fetchNotices();
    setSelectedNotice(null);
    setIsEditMode(false);
    resetForm();
  };

  const handleDeleteNotice = async (id: number) => {
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }
    await fetchNotices();
    if (selectedNotice?.id === id) {
      setSelectedNotice(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
    });
  };

  const openEditModal = (notice: Notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
    });
    setSelectedNotice(notice);
    setIsEditMode(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">공지사항</h1>
              <p className="text-muted-foreground mt-2">
                중요한 소식과 업데이트를 확인하세요
              </p>
            </div>
            {isAdmin && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />새 공지사항
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  필터
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">검색</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="제목 또는 내용 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  총 {filteredNotices.length}개의 공지사항
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Notice List */}
            <div
              className={cn(
                "space-y-4",
                viewMode === "grid" &&
                  "grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0"
              )}
            >
              {currentNotices.map((notice) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md"
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle
                            className="hover:text-primary transition-colors cursor-pointer"
                            onClick={() => setSelectedNotice(notice)}
                          >
                            {notice.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {notice.content.length > 100
                              ? `${notice.content.substring(0, 100)}...`
                              : notice.content}
                          </CardDescription>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(notice)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotice(notice.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {notice.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {notice.created_at}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <NumberedPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {selectedNotice && !isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-4">
                      {selectedNotice.title}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedNotice.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedNotice.created_at}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNotice(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <Separator className="mb-6" />

                <div className="prose max-w-none">
                  <p className="text-foreground leading-relaxed">
                    {selectedNotice.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditMode) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditMode(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {isEditMode ? "공지사항 수정" : "새 공지사항 작성"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditMode(false);
                      resetForm();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="공지사항 제목을 입력하세요"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="공지사항 내용을 입력하세요"
                      className="mt-2 min-h-[200px]"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setIsEditMode(false);
                        resetForm();
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={
                        isEditMode ? handleEditNotice : handleCreateNotice
                      }
                    >
                      {isEditMode ? "수정" : "작성"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NoticeHomepageDemo() {
  return <NoticeHomepage />;
}
