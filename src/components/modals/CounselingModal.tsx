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
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useCounselModal } from "@/store/useCounselModal";
import {
  sendSlackNotification,
  createCounselingNotification,
} from "@/lib/slack";
import "driver.js/dist/driver.css";

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
    category: "자격증",
    icon: "",
    description: "사회복지 전문가 양성",
  },
  {
    value: "보육교사 자격증",
    label: "보육교사 자격증",
    category: "자격증",
    icon: "",
    description: "영유아 보육 전문가",
  },
  {
    value: "한국어교원 자격증",
    label: "한국어교원 자격증",
    category: "자격증",
    icon: "",
    description: "한국어 교육 전문가",
  },
  {
    value: "평생교육사 자격증",
    label: "평생교육사 자격증",
    category: "자격증",
    icon: "",
    description: "성인 교육 전문가",
  },
  {
    value: "종합미용면허증",
    label: "종합미용면허증",
    category: "자격증",
    icon: "",
    description: "미용 전문가 면허",
  },
  {
    value: "산업기사/기사 응시자격",
    label: "산업기사/기사 응시자격",
    category: "자격증",
    icon: "",
    description: "기술 전문가 자격",
  },
  {
    value: "요양보호사자격증",
    label: "요양보호사자격증",
    category: "자격증",
    icon: "",
    description: "노인 돌봄 전문가",
  },
  {
    value: "청소년지도사2급",
    label: "청소년지도사2급",
    category: "자격증",
    icon: "‍",
    description: "청소년 교육 지도",
  },
  {
    value: "장애인영유아보육교사",
    label: "장애인영유아보육교사",
    category: "자격증",
    icon: "",
    description: "특수 보육 전문가",
  },
  {
    value: "심리학사",
    label: "심리학사",
    category: "학위/편입",
    icon: "",
    description: "심리학 학사 학위",
  },
  {
    value: "2/4년제 학위취득",
    label: "2/4년제 학위취득",
    category: "학위/편입",
    icon: "",
    description: "대학 학위 취득",
  },
  {
    value: "편입학/대졸자전형",
    label: "편입학/대졸자전형",
    category: "학위/편입",
    icon: "",
    description: "대학 편입 준비",
  },
  {
    value: "노인분야자격증",
    label: "노인분야자격증",
    category: "노인분야자격증",
    icon: "",
    description:
      "병원동행매니저1급, 실버인지활동지도사1급, 노인돌봄생활지원사1급",
  },
  {
    value: "아동분야자격증",
    label: "아동분야자격증",
    category: "아동분야 자격증",
    icon: "‍",
    description:
      "방과후아동지도사1급, 지역아동교육지도사1급, 방과후돌봄교실지도사1급",
  },
];

const CounselingModal = () => {
  const { isOpen, closeModal } = useCounselModal();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience: "고등학교 졸업",
    field: "사회복지사 자격증",
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          experience: "고등학교 졸업",
          field: "사회복지사 자격증",
          consent: false,
        });
        setIsSubmitted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    if (isOpen) {
      setTimeout(() => {
        checkScrollIndicator();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.blur();
    }
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.blur();
    }
    if (isOpen) {
      setTimeout(() => {
        if (nameInputRef.current) nameInputRef.current.blur();
        if (inputRef.current) inputRef.current.blur();
      }, 150);
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
    if (field === "phone" && typeof value === "string") {
      const sanitizedValue = value.replace(/[^0-9-]/g, "");
      setFormData((prev) => ({
        ...prev,
        [field]: sanitizedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const educationLevels = ["고등학교 졸업", "2·3년제 대졸", "4년제 대졸"];

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // 1. 데이터베이스에 저장
      const { error: dbError } = await supabase
        .from("consultations")
        .insert([{ ...formData, created_at: new Date().toISOString() }]);
      if (dbError) throw new Error(`DB 저장 실패: ${dbError.message}`);

      // 2. Slack 알림 전송
      const slackMessage = createCounselingNotification(formData);
      await sendSlackNotification(slackMessage);

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className="
          max-w-full sm:max-w-[500px]
          p-0
          z-[999]
          h-[78vh] md:h-auto
          md:overflow-y-visible
          w-[350px]
          md:w-[500px]
        "
        onPointerDownOutside={(e) => e.preventDefault()}
        aria-describedby="counsel-modal-desc"
      >
        <span id="counsel-modal-desc" className="sr-only">
          상담신청을 위한 입력 폼입니다. 이름, 연락처, 학력, 관심분야, 개인정보
          동의를 입력하세요.
        </span>
        <DialogHeader className="p-2 md:pt-4 pb-0">
          <DialogTitle className="text-lg font-bold text-center md:text-[20px] pt-2">
            교육 상담 신청
          </DialogTitle>
        </DialogHeader>
        {!isSubmitted ? (
          <form
            className="p-4 md:p-6 space-y-4 md:space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <div className="md:space-y-2">
                <div className="w-full md:h-10  flex items-center justify-between">
                  <Label htmlFor="name" className="text-sm font-medium">
                    이름 *
                  </Label>

                  <div className="flex items-center justify-center">
                    <img
                      src="/images/logo2.png"
                      alt="logo"
                      className="w-3 h-3 md:w-3 md:h-3"
                    />
                    <span
                      className="ml-1 font-bold  text-gray-800 tracking-wide text-[14px] md:text-[14px]"
                      style={{ fontFamily: "Toss Product Sans" }}
                    >
                      Eduvisors
                    </span>
                  </div>
                </div>
                <Input
                  ref={nameInputRef}
                  id="counsel-name-input"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full text-base h-10 text-[14px] placeholder:text-[14px]"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="md:space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  연락처 *
                </Label>
                <Input
                  ref={inputRef}
                  id="counsel-phone-input"
                  type="tel"
                  inputMode="numeric"
                  autoFocus={false}
                  placeholder="연락처를 다시 한 번 확인해 주세요"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full text-base md:h-10 font-[14px] placeholder:text-[14px]"
                  required
                />
              </div>
              <div className="md:space-y-2">
                <Label className="text-sm font-medium">
                  최종학력 *
                  <span className="text-xs text-gray-400">
                    (최종학력마다 과정이 조금씩 달라져요!)
                  </span>
                </Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) =>
                    handleInputChange("experience", value)
                  }
                  required
                >
                  <SelectTrigger id="counsel-experience-select">
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
              <div className="md:space-y-2">
                <Label className="text-sm font-medium">
                  관심 분야*
                  <span className="text-xs text-gray-400">
                    (아래로 스크롤해 더 많은 항목을 확인하세요)
                  </span>
                </Label>
                <div id="counsel-field-select" className="relative">
                  <div
                    ref={scrollRef}
                    className="grid grid-cols-1 sm:grid-cols-1 gap-2 md:max-h-60 max-h-40 overflow-y-auto border rounded-lg p-2 scrollbar-hide"
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
                                "w-full text-left p-2 rounded-lg border transition-all duration-200 hover:border-primary/50 flex items-center gap-3",
                                formData.field === option.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border"
                              )}
                            >
                              {/* 왼쪽 체크박스/체크아이콘 */}
                              {formData.field === option.value ? (
                                <img
                                  src="/images/check.png"
                                  alt="check"
                                  className="w-5 h-5 mr-3"
                                />
                              ) : (
                                <span className="inline-block w-5 h-5 mr-3 border-2 border-gray-300 rounded"></span>
                              )}
                              {/* 텍스트 영역 */}
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
              <div className="p-2 bg-gray-50 rounded-lg border">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    id="counsel-consent-checkbox"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) =>
                      handleInputChange("consent", e.target.checked)
                    }
                    required
                  />
                  개인정보 수집 및 이용에 동의합니다.
                  <button
                    type="button"
                    className="ml-2 text-xs underline text-primary hover:text-primary/80"
                    onClick={() => setShowTerms(true)}
                  >
                    자세히 보기
                  </button>
                </label>
              </div>
            </div>
            <Button
              id="counsel-submit-btn"
              type="submit"
              className="w-full text-base text-[14px] md:h-11 h-11 md:text-[16px] bg-[#2B7FFF] hover:bg-[#2B7FFF]/80"
              disabled={
                !formData.name ||
                !formData.phone ||
                !formData.experience ||
                !formData.field ||
                !formData.consent ||
                isSubmitting
              }
            >
              {isSubmitting ? "신청 중..." : "신청하기"}
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 md:p-8"
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
              담당자가 일주일 내에 연락드릴 예정입니다.
            </p>
            <div className="text-sm text-gray-500">
              <p>• 상담 확정 안내를 보내드립니다</p>
              <p>• 상담 전 준비사항을 미리 안내해드립니다</p>
            </div>
            <Button onClick={closeModal} className="mt-6 ">
              닫기
            </Button>
          </motion.div>
        )}
      </DialogContent>
      {/* 약관 모달 */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-md z-1001">
          <DialogHeader>
            <DialogTitle>개인정보 수집 및 이용 동의</DialogTitle>
          </DialogHeader>
          <div className="text-xs text-gray-600 space-y-2">
            <ul className="list-disc pl-4 mb-2">
              <li>수집 항목: 이름, 연락처, 학력, 분야</li>
              <li>이용 목적: 상담 신청 접수 및 관리, 서비스 제공</li>
              <li>
                보유 및 이용 기간: 신청일로부터 1년 또는 관련 법령(전자상거래
                등에서의 소비자 보호에 관한 법률 등)에 따라 보관될 수 있으며,
                보유 기간 경과 시 즉시 파기합니다.
              </li>
              <li>동의 거부 시 상담 신청이 제한될 수 있습니다.</li>
            </ul>
          </div>
          <Button
            onClick={() => setShowTerms(false)}
            className="w-full mt-4 bg-[#2B7FFF] hover:bg-[#2B7FFF]/80"
          >
            닫기
          </Button>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default CounselingModal;
