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

// 직접입력 옵션 식별용 상수
const CUSTOM_FIELD_VALUE = "직접입력";

const fieldOptions: FieldOption[] = [
  {
    value: "사회복지사 자격증",
    label: "사회복지사 자격증",
    category: "자격증",
    icon: "",
  },
  {
    value: "보육교사 자격증",
    label: "보육교사 자격증",
    category: "자격증",
    icon: "",
  },
  {
    value: "평생교육사",
    label: "평생교육사",
    category: "자격증",
    icon: "",
  },
  {
    value: "편입/대학원",
    label: "편입/대학원",
    category: "자격증",
    icon: "",
  },
  {
    value: "청소년지도사",
    label: "청소년지도사",
    category: "자격증",
    icon: "",
  },
  {
    value: CUSTOM_FIELD_VALUE,
    label: "직접입력",
    category: "자격증",
    icon: "",
  },
];

const CounselingModal = () => {
  const { isOpen, closeModal } = useCounselModal();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience: "고등학교 졸업",
    field: "",
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  // 관심분야(복수선택) 상태
  const [fieldList, setFieldList] = useState<string[]>([]);
  const [isCustomField, setIsCustomField] = useState(false);
  const [customFieldValue, setCustomFieldValue] = useState("");

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          experience: "",
          field: "",
          consent: false,
        });
        setIsSubmitted(false);
        setFieldList([]);
        setIsCustomField(false);
        setCustomFieldValue("");
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

  // 연락처 자동 하이픈 포맷 (010-XXXX-XXXX / 011-XXX-XXXX)
  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    if (d.length <= 10)
      return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  // 010(11자리) 또는 011(10~11자리)만 허용
  const isValidPhone = (phone: string) =>
    /^(010\d{8}|011\d{7,8})$/.test(phone.replace(/\D/g, ""));

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    if (field === "phone" && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        [field]: formatPhone(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // 선택된 관심분야 항목들을 formData.field 문자열로 동기화
  const syncField = (list: string[], custom: boolean, customVal: string) => {
    const parts = [...list];
    if (custom && customVal.trim()) parts.push(customVal.trim());
    handleInputChange("field", parts.join(", "));
  };

  const toggleField = (value: string) => {
    const next = fieldList.includes(value)
      ? fieldList.filter((v) => v !== value)
      : [...fieldList, value];
    setFieldList(next);
    syncField(next, isCustomField, customFieldValue);
  };

  const toggleCustomField = () => {
    const next = !isCustomField;
    setIsCustomField(next);
    syncField(fieldList, next, customFieldValue);
  };

  const handleCustomFieldChange = (value: string) => {
    setCustomFieldValue(value);
    syncField(fieldList, isCustomField, value);
  };

  const educationLevels = [
    "고졸",
    "2년제 중퇴",
    "2년제 졸업",
    "3년제 중퇴",
    "3년제 졸업",
    "4년제 중퇴",
    "4년제 졸업",
    "대학원 이상",
    "대학교졸업(외국)",
  ];

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (!isValidPhone(formData.phone)) {
      alert("연락처는 010 또는 011로 시작하는 번호로 정확히 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. 데이터베이스에 저장
      const { error: dbError } = await supabase
        .from("consultations")
        .insert([{ ...formData, created_at: new Date().toISOString() }]);
      if (dbError) throw new Error(`DB 저장 실패: ${dbError.message}`);

      // 2. 학점은행제 사업부 문의 DB(KorhrdGroupDB)로 전송
      //    실패해도 신청 자체는 완료 처리(자체 DB + 슬랙은 이미 저장됨)
      try {
        const res = await fetch("/api/hakjeom-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            contact: formData.phone,
            education: formData.experience,
            hope_course: formData.field,
            // 유입경로 → 대분류: 에듀바이저스 / 중분류: 상담폼 ("대분류_중분류" 형식)
            click_source: "에듀바이저스_상담폼",
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("학점은행제 문의 DB 전송 실패:", err);
        }
      } catch (groupErr) {
        console.error("학점은행제 문의 DB 전송 중 오류:", groupErr);
      }

      // 3. Slack 알림 전송
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
                {formData.phone && !isValidPhone(formData.phone) && (
                  <p className="text-xs text-red-500 mt-1">
                    010 또는 011로 시작하는 번호를 정확히 입력해주세요.
                  </p>
                )}
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
                    <SelectValue placeholder="최종학력을 선택해주세요" />
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
                    (여러 개 선택 가능)
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
                          (option: FieldOption) => {
                            const isCustomOption =
                              option.value === CUSTOM_FIELD_VALUE;
                            const isSelected = isCustomOption
                              ? isCustomField
                              : fieldList.includes(option.value);
                            return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                isCustomOption
                                  ? toggleCustomField()
                                  : toggleField(option.value)
                              }
                              className={cn(
                                "w-full text-left p-2 rounded-lg border transition-all duration-200 hover:border-primary/50 flex items-center gap-3",
                                isSelected
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border"
                              )}
                            >
                              {/* 왼쪽 체크박스/체크아이콘 */}
                              {isSelected ? (
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
                            );
                          }
                        )}
                      </div>
                    ))}
                  </div>
                  {/* 직접입력 선택 시 한 줄 입력창 */}
                  {isCustomField && (
                    <Input
                      id="counsel-custom-field-input"
                      placeholder="관심 분야를 직접 입력해주세요"
                      value={customFieldValue}
                      onChange={(e) => handleCustomFieldChange(e.target.value)}
                      className="mt-2 w-full text-base h-10 text-[14px] placeholder:text-[14px]"
                      autoComplete="off"
                    />
                  )}
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
                !isValidPhone(formData.phone) ||
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center px-6 py-10 md:py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-14 h-14 text-[#2B7FFF] mb-5" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-1.5">신청이 완료되었어요</h3>
            <p className="text-sm text-gray-500 mb-7">
              담당자가 일주일 내에 연락드릴게요.
            </p>
            <Button
              onClick={closeModal}
              className="w-full h-11 text-[15px] bg-[#2B7FFF] hover:bg-[#2B7FFF]/80"
            >
              확인
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
