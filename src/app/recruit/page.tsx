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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  tags: string[];
  date: string;
  status: string;
  isEvent: boolean;
  salary?: string;
  main_tasks?: string;
  qualification?: string;
  welfare?: string;
  location?: string;
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
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [mainTasks, setMainTasks] = useState("");
  const [qualification, setQualification] = useState("");
  const [welfare, setWelfare] = useState("");

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
        location,
        salary,
        main_tasks: mainTasks,
        qualification,
        welfare,
      });
      setTitle("");
      setTags("");
      setDate("");
      setStatus("단기계약직");
      setLocation("");
      setSalary("");
      setMainTasks("");
      setQualification("");
      setWelfare("");
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
          <h4 className="text-sm font-bold mb-2">직무명</h4>
        </div>
        <div>
          <Input
            placeholder="직무명을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">위치</h4>
        </div>
        <div>
          <Input
            placeholder="위치 (예: 서울 강남지점)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">태그</h4>
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
        <div>
          <h4 className="text-sm font-bold mb-2">급여</h4>
        </div>
        <div>
          <textarea
            className="w-full border rounded p-2 min-h-[40px]"
            placeholder="급여 (예: 연 3,000만원(인센티브 별도))"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">주요 업무</h4>
        </div>
        <div>
          <textarea
            className="w-full border rounded p-2 min-h-[48px]"
            placeholder={`주요 업무
주요 업무
주요 업무`}
            value={mainTasks}
            onChange={(e) => setMainTasks(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">자격 요건</h4>
        </div>
        <div>
          <textarea
            className="w-full border rounded p-2 min-h-[48px]"
            placeholder={`자격 요건
자격 요건
자격 요건`}
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">복리후생</h4>
        </div>
        <div>
          <textarea
            className="w-full border rounded p-2 min-h-[48px]"
            placeholder={`복리후생
복리후생
복리후생`}
            value={welfare}
            onChange={(e) => setWelfare(e.target.value)}
          />
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
  const [location, setLocation] = useState(job.location || "");
  const [salary, setSalary] = useState(job.salary || "");
  const [mainTasks, setMainTasks] = useState(job.main_tasks || "");
  const [qualification, setQualification] = useState(job.qualification || "");
  const [welfare, setWelfare] = useState(job.welfare || "");

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
        location,
        salary,
        main_tasks: mainTasks,
        qualification,
        welfare,
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
          <h4 className="text-sm font-bold mb-2">직무명</h4>
          <Input
            placeholder="직무명을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">위치</h4>
          <Input
            placeholder="위치 (예: 서울 강남지점)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">태그</h4>
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
        <div>
          <h4 className="text-sm font-bold mb-2">급여</h4>
          <textarea
            className="w-full border rounded p-2 min-h-[40px]"
            placeholder="급여 (예: 연 3,000만원\n(인센티브 별도))"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">주요 업무</h4>
          <textarea
            className="w-full border rounded p-2 min-h-[48px]"
            placeholder="주요 업무"
            value={mainTasks}
            onChange={(e) => setMainTasks(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">자격 요건</h4>
          <textarea
            className="w-full border rounded p-2 min-h-[48px]"
            placeholder="자격 요건"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
          />
        </div>
        <div>
          <h4 className="text-sm font-bold mb-2">복리후생</h4>
          <textarea
            className="w-full border rounded p-2 min-h-[48px]"
            placeholder="복리후생"
            value={welfare}
            onChange={(e) => setWelfare(e.target.value)}
          />
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

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
        setRoleLoading(false);
        return;
      }
      const { data: admins } = await supabase
        .from("admins")
        .select("role")
        .eq("email", user.email);
      setIsAdmin(
        Array.isArray(admins) &&
          admins.length > 0 &&
          (admins[0].role === "super" || admins[0].role === "manager")
      );
      setRoleLoading(false);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    setHydrated(true);
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
          location: newJob.location,
          salary: newJob.salary,
          main_tasks: newJob.main_tasks,
          qualification: newJob.qualification,
          welfare: newJob.welfare,
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
        location: updatedJob.location,
        salary: updatedJob.salary,
        main_tasks: updatedJob.main_tasks,
        qualification: updatedJob.qualification,
        welfare: updatedJob.welfare,
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
    <div className="min-h-screen mb-30 bg-background">
      <div className="w-full bg-[url('/images/recruit/recruit__banner.png')] bg-cover bg-center bg-no-repeat">
        <main className="max-w-6xl mx-auto p-[28px_20px_32px] md:py-8 md:px-4 sm:px-6 lg:px-8">
          <section className="md:mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h1
                  className="text-[21px] md:text-[30px] sm:text-4xl lg:text-4xl  font-bold text-[#191f28] leading-tight"
                  style={{ letterSpacing: "-1px" }}
                >
                  한평생교육원과 함께하는 성장
                  <br />
                  교육의 새로운 미래를 만들어갑니다
                </h1>

                <p className="text-[#797979] mb-[30px] mt-[30px] text-sm sm:text-base leading-relaxed hidden sm:block">
                  한평생교육원은 단순한 교육기관이 아닙니다. 모두가 평생 성장할
                  수 있도록 돕는 교육의 장입니다.
                  <br className="hidden sm:block" />
                  학생, 교사, 교직원이 함께 만들어가는 따뜻한 교육 공동체를
                  지향합니다.
                  <br />
                  새로운 교육의 미래, 한평생교육원에서 시작하세요.
                </p>
                <div className="h-[24px] md:hidden"></div>
                <div className="flex flex-col sm:flex-row gap-3  pb-[10px]">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="지역과 고용분류를 검색해보세요."
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
                        <span className={type !== "all" ? "text-blue-500" : ""}>
                          {type === "all" ? "분류" : type}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="all"
                          className="data-[state=checked]:text-blue-500"
                        >
                          분류
                        </SelectItem>
                        <SelectItem
                          value="지점장"
                          className="data-[state=checked]:text-blue-500"
                        >
                          지점장
                        </SelectItem>
                        <SelectItem
                          value="팀장급"
                          className="data-[state=checked]:text-blue-500"
                        >
                          팀장급
                        </SelectItem>
                        <SelectItem
                          value="경력"
                          className="data-[state=checked]:text-blue-500"
                        >
                          경력
                        </SelectItem>
                        <SelectItem
                          value="신입"
                          className="data-[state=checked]:text-blue-500"
                        >
                          신입
                        </SelectItem>
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

              {hydrated && !roleLoading && isAdmin && !showAddForm && (
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    채용공고 등록
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between">
          <h2 className="text-xl font-bold">
            <span className="text-blue-500">{recruitList.length}개</span>의
            포지션이 열려있어요.
          </h2>
          <Link href="/recruit/interview">
            <span className="text-gray-500 cursor-pointer hover:underline">
              더보기
            </span>
          </Link>
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
              <Link href="/recruit/interview/eunhye">
                <Card
                  className="min-h-[100px] bg-muted/50 flex flex-col mb-5 justify-between hover:bg-muted cursor-pointer transition"
                  style={{ padding: "18px 18px 10px" }}
                >
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-1 line-clamp-2">
                      한평생교육원 이야기
                    </div>
                    <div className="text-sm text-gray-500">
                      영업 3팀 | 장은혜 대리
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">2025.06.17</div>
                </Card>
              </Link>
              <Link href="/recruit/interview/hanpyeongsaeng2">
                <Card
                  className="min-h-[100px] bg-muted/50 mb-5 flex flex-col justify-between hover:bg-muted cursor-pointer transition"
                  style={{ padding: "18px 18px 10px" }}
                >
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-1 line-clamp-2">
                      한평생교육원 성장 스토리
                    </div>
                    <div className="text-sm text-gray-500">
                      교직원 | 한평생교육원
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">2025.06.17</div>
                </Card>
              </Link>
              <Link href="/recruit/interview/hanpyeongsaeng3">
                <Card
                  className="min-h-[100px] bg-muted/50 flex flex-col justify-between hover:bg-muted cursor-pointer transition"
                  style={{ padding: "18px 18px 10px" }}
                >
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-1 line-clamp-2">
                      한평생교육원과 함께하는 미래
                    </div>
                    <div className="text-sm text-gray-500">
                      학생 | 한평생교육원
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">2025.06.17</div>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 z-50">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full h-16 w-16 shadow-lg">
                <MessageCircle className="h-6 w-6" fill="currentColor" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <p className="text-sm text-center text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-lg border">
                채용팀에
                <br />
                문의하기
              </p>
            </DialogContent>
          </Dialog>
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
