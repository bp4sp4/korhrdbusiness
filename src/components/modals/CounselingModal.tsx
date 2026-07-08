import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
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
import { sendSlackNotification } from "@/lib/slack";
import "driver.js/dist/driver.css";
import styles from "./CounselingModal.module.css";

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
    value: string | boolean,
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

      // 3. Slack 알림 전송 (메시지는 서버에서 조립)
      await sendSlackNotification("counseling", {
        name: formData.name,
        phone: formData.phone,
        experience: formData.experience,
        field: formData.field,
      });

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
        className={styles.dialogContent}
        onPointerDownOutside={(e) => e.preventDefault()}
        aria-describedby="counsel-modal-desc"
      >
        <span id="counsel-modal-desc" className={styles.srOnly}>
          상담신청을 위한 입력 폼입니다. 이름, 연락처, 학력, 관심분야, 개인정보
          동의를 입력하세요.
        </span>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>교육 상담 신청</DialogTitle>
        </DialogHeader>
        {!isSubmitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldsGroup}>
              <div className={styles.field}>
                <div className={styles.nameRow}>
                  <Label htmlFor="name" className={styles.label}>
                    이름 *
                  </Label>

                  <div className={styles.brand}>
                    <img
                      src="/images/logo2.png"
                      alt="logo"
                      className={styles.brandLogo}
                    />
                    <span
                      className={styles.brandName}
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
                  className={styles.input}
                  required
                  autoComplete="off"
                />
              </div>
              <div className={styles.field}>
                <Label htmlFor="phone" className={styles.labelBlock}>
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
                  className={styles.input}
                  required
                />
                {formData.phone && !isValidPhone(formData.phone) && (
                  <p className={styles.phoneError}>
                    010 또는 011로 시작하는 번호를 정확히 입력해주세요.
                  </p>
                )}
              </div>
              <div className={styles.field}>
                <Label className={styles.labelBlock}>
                  최종학력 *
                  <span className={styles.hint}>
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
                  <SelectContent className={styles.selectContent}>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={styles.field}>
                <Label className={styles.labelBlock}>
                  관심 분야*
                  <span className={styles.hint}>(여러 개 선택 가능)</span>
                </Label>
                <div
                  id="counsel-field-select"
                  className={styles.fieldSelectWrap}
                >
                  <div
                    ref={scrollRef}
                    className={styles.fieldScroll}
                    onScroll={checkScrollIndicator}
                  >
                    {Object.entries(
                      fieldOptions.reduce(
                        (
                          acc: Record<string, FieldOption[]>,
                          option: FieldOption,
                        ) => {
                          if (!acc[option.category]) acc[option.category] = [];
                          acc[option.category].push(option);
                          return acc;
                        },
                        {} as Record<string, FieldOption[]>,
                      ),
                    ).map(([category, options]) => (
                      <div key={category} className={styles.category}>
                        <div className={styles.categoryLabel}>{category}</div>
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
                                  styles.option,
                                  isSelected && styles.optionSelected,
                                )}
                              >
                                {/* 왼쪽 체크박스/체크아이콘 */}
                                {isSelected ? (
                                  <img
                                    src="/images/check.png"
                                    alt="check"
                                    className={styles.checkIcon}
                                  />
                                ) : (
                                  <span className={styles.checkbox}></span>
                                )}
                                {/* 텍스트 영역 */}
                                <div className={styles.optionText}>
                                  <div className={styles.optionLabel}>
                                    {option.label}
                                  </div>
                                  {option.description && (
                                    <div className={styles.optionDesc}>
                                      {option.description}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          },
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
                      className={styles.customInput}
                      autoComplete="off"
                    />
                  )}
                  {showScrollIndicator && (
                    <div className={styles.scrollIndicator}>
                      <motion.div
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowDown className={styles.arrowIcon} />
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.consentBox}>
                <label className={styles.consentLabel}>
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
                    className={styles.termsBtn}
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
              className={styles.submitBtn}
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
            className={styles.successWrap}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <img
                src="/complete-check.png"
                alt="신청 완료"
                className={styles.successIcon}
                style={{ objectFit: "cover" }}
              />
            </motion.div>
            <h3 className={styles.successTitle}>신청이 완료되었어요</h3>
            <p className={styles.successDesc}>
              담당자가 일주일 내에 연락드릴게요.
            </p>
            <Button onClick={closeModal} className={styles.confirmBtn}>
              확인
            </Button>
          </motion.div>
        )}
      </DialogContent>
      {/* 약관 모달 */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className={styles.termsContent}>
          <DialogHeader>
            <DialogTitle>개인정보 수집 및 이용 동의</DialogTitle>
          </DialogHeader>
          <div className={styles.termsBody}>
            <ul className={styles.termsList}>
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
            className={styles.termsCloseBtn}
          >
            닫기
          </Button>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default CounselingModal;
