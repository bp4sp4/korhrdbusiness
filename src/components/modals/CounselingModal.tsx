"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  User,
  MessageSquare,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import emailjs from "emailjs-com";
import { supabase } from "@/lib/supabase";
import { useCounselModal } from "@/store/useCounselModal";

interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  field: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: string;
  message: string;
  consent: boolean;
}

interface FieldOption {
  value: string;
  label: string;
  category: string;
  icon: string;
  description?: string;
}

const fieldOptions: FieldOption[] = [
  // ... (fieldOptions data remains the same)
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
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    field: "사회복지사 자격증",
    preferredDate: "",
    preferredTime: "",
    consultationType: "",
    message: "",
    consent: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalSteps = 3;

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          experience: "",
          field: "사회복지사 자격증",
          preferredDate: "",
          preferredTime: "",
          consultationType: "",
          message: "",
          consent: false,
        });
        setCurrentStep(1);
        setIsSubmitted(false);
        setEmailError("");
        setPhoneError("");
      }, 300); // Delay to allow closing animation
    }
  }, [isOpen]);

  useEffect(() => {
    const checkScroll = () => {
      const el = scrollRef.current;
      if (el) {
        setShowScrollIndicator(el.scrollHeight > el.clientHeight);
      }
    };

    // Check on initial render and when dependencies change
    checkScroll();

    // Also check if the content changes
    const observer = new MutationObserver(checkScroll);
    if (scrollRef.current) {
      observer.observe(scrollRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [isOpen, currentStep, formData.field]);

  const handleInputChange = (
    field: keyof ConsultationFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "email") {
      setEmailError(
        validateEmail(value) ? "" : "올바른 이메일 형식이 아닙니다."
      );
    }
    if (field === "phone") {
      setPhoneError(
        validatePhone(value)
          ? ""
          : "연락처는 숫자만 입력해주세요.(-)빼고 예: 01012345678"
      );
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from("consultations")
        .insert([{ ...formData, created_at: new Date().toISOString() }]);
      if (dbError) throw new Error(`DB 저장 실패: ${dbError.message}`);

      const templateParams = {
        title: "상담 신청",
        name: formData.name,
        message: formData.message,
        time: new Date().toLocaleString(),
        email: "bp3sp3@naver.com, bp4sp456@gmail.com",
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        experience: formData.experience,
        field: formData.field,
        consultationType: formData.consultationType,
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const consultationTypes = [
    {
      value: "커리어 전환",
      label: "커리어 전환",
      icon: <ArrowRight className="w-4 h-4" />,
    },
    {
      value: "이력서 검토",
      label: "이력서 검토",
      icon: <User className="w-4 h-4" />,
    },
    {
      value: "면접 준비",
      label: "면접 준비",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      value: "스킬 개발",
      label: "스킬 개발",
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  const educationLevels = ["고졸", "초대졸", "전문대졸", "4년제대졸"];
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{9,11}$/.test(phone);
  const getTomorrow = () =>
    new Date(Date.now() + 864e5).toISOString().split("T")[0];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollIndicator(
      target.scrollTop + target.clientHeight < target.scrollHeight - 2
    );
  };

  const renderStep = () => {
    // Switch case for steps remains the same
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                이메일 *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="hong@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full"
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
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
              />
              {phoneError && (
                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-sm font-medium">학력 *</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) =>
                  handleInputChange("experience", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="학력을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
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
                  onScroll={handleScroll}
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
                      {(options as FieldOption[]).map((option: FieldOption) => (
                        <button
                          key={option.value}
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
                      ))}
                    </div>
                  ))}
                </div>
                {/* Scroll indicator */}
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">상담 유형 *</Label>
              <div className="grid grid-cols-2 gap-2">
                {consultationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      handleInputChange("consultationType", type.value)
                    }
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border text-sm transition-all",
                      formData.consultationType === type.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  희망 날짜
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={getTomorrow()}
                  value={formData.preferredDate}
                  onChange={(e) =>
                    handleInputChange("preferredDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  희망 시간
                </Label>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value) =>
                    handleInputChange("preferredTime", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                추가 메시지
              </Label>
              <Textarea
                id="message"
                placeholder="상담받고 싶은 내용이나 궁금한 점을 자유롭게 작성해주세요..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="font-semibold mb-2">
                개인정보 수집 및 이용 동의
              </div>
              <ul className="text-xs text-gray-600 mb-2 list-disc pl-4">
                <li>
                  수집 항목: 이름, 이메일, 연락처, 경력, 분야, 상담유형, 메시지
                  등
                </li>
                <li>이용 목적: 상담 신청 및 관리, 서비스 제공</li>
                <li>보유 기간: 신청일로부터 1년 또는 관련 법령에 따름</li>
                <li>동의 거부 시 상담 신청이 제한될 수 있습니다.</li>
              </ul>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      consent: e.target.checked,
                    }))
                  }
                />
                개인정보 수집 및 이용에 동의합니다.
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.name &&
          validateEmail(formData.email) &&
          validatePhone(formData.phone)
        );
      case 2:
        return (
          formData.experience && formData.field && formData.consultationType
        );
      case 3:
        return formData.consent;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className="sm:max-w-[500px] p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>교육 상담 신청</DialogTitle>
          <DialogDescription>
            단계별로 정보를 입력해주세요. ({currentStep}/{totalSteps})
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="p-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <motion.div
                className="bg-primary h-2 rounded-full"
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                이전
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  다음 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit()}
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? "신청 중..." : "신청 완료"}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
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
              <p>• 이메일로 상담 확정 안내를 보내드립니다</p>
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
