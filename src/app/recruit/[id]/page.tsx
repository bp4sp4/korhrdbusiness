"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Upload,
  FileText,
  User,
  MapPin,
  Calendar,
  Briefcase,
  Send,
  CheckCircle,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Job {
  id: number;
  title: string;
  tags: string[];
  date: string;
  status: string;
  isEvent: boolean;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  location?: string;
  salary?: string;
}

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  experience: string;
  introduction: string;
  portfolio: File | null;
  resume: File | null;
  coverLetter: string;
}

// 파일명에서 한글, 공백, 특수문자 제거 (영문, 숫자, 언더스코어, 하이픈만 허용)
function sanitizeFileName(filename: string) {
  // 확장자 분리
  const ext = filename.includes(".") ? filename.split(".").pop() : "";
  // 이름 부분만 추출
  let name = filename.replace(/\.[^/.]+$/, "");
  // 영문, 숫자, 언더스코어, 하이픈만 남기고 나머지는 _로
  name = name
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 30);
  // 이름이 비어있으면 random 값
  if (!name) name = Math.random().toString(36).slice(2, 10);
  // 확장자 붙이기
  return `${name}_${Date.now()}${ext ? "." + ext : ""}`;
}

const JobDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    experience: "",
    introduction: "",
    portfolio: null,
    resume: null,
    coverLetter: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      const { data, error } = await supabase
        .from("recruit_jobs")
        .select("*")
        .eq("id", jobId)
        .single();
      if (!error && data) setJob(data);
      setLoading(false);
    }
    if (jobId) fetchJob();
  }, [jobId]);

  const handleInputChange = (field: keyof ApplicationForm, value: string) => {
    setApplicationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (
    field: "portfolio" | "resume",
    file: File | null
  ) => {
    setApplicationForm((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. 파일 업로드
    let resumeUrl = "";
    let portfolioUrl = "";

    // 이력서 업로드
    if (applicationForm.resume) {
      const safeName = sanitizeFileName(applicationForm.resume.name);
      const filePath = `resumes/${safeName}`;
      const { error } = await supabase.storage
        .from("recruit-files")
        .upload(filePath, applicationForm.resume, { upsert: true });
      if (error) {
        console.log(error);
        alert("이력서 업로드 실패: " + error.message);
        setIsSubmitting(false);
        return;
      }
      resumeUrl = supabase.storage.from("recruit-files").getPublicUrl(filePath)
        .data.publicUrl;
    }

    // 포트폴리오 업로드
    if (applicationForm.portfolio) {
      const safeName = sanitizeFileName(applicationForm.portfolio.name);
      const uniqueSuffix = `${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
      const filePath = `portfolios/${uniqueSuffix}_${safeName}`;
      const { error } = await supabase.storage
        .from("recruit-files")
        .upload(filePath, applicationForm.portfolio, { upsert: true });
      if (error) {
        alert("포트폴리오 업로드 실패: " + error.message);
        setIsSubmitting(false);
        return;
      }
      portfolioUrl = supabase.storage
        .from("recruit-files")
        .getPublicUrl(filePath).data.publicUrl;
    }

    // 2. recruit_applications 테이블에 저장
    console.log({
      job_id: jobId,
      name: applicationForm.name,
      email: applicationForm.email,
      phone: applicationForm.phone,
      address: applicationForm.address,
      birth_date: applicationForm.birthDate,
      experience: applicationForm.experience,
      introduction: applicationForm.introduction,
      cover_letter: applicationForm.coverLetter,
      resume_url: resumeUrl,
      portfolio_url: portfolioUrl,
      status: "pending",
    });

    const { error: insertError } = await supabase
      .from("recruit_applications")
      .insert([
        {
          job_id: jobId,
          name: applicationForm.name,
          email: applicationForm.email,
          phone: applicationForm.phone,
          address: applicationForm.address,
          birth_date: applicationForm.birthDate,
          experience: applicationForm.experience,
          introduction: applicationForm.introduction,
          cover_letter: applicationForm.coverLetter,
          resume_url: resumeUrl,
          portfolio_url: portfolioUrl,
          status: "pending",
        },
      ]);
    if (insertError) {
      console.log(insertError);
      alert("지원서 저장 실패: " + insertError.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }
  if (!job) {
    return (
      <div className="p-8 text-red-500 font-bold">
        존재하지 않는 채용 공고입니다. 올바른 경로로 접근해 주세요.
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">지원이 완료되었습니다!</h2>
          <p className="text-muted-foreground mb-6">
            지원해주셔서 감사합니다. 검토 후 연락드리겠습니다.
          </p>
          <Button onClick={goBack} className="w-full">
            목록으로 돌아가기
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={goBack}
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로 돌아가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 채용 공고 정보 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{job.status}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>등록일: {job.date}</span>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">급여</h4>
                  <p className="text-sm text-muted-foreground">{job.salary}</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">주요 업무</h4>
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">자격 요건</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {job.requirements?.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">복리후생</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {job.benefits?.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 지원 신청 폼 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  지원 신청
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      기본 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">이름 *</Label>
                        <Input
                          id="name"
                          placeholder="이름을 입력하세요"
                          value={applicationForm.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">이메일 *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="이메일을 입력하세요"
                          value={applicationForm.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">연락처 *</Label>
                        <Input
                          id="phone"
                          placeholder="연락처를 입력하세요"
                          value={applicationForm.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">생년월일</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={applicationForm.birthDate}
                          onChange={(e) =>
                            handleInputChange("birthDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">주소</Label>
                      <Input
                        id="address"
                        placeholder="주소를 입력하세요"
                        value={applicationForm.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {/* 경력 및 자기소개 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">경력 및 자기소개</h3>
                    <div className="space-y-2">
                      <Label htmlFor="experience">경력 사항</Label>
                      <Textarea
                        id="experience"
                        placeholder="관련 경력이나 업무 경험을 자세히 작성해주세요"
                        value={applicationForm.experience}
                        onChange={(e) =>
                          handleInputChange("experience", e.target.value)
                        }
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="introduction">자기소개 *</Label>
                      <Textarea
                        id="introduction"
                        placeholder="자신을 소개하고 지원 동기를 작성해주세요"
                        value={applicationForm.introduction}
                        onChange={(e) =>
                          handleInputChange("introduction", e.target.value)
                        }
                        rows={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">지원 동기 및 포부</Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="이 직무에 지원하는 이유와 향후 포부를 작성해주세요"
                        value={applicationForm.coverLetter}
                        onChange={(e) =>
                          handleInputChange("coverLetter", e.target.value)
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                  {/* 파일 첨부 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      서류 첨부
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resume">이력서 *</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                          <input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                              handleFileChange(
                                "resume",
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                          />
                          {applicationForm.resume ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-2 p-2 bg-green-50 rounded-lg">
                                <FileText className="h-5 w-5 text-green-600" />
                                <span className="text-sm text-green-700 font-medium">
                                  {applicationForm.resume.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleFileChange("resume", null)
                                  }
                                  className="h-6 w-6 p-0 hover:bg-red-100"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                              <label
                                htmlFor="resume"
                                className="cursor-pointer text-xs text-blue-600 hover:text-blue-800"
                              >
                                다른 파일로 변경
                              </label>
                            </div>
                          ) : (
                            <label htmlFor="resume" className="cursor-pointer">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                이력서를 첨부하세요
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, DOCX 파일만 가능
                              </p>
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">포트폴리오</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                          <input
                            id="portfolio"
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            onChange={(e) =>
                              handleFileChange(
                                "portfolio",
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                          />
                          {applicationForm.portfolio ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-sm text-blue-700 font-medium">
                                  {applicationForm.portfolio.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleFileChange("portfolio", null)
                                  }
                                  className="h-6 w-6 p-0 hover:bg-red-100"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                              <label
                                htmlFor="portfolio"
                                className="cursor-pointer text-xs text-blue-600 hover:text-blue-800"
                              >
                                다른 파일로 변경
                              </label>
                            </div>
                          ) : (
                            <label
                              htmlFor="portfolio"
                              className="cursor-pointer"
                            >
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                포트폴리오를 첨부하세요
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, PPT 파일만 가능
                              </p>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 제출 버튼 */}
                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <Send className="h-5 w-5 mr-2" />
                      )}
                      {isSubmitting ? "지원서 제출 중..." : "지원서 제출하기"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      제출된 지원서는 수정할 수 없습니다. 신중히 검토 후
                      제출해주세요.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
