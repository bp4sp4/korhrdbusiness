"use client";

import { useState, useEffect } from "react";
import "@/app/main.css";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Job {
  id: number;
  title: string;
  tags: string[];
  date: string;
  status: string;
  isEvent: boolean;
  main_tasks?: string;
  qualification?: string;
  welfare?: string;
  location?: string;
  salary?: string;
}

interface ApplicationForm {
  name: string;
  phone: string;
  location: string; // 서울, 경기/인천, 그외
  message: string; // 하고싶은말
}


const JobDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    name: "",
    phone: "",
    location: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

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

  // 전화번호 포맷팅 함수 (010-XXXX-XXXX)
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");
    // 길이에 따라 하이픈 추가
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (field: keyof ApplicationForm, value: string) => {
    // 연락처 필드인 경우 포맷팅 적용
    if (field === "phone") {
      const formatted = formatPhoneNumber(value);
      setApplicationForm((prev) => ({
        ...prev,
        [field]: formatted,
      }));
    } else {
      setApplicationForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert("개인정보 수집 및 이용에 동의하셔야 지원이 가능합니다.");
      return;
    }
    setIsSubmitting(true);

    const { error: insertError } = await supabase
      .from("recruit_applications")
      .insert([
        {
          job_id: jobId,
          name: applicationForm.name,
          phone: applicationForm.phone,
          address: applicationForm.location,
          introduction: applicationForm.message,
          status: "pending",
          consent: consent ? "Y" : "N",
        },
      ]);
    if (insertError) {
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

  // 지원서 제출 버튼 활성화 조건
  const allFieldsFilled =
    applicationForm.name &&
    applicationForm.phone &&
    applicationForm.location &&
    applicationForm.message &&
    consent;

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
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>등록일: {job.date}</span>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">급여</h4>
                  {job.salary ? (
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {job.salary}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">-</p>
                  )}
                </div>
                {(() => {
                  const tasks = job.main_tasks
                    ? job.main_tasks
                        .split("\n")
                        .filter((task) => task.trim().length > 0)
                    : [];
                  return tasks.length > 0 ? (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">주요 업무</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const qualifications = job.qualification
                    ? job.qualification
                        .split("\n")
                        .filter((req) => req.trim().length > 0)
                    : [];
                  return qualifications.length > 0 ? (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">자격 요건</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {qualifications.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">복리후생</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(job.welfare ? job.welfare.split("\n") : []).map(
                      (benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
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
                  지원 신청{" "}
                </CardTitle>
                <span className="text-sm mt-2">
                  <span className="text-red-500">*</span> 표시된 곳은 반드시
                  입력하셔야 제출하기 버튼이 활성화됩니다.
                </span>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      
                      기본 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <Label htmlFor="name">
                          이름<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="이름을 입력하세요"
                          value={applicationForm.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                          className="border-0 border-b focus:ring-0 py-2 px-1 rounded-none shadow-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="phone">
                          연락처 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          placeholder="연락처를 입력하세요"
                          value={applicationForm.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          required
                          className="border-0 border-b focus:ring-0 focus:border-primary bg-transparent py-2 px-1 rounded-none shadow-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>
                        거주지 <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="location"
                            value="서울"
                            checked={applicationForm.location === "서울"}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="w-4 h-4"
                          />
                          <span>서울</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="location"
                            value="경기/인천"
                            checked={applicationForm.location === "경기/인천"}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="w-4 h-4"
                          />
                          <span>경기/인천</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="location"
                            value="그 외 지역"
                            checked={applicationForm.location === "그 외 지역"}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="w-4 h-4"
                          />
                          <span>그 외 지역</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* 하고싶은말 */}
                  <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      하고싶은말
                      <span className="text-red-500">*</span>
                    </h3>
                    <textarea
                      className="border rounded px-2 py-2 w-full"
                      placeholder="궁금한 점이나 특이사항을 자유롭게 작성해 주세요."
                      value={applicationForm.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      rows={6}
                    />
                  </section>
                  {/* 개인정보 동의 */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border">
                      <input
                        id="consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1"
                      />
                      <div className="leading-none">
                        <label
                          htmlFor="consent"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          개인정보 수집 및 이용에 동의합니다.
                          <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-[5px]">
                          채용 지원을 위해 개인정보 수집 및 이용에 동의가
                          필요합니다.{" "}
                          <button
                            type="button"
                            onClick={() => setShowConsentModal(true)}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            자세히 보기
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* 지원서 제출 버튼 */}
                  <Button
                    type="submit"
                    className="w-full bg-[#2B7FFF]"
                    disabled={isSubmitting || !allFieldsFilled}
                  >
                    {isSubmitting ? "제출 중..." : "지원서 제출하기"}
                  </Button>
                  {/* <Button
                    type="button"
                    className="w-full bg-gray-400 cursor-not-allowed"
                    disabled
                  >
                    서비스 준비 중입니다
                  </Button> */}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* 개인정보 동의 모달 */}
      <Dialog open={showConsentModal} onOpenChange={setShowConsentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              개인정보 수집 및 이용 동의
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">개인정보 수집·이용 안내</h4>
              <ul className="list-disc pl-4 mb-2 text-muted-foreground">
                <li>
                  수집 항목: 이름, 연락처, 거주지, 하고싶은말
                </li>
                <li>
                  이용 목적: 채용 지원자 관리, 채용 전형 진행, 입사 후 인사 관리
                </li>
                <li>
                  보유 및 이용 기간: 지원일로부터 1년 또는 관련 법령(근로기준법,
                  전자상거래 등에서의 소비자 보호에 관한 법률 등)에 따라 보관될
                  수 있으며, 보유 기간 경과 시 즉시 파기합니다.
                </li>
                <li>동의 거부 시 채용 지원이 제한될 수 있습니다.</li>
                <li>제3자 제공 및 위탁: 없음</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">개인정보 수집 및 이용 목적</h4>
              <p className="text-muted-foreground">
                채용 지원자 관리, 채용 전형 진행, 입사 후 인사 관리
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">개인정보 보유 및 이용 기간</h4>
              <p className="text-muted-foreground">
                지원일로부터 1년 (채용 종료 시까지)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">동의 거부 권리</h4>
              <p className="text-muted-foreground">
                개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 동의를
                거부할 경우 채용 지원이 제한될 수 있습니다.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConsentModal(false)}
            >
              닫기
            </Button>
            <Button
              onClick={() => {
                setConsent(true);
                setShowConsentModal(false);
              }}
            >
              동의하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetailPage;
