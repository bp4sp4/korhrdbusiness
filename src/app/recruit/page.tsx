"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  RefreshCw,
  MessageCircle,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Job {
  id: number;
  title: string;
  tags: string[];
  date: string;
  status: string;
  isEvent: boolean;
}

interface AddJobFormProps {
  onAdd: (job: Omit<Job, "id">) => void;
  onCancel: () => void;
}

interface EditJobFormProps {
  job: Job;
  onSave: (job: Job) => void;
  onCancel: () => void;
}

const AddJobForm = ({ onAdd, onCancel }: AddJobFormProps) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("단기계약직");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        date: date || new Date().toISOString().split("T")[0].replace(/-/g, "."),
        status,
        isEvent: false,
      });
      setTitle("");
      setTags("");
      setDate("");
      setStatus("단기계약직");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border rounded-lg p-4 bg-background"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="직무명을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="태그 (쉼표로 구분)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="단기계약직">단기계약직</SelectItem>
              <SelectItem value="정규직">정규직</SelectItem>
              <SelectItem value="계약직">계약직</SelectItem>
              <SelectItem value="인턴">인턴</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">추가</Button>
        </div>
      </form>
    </motion.div>
  );
};

const EditJobForm = ({ job, onSave, onCancel }: EditJobFormProps) => {
  const [title, setTitle] = useState(job.title);
  const [tags, setTags] = useState(job.tags.join(", "));
  const [date] = useState(job.date);
  const [status, setStatus] = useState(job.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        ...job,
        title: title.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        date: date || job.date,
        status,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border rounded-lg p-4 bg-background"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="직무명을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="태그 (쉼표로 구분)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="단기계약직">단기계약직</SelectItem>
              <SelectItem value="정규직">정규직</SelectItem>
              <SelectItem value="계약직">계약직</SelectItem>
              <SelectItem value="인턴">인턴</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            취소
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            저장
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default function RecruitListPage() {
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("all");
  const [type, setType] = useState("all");
  const [isAdmin, setIsAdmin] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("recruit_jobs")
        .select("*")
        .order("id", { ascending: true });
      if (!error && data) setJobs(data);
    }
    fetchJobs();
  }, []);

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

  const filteredJobs = jobs.filter((job) => {
    if (job.isEvent) return false;
    const matchesKeyword =
      keyword === "" ||
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase()));
    const matchesCompany = company === "all" || job.title.includes(company);
    const matchesType = type === "all" || job.title.includes(type);
    return matchesKeyword && matchesCompany && matchesType;
  });

  const recruitList = filteredJobs;

  const handleAddJob = async (newJob: Omit<Job, "id">) => {
    const { data, error } = await supabase
      .from("recruit_jobs")
      .insert([
        {
          title: newJob.title,
          tags: newJob.tags,
          date: newJob.date,
          status: newJob.status,
          is_event: false,
        },
      ])
      .select();
    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
    if (data) setJobs((prev) => [...prev, ...data]);
    setShowAddForm(false);
  };

  const handleEditJob = async (updatedJob: Job) => {
    const { data, error } = await supabase
      .from("recruit_jobs")
      .update({
        title: updatedJob.title,
        tags: updatedJob.tags,
        date: updatedJob.date,
        status: updatedJob.status,
        is_event: updatedJob.isEvent,
      })
      .eq("id", updatedJob.id)
      .select();
    if (!error && data)
      setJobs((prev) =>
        prev.map((j) => (j.id === updatedJob.id ? data[0] : j))
      );
    setEditingJobId(null);
  };

  const handleDeleteJob = async (jobId: number) => {
    const { error } = await supabase
      .from("recruit_jobs")
      .delete()
      .eq("id", jobId);
    if (!error) setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setDeletingJobId(null);
  };

  const handleReset = () => {
    setKeyword("");
    setCompany("all");
    setType("all");
  };

  return (
    <div className="min-h-screen mt-12 bg-background">
      <div className="w-full bg-blue-500 bg-[url('/images/colud_image.png')] bg-cover bg-center bg-no-repeat">
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                  대한민국 교육과 취업의 연결
                  <br />그 위대한 도전을 한평생에서 함께해보세요.
                </h1>
                <p className="text-blue-100 mb-6 text-sm sm:text-base leading-relaxed">
                  한평생가이던스는 단순히 교육서비스를 판매하는곳이 아닙니다.
                  고객이 현재 처한 상황을 면밀히 분석하여
                  <br className="hidden sm:block" />
                  실제 대한민국이 직면한 문제인 교육과 취업이 연결되지 않는다는
                  문제를 해결하는 팀 입니다.
                  <br />
                  이제는 정말 교육시장을 사명감 있게 주도하는 기업이 나와야
                  합니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="직무, 키워드로 검색하세요"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="pl-10 bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select value={company} onValueChange={setCompany}>
                      <SelectTrigger className="w-full sm:w-40 bg-white">
                        <SelectValue placeholder="모든 지역" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 지역</SelectItem>
                        <SelectItem value="서울북부">서울북부</SelectItem>
                        <SelectItem value="서울강남">서울강남</SelectItem>
                        <SelectItem value="서울은평">서울은평</SelectItem>
                        <SelectItem value="서울가산">서울가산</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="w-full sm:w-40 bg-white">
                        <SelectValue placeholder="분류" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">분류</SelectItem>
                        <SelectItem value="지점장">지점장</SelectItem>
                        <SelectItem value="팀장급">팀장급</SelectItem>
                        <SelectItem value="경력">경력</SelectItem>
                        <SelectItem value="신입">신입</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="bg-white hover:bg-gray-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      초기화
                    </Button>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    설계사 등록
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold">
            <span className="text-blue-500">{recruitList.length}개</span>의
            포지션이 열려있어요.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence>
              {showAddForm && (
                <AddJobForm
                  onAdd={handleAddJob}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {recruitList.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg bg-card hover:shadow-md transition-shadow"
                  onClick={
                    !isAdmin
                      ? () => router.push(`/recruit/${job.id}`)
                      : undefined
                  }
                  style={!isAdmin ? { cursor: "pointer" } : {}}
                >
                  {editingJobId === job.id ? (
                    <div className="p-4">
                      <EditJobForm
                        job={job}
                        onSave={handleEditJob}
                        onCancel={() => setEditingJobId(null)}
                      />
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {job.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-fit">
                              {job.status}
                            </Badge>
                            {isAdmin && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingJobId(job.id);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-blue-100"
                                >
                                  <Edit2 className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeletingJobId(job.id);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {job.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <Card className="p-4 min-h-[100px] bg-muted/50 flex items-center justify-center">
                {/* 나중에 내용을 추가할 수 있는 빈 카드 */}
              </Card>
              <Card className="p-4 min-h-[100px] bg-muted/50 flex items-center justify-center">
                {/* 나중에 내용을 추가할 수 있는 빈 카드 */}
              </Card>
              <Card className="p-4 min-h-[100px] bg-muted/50 flex items-center justify-center">
                {/* 나중에 내용을 추가할 수 있는 빈 카드 */}
              </Card>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-center text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-lg border">
              채용팀에
              <br />
              문의하기
            </p>
            <Button size="lg" className="rounded-full h-16 w-16 shadow-lg">
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {deletingJobId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setDeletingJobId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-background rounded-lg p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">채용 공고 삭제</h3>
                <p className="text-muted-foreground mb-6">
                  정말로 이 채용 공고를 삭제하시겠습니까? 이 작업은 되돌릴 수
                  없습니다.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setDeletingJobId(null)}
                  >
                    취소
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteJob(deletingJobId)}
                  >
                    삭제
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
