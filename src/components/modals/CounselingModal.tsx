"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useCounselModal } from "@/store/useCounselModal";

interface FieldOption {
  value: string;
  label: string;
  category: string;
  icon: string;
  description?: string;
}

const fieldOptions: FieldOption[] = [
  {
    value: "사회복지사 자격증",
    label: "사회복지사 자격증",
    category: "국가자격증",
    icon: "🏥",
    description: "사회복지 전문가 양성",
  },
  {
    value: "보육교사 자격증",
    label: "보육교사 자격증",
    category: "국가자격증",
    icon: "👶",
    description: "영유아 보육 전문가",
  },
  {
    value: "한국어교원 자격증",
    label: "한국어교원 자격증",
    category: "국가자격증",
    icon: "🇰🇷",
    description: "한국어 교육 전문가",
  },
  {
    value: "평생교육사 자격증",
    label: "평생교육사 자격증",
    category: "국가자격증",
    icon: "📚",
    description: "성인 교육 전문가",
  },
  {
    value: "종합미용면허증",
    label: "종합미용면허증",
    category: "국가자격증",
    icon: "💄",
    description: "미용 전문가 면허",
  },
  {
    value: "산업기사/기사 응시자격",
    label: "산업기사/기사 응시자격",
    category: "국가자격증",
    icon: "🔧",
    description: "기술 전문가 자격",
  },
  {
    value: "요양보호사자격증",
    label: "요양보호사자격증",
    category: "국가자격증",
    icon: "👴",
    description: "노인 돌봄 전문가",
  },
  {
    value: "청소년지도사2급",
    label: "청소년지도사2급",
    category: "국가자격증",
    icon: "🧑‍🎓",
    description: "청소년 교육 지도",
  },
  {
    value: "장애인영유아보육교사",
    label: "장애인영유아보육교사",
    category: "국가자격증",
    icon: "🤝",
    description: "특수 보육 전문가",
  },
  {
    value: "심리학사",
    label: "심리학사",
    category: "학위/편입",
    icon: "🧠",
    description: "심리학 학사 학위",
  },
  {
    value: "2/4년제 학위취득",
    label: "2/4년제 학위취득",
    category: "학위/편입",
    icon: "🎓",
    description: "대학 학위 취득",
  },
  {
    value: "편입학/대졸자전형",
    label: "편입학/대졸자전형",
    category: "학위/편입",
    icon: "🏫",
    description: "대학 편입 준비",
  },
  {
    value: "민간자격증",
    label: "민간자격증",
    category: "추가경쟁력",
    icon: "📜",
    description: "다양한 민간 자격증",
  },
];

const CounselingModal = () => {
  const { isOpen, closeModal } = useCounselModal();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience: "고졸",
    field: "사회복지사 자격증",
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          experience: "고졸",
          field: "사회복지사 자격증",
          consent: false,
        });
        setIsSubmitted(false);
        setPhoneError("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const checkScrollIndicator = () => {
    const el = scrollRef.current;
    if (el) {
      const isScrollable = el.scrollHeight > el.clientHeight;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      setShowScrollIndicator(isScrollable && !isAtBottom);
    } else {
      setShowScrollIndicator(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "phone" && typeof value === "string") {
      setPhoneError(
        validatePhone(value)
          ? ""
          : "연락처는 숫자만 입력해주세요.(-)빼고 예: 01012345678"
      );
    }
  };

  const validatePhone = (phone: string) => /^\d{9,11}$/.test(phone);

  const educationLevels = ["고졸", "초대졸", "전문대졸", "4년제대졸"];

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase
        .from("consultations")
        .insert([{ ...formData, created_at: new Date().toISOString() }]);
      if (dbError) throw new Error(`DB 저장 실패: ${dbError.message}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className="sm:max-w-[500px] p-0 z-999"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>교육 상담 신청</DialogTitle>
          <DialogDescription>아래 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        {!isSubmitted ? (
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  이름 *
                </Label>
                <Input
                  id="name"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  연락처 *
                </Label>
                <Input
                  id="phone"
                  placeholder="하이픈(-) 없이 숫자만 입력"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full"
                  required
                />
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">학력 *</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) =>
                    handleInputChange("experience", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="학력을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  관심 분야*
                  <span className="text-xs text-gray-400">
                    (아래로 스크롤해 더 많은 항목을 확인하세요)
                  </span>
                </Label>
                <div className="relative">
                  <div
                    ref={scrollRef}
                    className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded-lg p-2 scrollbar-hide"
                    onScroll={checkScrollIndicator}
                  >
                    {Object.entries(
                      fieldOptions.reduce(
                        (
                          acc: Record<string, FieldOption[]>,
                          option: FieldOption
                        ) => {
                          if (!acc[option.category]) acc[option.category] = [];
                          acc[option.category].push(option);
                          return acc;
                        },
                        {} as Record<string, FieldOption[]>
                      )
                    ).map(([category, options]) => (
                      <div key={category} className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-50 rounded">
                          {category}
                        </div>
                        {(options as FieldOption[]).map(
                          (option: FieldOption) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                handleInputChange("field", option.value)
                              }
                              className={cn(
                                "w-full text-left p-3 rounded-lg border transition-all duration-200 hover:border-primary/50",
                                formData.field === option.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{option.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">
                                    {option.label}
                                  </div>
                                  {option.description && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {option.description}
                                    </div>
                                  )}
                                </div>
                                {formData.field === option.value && (
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                )}
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                  {showScrollIndicator && (
                    <div className="absolute bottom-0 left-0 right-0 h-14 z-10 bg-gradient-to-t from-white to-transparent pointer-events-none flex flex-col items-center justify-end pb-2">
                      <motion.div
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <div className="font-semibold mb-2">
                  개인정보 수집 및 이용 동의
                </div>
                <ul className="text-xs text-gray-600 mb-2 list-disc pl-4">
                  <li>수집 항목: 이름, 연락처, 학력, 분야</li>
                  <li>이용 목적: 상담 신청 및 관리, 서비스 제공</li>
                  <li>보유 기간: 신청일로부터 1년 또는 관련 법령에 따름</li>
                  <li>동의 거부 시 상담 신청이 제한될 수 있습니다.</li>
                </ul>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) =>
                      handleInputChange("consent", e.target.checked)
                    }
                    required
                  />
                  개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={
                !formData.name ||
                !validatePhone(formData.phone) ||
                !formData.experience ||
                !formData.field ||
                !formData.consent ||
                isSubmitting
              }
            >
              {isSubmitting ? "신청 중..." : "신청 완료"}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">
              신청이 완료되었습니다!
            </h3>
            <p className="text-gray-600 mb-4">
              담당자가 24시간 내에 연락드릴 예정입니다.
            </p>
            <div className="text-sm text-gray-500">
              <p>• 상담 확정 안내를 보내드립니다</p>
              <p>• 상담 전 준비사항을 미리 안내해드립니다</p>
            </div>
            <Button onClick={closeModal} className="mt-6">
              닫기
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CounselingModal;
