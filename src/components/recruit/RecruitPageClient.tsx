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
  Edit2,
  Trash2,
  Save,
  X,
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import "@/app/main.css";

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

// A new component for handling dynamic list of text inputs.
// This makes it easy for users to add or remove items like main tasks, qualifications, etc.
interface DynamicInputListProps {
  title: string;
  placeholder: string;
  items: string[];
  setItems: (items: string[]) => void;
}

const DynamicInputList = ({
  title,
  placeholder,
  items,
  setItems,
}: DynamicInputListProps) => {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    } else {
      setItems([""]); // Keep at least one input
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold">{title}</h4>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder={`${placeholder} #${index + 1}`}
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveItem(index)}
            className="text-muted-foreground hover:text-destructive"
          >
            <MinusCircle className="h-5 w-5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddItem}
        className="w-full"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        항목 추가
      </Button>
    </div>
  );
};

type JobFormProps = {
  onCancel: () => void;
} & (
  | {
      mode: "add";
      onSave: (data: Omit<Job, "id">) => void;
      initialData?: never;
    }
  | { mode: "edit"; onSave: (data: Job) => void; initialData: Job }
);

const JobForm = (props: JobFormProps) => {
  const { onCancel, initialData } = props;

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialData?.title || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [status, setStatus] = useState(initialData?.status || "단기계약직");
  const [salary, setSalary] = useState(initialData?.salary || "");
  const [mainTasks, setMainTasks] = useState(
    initialData?.main_tasks?.split("\n") || [""]
  );
  const [qualification, setQualification] = useState(
    initialData?.qualification?.split("\n") || [""]
  );
  const [welfare, setWelfare] = useState(
    initialData?.welfare?.split("\n") || [""]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const commonData = {
      title: title.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status,
      location,
      salary,
      main_tasks: mainTasks.filter(Boolean).join("\n"),
      qualification: qualification.filter(Boolean).join("\n"),
      welfare: welfare.filter(Boolean).join("\n"),
    };

    if (props.mode === "edit") {
      props.onSave({ ...props.initialData, ...commonData });
    } else {
      props.onSave({
        ...commonData,
        date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
        isEvent: false,
      });
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="p-2">
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-blue-700">
            단계 {step} / 3
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-[#2B7FFF] h-2 rounded-full"
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold mb-2">태그</h4>
                    <Input
                      placeholder="태그 (쉼표로 구분)"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-2">고용 형태</h4>
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
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <DynamicInputList
                  title="주요 업무"
                  placeholder="수행할 주요 업무"
                  items={mainTasks}
                  setItems={setMainTasks}
                />
                <DynamicInputList
                  title="자격 요건"
                  placeholder="필요한 자격 요건"
                  items={qualification}
                  setItems={setQualification}
                />
                <DynamicInputList
                  title="복리후생"
                  placeholder="제공되는 복리후생"
                  items={welfare}
                  setItems={setWelfare}
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold mb-2">급여</h4>
                  <Input
                    placeholder="급여 (예: 연 3,000만원)"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            취소
          </Button>
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={nextStep}>
              다음
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {initialData ? "저장" : "등록"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

const AddJobForm = ({ onAdd, onCancel }: AddJobFormProps) => (
  <JobForm mode="add" onSave={onAdd} onCancel={onCancel} />
);
const EditJobForm = ({ job, onSave, onCancel }: EditJobFormProps) => (
  <JobForm mode="edit" onSave={onSave} onCancel={onCancel} initialData={job} />
);

export default function RecruitListPageClient() {
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
          <section className="md:mb-8  md:mt-5">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <h1
                  className="text-[21px] md:text-[30px] sm:text-4xl lg:text-4xl  font-bold text-[#191f28] leading-tight"
                  style={{ letterSpacing: "-1px" }}
                >
                  한평생에듀바이저스와 함께하는 성장
                  <br />
                  교육의 새로운 미래를 만들어갑니다
                </h1>

                <p className="text-[#797979] mb-[30px] mt-[30px] text-sm sm:text-base leading-relaxed hidden sm:block">
                  한평생에듀바이저스는 단순한 교육기관이 아닙니다. 모두가 평생
                  성장할 수 있도록 돕는 교육의 장입니다.
                  <br className="hidden sm:block" />
                  학생, 교사, 교직원이 함께 만들어가는 따뜻한 교육 공동체를
                  지향합니다.
                  <br />
                  새로운 교육의 미래, 한평생에듀바이저스에서 시작하세요.
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
          <Link
            href="/recruit/interview"
            className="hover:text-[#1E1E1E] text-[#979797] group"
          >
            <span className="flex items-center pb-0.1 transition-all">
              더보기
              <span style={{ width: 14, height: 14 }}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m7.5 20.4c-.5-.5-.5-1.2 0-1.7l6.7-6.7-6.8-6.7c-.5-.5-.5-1.2 0-1.7s1.2-.5 1.7 0l7.5 7.5c.5.5.5 1.2 0 1.7l-7.5 7.5c-.2.3-.5.4-.8.4s-.6-.1-.8-.3z"
                    fill="#b0b8c1"
                    className="transition-colors group-hover:fill-[#1E1E1E]"
                  ></path>
                </svg>
              </span>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-6 pb-4">
                  <DialogTitle className="text-xl">채용공고 등록</DialogTitle>
                  <DialogDescription>
                    새로운 채용공고를 위한 정보를 단계별로 입력해주세요.
                  </DialogDescription>
                </DialogHeader>
                <AddJobForm
                  onAdd={handleAddJob}
                  onCancel={() => setShowAddForm(false)}
                />
              </DialogContent>
            </Dialog>

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
                    <Dialog
                      open={editingJobId === job.id}
                      onOpenChange={() => setEditingJobId(null)}
                    >
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                        <DialogHeader className="p-6 pb-4">
                          <DialogTitle className="text-xl">
                            채용공고 수정
                          </DialogTitle>
                          <DialogDescription>
                            채용공고 정보를 수정합니다.
                          </DialogDescription>
                        </DialogHeader>
                        <EditJobForm
                          job={job}
                          onSave={handleEditJob}
                          onCancel={() => setEditingJobId(null)}
                        />
                      </DialogContent>
                    </Dialog>
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
              <Link href="/recruit/interview/doyeon">
                <Card
                  className="min-h-[100px]  mb-5 flex flex-col justify-between hover:bg-muted cursor-pointer transition"
                  style={{
                    padding: "18px 18px 10px",
                    border: "1px solid rgba(0, 29, 58, 0.18)",
                  }}
                >
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-1 line-clamp-2">
                      에듀바이저스 북부지점 인터뷰
                    </div>
                    <div className="text-sm text-gray-500">
                      영업 1팀 | 강도연 대리
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/recruit/interview/eunhye">
                <Card
                  className="min-h-[100px]  flex flex-col mb-5 justify-between hover:bg-muted cursor-pointer transition"
                  style={{
                    padding: "18px 18px 10px",
                    border: "1px solid rgba(0, 29, 58, 0.18)",
                  }}
                >
                  <div>
                    <div className="font-bold text-base text-gray-900 mb-1 line-clamp-2">
                      에듀바이저스 강남지점 인터뷰
                    </div>
                    <div className="text-sm text-gray-500">
                      영업 3팀 | 장은혜 대리
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
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
