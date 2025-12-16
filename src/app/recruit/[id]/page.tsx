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
  Upload,
  FileText,
  User,
  MapPin,
  Calendar,
  Send,
  CheckCircle,
  X,
  Globe,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { sendSlackNotification } from "@/lib/slack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import ReactDatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

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
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  experience: string;
  introduction: string;
  portfolio: File | null;
  resume: File | null;
  coverLetter: string;
  portfolioUrl: string;
  websiteUrl: string;
  educations: {
    type: string;
    graduationStatus: string;
    entranceYear?: string;
    graduationYear?: string;
    school: string;
    major: string;
    score: string;
  }[];
  experiences: {
    startDate: string;
    endDate: string;
    company: string;
    position: string;
    description: string;
    employmentStatus: string; // 재직상태 추가
  }[];
}

interface Experience {
  startDate: string;
  endDate: string;
  company: string;
  position: string;
  description: string;
  employmentStatus: string;
}

interface Education {
  type: string;
  graduationStatus: string;
  entranceYear?: string;
  graduationYear?: string;
  school: string;
  major: string;
  score: string;
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

// 총 경력 개월 수 계산 함수
function getTotalCareerDuration(experiences: Experience[]): string {
  let totalMonths = 0;
  experiences.forEach((exp) => {
    if (exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate.replace(/\./g, "-"));
      const end = new Date(exp.endDate.replace(/\./g, "-"));
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
        totalMonths +=
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) +
          1;
      }
    }
  });
  if (totalMonths <= 0) return "";
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  let result = "총 경력: ";
  if (years > 0) result += `${years}년`;
  if (months > 0) result += ` ${months}개월`;
  if (years === 0 && months === 0) result += "0개월";
  return result.trim();
}

// 연도/월 커스텀 헤더용 배열 (파일 상단에 위치)
const currentYear = new Date().getFullYear();
const yearsDynamic = Array.from(
  { length: currentYear + 5 - (currentYear - 30) + 1 },
  (_, i) => currentYear - 30 + i
);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

// 커스텀 헤더 함수 (파일 상단에 위치)
function renderYearMonthHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1 gap-2">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="px-2"
      >
        {"<"}
      </button>
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(Number(value))}
        className="px-1 py-0.5 border rounded text-sm"
      >
        {yearsDynamic.map((option) => (
          <option key={option} value={option}>
            {option}년
          </option>
        ))}
      </select>
      <select
        value={date.getMonth()}
        onChange={({ target: { value } }) => changeMonth(Number(value))}
        className="px-1 py-0.5 border rounded text-sm"
      >
        {months.map((option, idx) => (
          <option key={option} value={idx}>
            {option}월
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="px-2"
      >
        {">"}
      </button>
    </div>
  );
}

// EducationRow 컴포넌트 분리
function EducationRow({
  edu,
  idx,
  handleEducationChange,
  educationsLength,
  removeEducation,
}: {
  edu: Education;
  idx: number;
  handleEducationChange: (
    idx: number,
    field: keyof Education,
    value: string
  ) => void;
  educationsLength: number;
  removeEducation: (idx: number) => void;
}) {
  return (
    <div className=" pb-6 relative">
      <div className="grid grid-cols-4 gap-x-4 items-end">
        {/* 학력구분 */}
        <select
          className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent appearance-none"
          value={edu.type}
          onChange={(e) => handleEducationChange(idx, "type", e.target.value)}
        >
          <option value="">학력 구분</option>
          <option value="고등학교">고등학교</option>
          <option value="대학(2,3년)">대학(2,3년)</option>
          <option value="대학(4년)">대학(4년)</option>
          <option value="대학원(석사)">대학원(석사)</option>
          <option value="대학원(박사)">대학원(박사)</option>
        </select>
        {/* 졸업상태 */}
        <select
          className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent appearance-none"
          value={edu.graduationStatus}
          onChange={(e) =>
            handleEducationChange(idx, "graduationStatus", e.target.value)
          }
        >
          <option value="">졸업상태 선택</option>
          <option value="졸업">졸업</option>
          <option value="졸업예정">졸업예정</option>
          <option value="재학중">재학중</option>
          <option value="중퇴">중퇴</option>
        </select>
        {/* 입학연도 (졸업상태가 재학중/졸업예정일 때만) */}
        {["재학중", "졸업예정"].includes(edu.graduationStatus) ? (
          <ReactDatePicker
            selected={
              edu.entranceYear
                ? new Date(edu.entranceYear.replace(/\./g, "-") + "-01")
                : null
            }
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                handleEducationChange(idx, "entranceYear", `${year}.${month}`);
              } else {
                handleEducationChange(idx, "entranceYear", "");
              }
            }}
            dateFormat="yyyy.MM"
            showMonthYearPicker
            locale={ko}
            placeholderText="YYYY.MM"
            customInput={
              <DateInputNoIcon
                value={edu.entranceYear || ""}
                onClick={() => {}}
                placeholder="YYYY.MM"
              />
            }
            renderCustomHeader={renderYearMonthHeader}
          />
        ) : null}
        {/* 졸업연도 (졸업/졸업예정/재학중 모두) */}
        {["졸업", "졸업예정", "재학중"].includes(edu.graduationStatus) ? (
          <ReactDatePicker
            selected={
              edu.graduationYear
                ? new Date(edu.graduationYear.replace(/\./g, "-") + "-01")
                : null
            }
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                handleEducationChange(
                  idx,
                  "graduationYear",
                  `${year}.${month}`
                );
              } else {
                handleEducationChange(idx, "graduationYear", "");
              }
            }}
            dateFormat="yyyy.MM"
            showMonthYearPicker
            locale={ko}
            placeholderText="YYYY.MM"
            customInput={
              <DateInputNoIcon
                value={edu.graduationYear || ""}
                onClick={() => {}}
                placeholder="YYYY.MM"
              />
            }
            renderCustomHeader={renderYearMonthHeader}
          />
        ) : null}
      </div>
      {/* 학교명, 전공, 학점 등 나머지 입력란은 기존대로 */}
      <div className="grid grid-cols-2 gap-x-4 mt-2">
        <input
          className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
          placeholder="학교명"
          value={edu.school}
          onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
        />
        <input
          className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
          placeholder="전공"
          value={edu.major}
          onChange={(e) => handleEducationChange(idx, "major", e.target.value)}
          disabled={edu.type === "고등학교"}
        />
        <input
          className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
          placeholder="학점"
          value={edu.score}
          onChange={(e) => handleEducationChange(idx, "score", e.target.value)}
          disabled={edu.type === "고등학교"}
        />
      </div>
      {educationsLength > 1 && (
        <button
          type="button"
          className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors z-10"
          onClick={() => removeEducation(idx)}
          aria-label="학력 삭제"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M6 6l8 8M6 14L14 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ExperienceRow 컴포넌트 분리
function ExperienceRow({
  exp,
  idx,
  handleExperienceChange,
  experiencesLength,
  removeExperience,
}: {
  exp: Experience;
  idx: number;
  handleExperienceChange: (
    idx: number,
    field: keyof Experience,
    value: string
  ) => void;
  experiencesLength: number;
  removeExperience: (idx: number) => void;
}) {
  return (
    <div className="pb-6 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 items-start mb-4">
        <div className="w-full">
          <label className="block text-xs text-gray-500 mb-1">입사년월</label>
          <ReactDatePicker
            selected={
              exp.startDate ? new Date(exp.startDate.replace(/\./g, "-")) : null
            }
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const day = date.getDate().toString().padStart(2, "0");
                handleExperienceChange(
                  idx,
                  "startDate",
                  `${year}.${month}.${day}`
                );
              } else {
                handleExperienceChange(idx, "startDate", "");
              }
            }}
            dateFormat="yyyy.MM.dd"
            placeholderText="YYYY.MM.DD"
            className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            customInput={
              <DateInputNoIcon
                value={exp.startDate || ""}
                onClick={() => {}}
                placeholder="YYYY.MM.DD"
              />
            }
            locale={ko}
            renderCustomHeader={renderYearMonthHeader}
          />
        </div>
        <div className="w-full">
          <label className="block text-xs text-gray-500 mb-1">퇴사년월</label>
          <ReactDatePicker
            selected={
              exp.endDate ? new Date(exp.endDate.replace(/\./g, "-")) : null
            }
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const day = date.getDate().toString().padStart(2, "0");
                handleExperienceChange(
                  idx,
                  "endDate",
                  `${year}.${month}.${day}`
                );
              } else {
                handleExperienceChange(idx, "endDate", "");
              }
            }}
            dateFormat="yyyy.MM.dd"
            placeholderText="YYYY.MM.DD"
            className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            customInput={
              <DateInputNoIcon
                value={exp.endDate || ""}
                onClick={() => {}}
                placeholder="YYYY.MM.DD"
              />
            }
            locale={ko}
            renderCustomHeader={renderYearMonthHeader}
          />
        </div>
        <div className="w-full">
          <label className="block text-xs text-gray-500 mb-1">회사명</label>
          <input
            className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
            placeholder="회사명"
            value={exp.company}
            onChange={(e) =>
              handleExperienceChange(idx, "company", e.target.value)
            }
          />
        </div>
        <div className="w-full">
          <label className="block text-xs text-gray-500 mb-1">재직상태</label>
          <select
            className="border-0 border-b focus:ring-0 focus:border-primary transition-colors text-sm w-full py-2 px-1 bg-transparent appearance-none"
            value={exp.employmentStatus}
            onChange={(e) =>
              handleExperienceChange(idx, "employmentStatus", e.target.value)
            }
          >
            <option value="">재직상태</option>
            <option value="재직중">재직중</option>
            <option value="퇴사">퇴사</option>
            <option value="인턴">인턴</option>
          </select>
        </div>
      </div>
      <input
        className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent md:col-span-2"
        placeholder="직책"
        value={exp.position}
        onChange={(e) =>
          handleExperienceChange(idx, "position", e.target.value)
        }
      />
      <textarea
        className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
        placeholder="주요업무 및 성과를 작성해 주세요."
        value={exp.description}
        onChange={(e) =>
          handleExperienceChange(idx, "description", e.target.value)
        }
        rows={3}
      />
      {experiencesLength > 1 && (
        <button
          type="button"
          className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors z-10"
          onClick={() => removeExperience(idx)}
          aria-label="경력 삭제"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M6 6l8 8M6 14L14 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
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
    portfolioUrl: "",
    websiteUrl: "",
    educations: [
      {
        type: "",
        graduationStatus: "",
        entranceYear: "",
        graduationYear: "",
        school: "",
        major: "",
        score: "",
      },
    ],
    experiences: [
      {
        startDate: "",
        endDate: "",
        company: "",
        position: "",
        description: "",
        employmentStatus: "",
      },
    ],
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

  const addEducation = () => {
    setApplicationForm((f) => ({
      ...f,
      educations: [
        ...f.educations,
        {
          type: "",
          graduationStatus: "",
          entranceYear: "",
          graduationYear: "",
          school: "",
          major: "",
          score: "",
        },
      ],
    }));
  };
  const removeEducation = (idx: number) => {
    setApplicationForm((f) => ({
      ...f,
      educations: f.educations.filter((_, i) => i !== idx),
    }));
  };
  const handleEducationChange = (idx: number, field: string, value: string) => {
    setApplicationForm((f) => ({
      ...f,
      educations: f.educations.map((edu, i) =>
        i === idx ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addExperience = () => {
    setApplicationForm((f) => ({
      ...f,
      experiences: [
        ...f.experiences,
        {
          startDate: "",
          endDate: "",
          company: "",
          position: "",
          description: "",
          employmentStatus: "",
        },
      ],
    }));
  };
  const removeExperience = (idx: number) => {
    setApplicationForm((f) => ({
      ...f,
      experiences: f.experiences.filter((_, i) => i !== idx),
    }));
  };
  const handleExperienceChange = (
    idx: number,
    field: string,
    value: string
  ) => {
    setApplicationForm((f) => ({
      ...f,
      experiences: f.experiences.map((exp, i) =>
        i === idx ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert("개인정보 수집 및 이용에 동의하셔야 지원이 가능합니다.");
      return;
    }
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
          portfolio_file_url: portfolioUrl,
          portfolio_url: applicationForm.portfolioUrl,
          website_url: applicationForm.websiteUrl,
          status: "pending",
          consent: consent ? "Y" : "N",
          educations: applicationForm.educations,
          experiences: applicationForm.experiences,
        },
      ]);
    if (insertError) {
      alert("지원서 저장 실패: " + insertError.message);
      setIsSubmitting(false);
      return;
    }

    // Slack 알림 전송
    const slackMessage = {
      text: "새로운 설계사 채용 지원서가 접수되었습니다!",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📝 새로운 설계사 채용 지원서",
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*지원자:*\n${applicationForm.name}`,
            },
            {
              type: "mrkdwn",
              text: `*연락처:*\n${applicationForm.phone}`,
            },
            {
              type: "mrkdwn",
              text: `*이메일:*\n${applicationForm.email}`,
            },
            {
              type: "mrkdwn",
              text: `*지원 공고:*\n${job?.title || "알 수 없음"}`,
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `📅 접수시간: ${new Date().toLocaleString("ko-KR", {
                timeZone: "Asia/Seoul",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}`,
            },
          ],
        },
      ],
    };

    await sendSlackNotification(slackMessage);

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
  const isEducationFilled =
    applicationForm.educations.length > 0 &&
    applicationForm.educations.every((edu) => {
      if (!edu.type || !edu.graduationStatus || !edu.school) return false;
      // 고등학교
      if (edu.type === "고등학교") {
        if (edu.graduationStatus === "졸업") {
          return !!edu.graduationYear;
        }
        if (["재학중", "졸업예정"].includes(edu.graduationStatus)) {
          return !!edu.entranceYear && !!edu.graduationYear;
        }
        // 중퇴, 기타 등은 졸업연도만 체크
        return !!edu.graduationYear;
      }
      // 대학/대학원
      if (["재학중", "졸업예정"].includes(edu.graduationStatus)) {
        return (
          !!edu.entranceYear &&
          !!edu.graduationYear &&
          !!edu.major &&
          !!edu.score
        );
      }
      // 졸업, 중퇴, 수료 등
      return !!edu.graduationYear && !!edu.major && !!edu.score;
    });
  const allFieldsFilled =
    applicationForm.name &&
    applicationForm.email &&
    applicationForm.phone &&
    applicationForm.birthDate &&
    applicationForm.address &&
    isEducationFilled &&
    applicationForm.introduction &&
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
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">자격 요건</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(job.qualification
                      ? job.qualification.split("\n")
                      : []
                    ).map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
                      <User className="h-5 w-5" />
                      기본 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          이메일 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="이메일을 입력하세요"
                          value={applicationForm.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                          className="border-0 border-b focus:ring-0  bg-transparent py-2 px-1 rounded-none shadow-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                          className="border-0 border-b focus:ring-0 focus:borde r-primary bg-transparent py-2 px-1 rounded-none shadow-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="birthDate">
                          생년월일 <span className="text-red-500">*</span>
                        </Label>
                        <ReactDatePicker
                          id="birthDate"
                          selected={
                            applicationForm.birthDate
                              ? new Date(
                                  applicationForm.birthDate.replace(/\./g, "-")
                                )
                              : null
                          }
                          onChange={(date) => {
                            if (date) {
                              const year = date.getFullYear();
                              const month = (date.getMonth() + 1)
                                .toString()
                                .padStart(2, "0");
                              const day = date
                                .getDate()
                                .toString()
                                .padStart(2, "0");
                              handleInputChange(
                                "birthDate",
                                `${year}.${month}.${day}`
                              );
                            } else {
                              handleInputChange("birthDate", "");
                            }
                          }}
                          dateFormat="yyyy.MM.dd"
                          placeholderText="YYYY.MM.DD"
                          className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          customInput={
                            <DateInputNoIcon
                              value={applicationForm.birthDate || ""}
                              onClick={() => {}}
                              placeholder="YYYY.MM.DD"
                            />
                          }
                          locale={ko}
                          renderCustomHeader={renderYearMonthHeader}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        주소 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        placeholder="주소를 입력하세요"
                        value={applicationForm.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="border-0 border-b focus:ring-0 focus:border-primary bg-transparent py-2 px-1 rounded-none  shadow-none"
                      />
                    </div>
                  </div>
                  {/* 학력 입력란 */}
                  <section className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      학력&nbsp;
                      <span className="text-red-500">*</span>
                      &nbsp;
                      <span className="text-sm font-normal text-[#979797]">
                        (고등학교 선택시 전공 및 학점 적는 칸이 비활성화
                        됩니다.)
                      </span>
                    </h3>
                    <div className="space-y-4">
                      {applicationForm.educations.map((edu, idx) => (
                        <EducationRow
                          key={idx}
                          edu={edu}
                          idx={idx}
                          handleEducationChange={handleEducationChange}
                          educationsLength={applicationForm.educations.length}
                          removeEducation={removeEducation}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-[#2B7FFF] font-semibold hover:text-[#1459c5] mt-6 group"
                      onClick={addEducation}
                    >
                      <span className="w-6 h-6 bg-[#2B7FFF] group-hover:bg-[#1459c5] text-white rounded-full flex items-center justify-center text-lg transition-colors">
                        +
                      </span>
                      <span className="group-hover:underline">학력 추가</span>
                    </button>
                  </section>

                  {/* 경력 입력란 */}
                  <section className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4">
                      <h3 className="text-xl font-bold mb-2 md:mb-0 text-gray-800 flex items-center gap-2">
                        경력
                        {getTotalCareerDuration(
                          applicationForm.experiences
                        ) && (
                          <span
                            className="text-base font-normal ml-2"
                            style={{ color: "#2B7FFF" }}
                          >
                            총 경력:{" "}
                            {getTotalCareerDuration(applicationForm.experiences)
                              .replace("총 경력:", "")
                              .trim()}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {applicationForm.experiences.map((exp, idx) => (
                        <ExperienceRow
                          key={idx}
                          exp={exp}
                          idx={idx}
                          handleExperienceChange={handleExperienceChange}
                          experiencesLength={applicationForm.experiences.length}
                          removeExperience={removeExperience}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-[#2B7fff] font-semibold hover:text-[#1459c5] mt-6 group"
                      onClick={addExperience}
                    >
                      <span className="w-6 h-6 bg-[#2B7FFF] group-hover:bg-[#1459c5] text-white rounded-full flex items-center justify-center text-lg transition-colors">
                        +
                      </span>
                      <span className="group-hover:underline">경력 추가</span>
                    </button>
                  </section>

                  {/* 자기소개/지원동기/포부 */}
                  <section className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      자기소개, 지원 동기 및 포부
                      <span className="text-red-500">*</span>
                    </h3>
                    <textarea
                      className="border rounded px-2 py-2 w-full"
                      placeholder="자기소개, 지원 동기 및 포부를 자유롭게 작성해 주세요."
                      value={applicationForm.introduction}
                      onChange={(e) =>
                        handleInputChange("introduction", e.target.value)
                      }
                      rows={6}
                    />
                  </section>
                  {/* 포트폴리오 및 웹사이트 URL */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      온라인 포트폴리오 & 웹사이트
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="portfolioUrl">포트폴리오 URL</Label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="portfolioUrl"
                            type="url"
                            placeholder="https://portfolio.example.com"
                            value={applicationForm.portfolioUrl}
                            onChange={(e) =>
                              handleInputChange("portfolioUrl", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl">개인 웹사이트 URL</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="websiteUrl"
                            type="url"
                            placeholder="https://yourwebsite.com"
                            value={applicationForm.websiteUrl}
                            onChange={(e) =>
                              handleInputChange("websiteUrl", e.target.value)
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
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
                        <Label htmlFor="resume">이력서 </Label>
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
                                <span
                                  className="text-sm font-medium max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap block"
                                  style={{ color: "#15803d" }}
                                >
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
                                <span
                                  className="text-sm font-medium max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap block"
                                  style={{ color: "#2563eb" }}
                                >
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
                      <div className="space-y-1 leading-none">
                        <label
                          htmlFor="consent"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          개인정보 수집 및 이용에 동의합니다.
                          <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-muted-foreground">
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
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">개인정보 수집·이용 안내</h4>
              <ul className="list-disc pl-4 mb-2 text-muted-foreground">
                <li>
                  수집 항목: 이름, 이메일, 연락처, 주소, 생년월일, 경력사항,
                  자기소개서, 이력서, 포트폴리오, 포트폴리오 URL, 개인 웹사이트
                  URL
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

// Custom input for react-datepicker (아이콘 없이, YYYY.MM 포맷)
const DateInputNoIcon = React.forwardRef<
  HTMLInputElement,
  { value: string; onClick: () => void; placeholder: string }
>(({ value, onClick, placeholder }, ref) => (
  <input
    className="border-0 border-b focus:ring-0 focus:border-primary transition-colors w-full py-2 px-1 bg-transparent"
    onClick={onClick}
    ref={ref}
    value={value || ""}
    placeholder={placeholder}
    readOnly
    style={{ cursor: "pointer" }}
  />
));
DateInputNoIcon.displayName = "DateInputNoIcon";

export default JobDetailPage;
