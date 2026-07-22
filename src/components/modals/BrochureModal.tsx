import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBrochureModal } from "@/store/useBrochureModal";
import styles from "./CounselingModal.module.css";
import pStyles from "./PartnerInquiryModal.module.css";
import bStyles from "./BrochureModal.module.css";

const initialForm = {
  name: "",
  phone: "",
  email: "",
};

const BrochureModal = () => {
  const { isOpen, closeModal } = useBrochureModal();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData(initialForm);
        setIsSubmitted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 연락처 자동 하이픈 (010-XXXX-XXXX / 011-XXX-XXXX)
  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  const isValidPhone = (phone: string) =>
    /^(010\d{8}|011\d{7,8})$/.test(phone.replace(/\D/g, ""));

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "phone" ? formatPhone(value) : value,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (!isValidPhone(formData.phone)) {
      alert("연락처는 010 또는 011로 시작하는 번호로 정확히 입력해주세요.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      alert("이메일 주소를 정확히 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/brochure-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email.trim(),
        }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        throw new Error(result?.error || "전송 실패");
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    !formData.name ||
    !formData.phone ||
    !isValidPhone(formData.phone) ||
    !formData.email ||
    !isValidEmail(formData.email) ||
    isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className={`${styles.dialogContent} ${bStyles.compact} ${
          isSubmitted ? bStyles.successNarrow : ""
        } ${pStyles.font14}`}
        onPointerDownOutside={(e) => e.preventDefault()}
        aria-describedby="brochure-modal-desc"
      >
        <span id="brochure-modal-desc" className={styles.srOnly}>
          소개서 받기 입력 폼입니다. 이름, 연락처, 이메일을 입력하시면 입력하신
          이메일로 소개서를 보내드립니다.
        </span>
        {!isSubmitted ? (
          <DialogHeader className={styles.header}>
            <DialogTitle className={styles.title}>소개서 받기</DialogTitle>
          </DialogHeader>
        ) : (
          <DialogTitle className={styles.srOnly}>소개서 발송 완료</DialogTitle>
        )}

        {!isSubmitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldsGroup}>
              <div className={styles.field}>
                <div className={styles.nameRow}>
                  <Label htmlFor="brochure-name" className={styles.label}>
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
                  id="brochure-name"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="brochure-phone" className={styles.labelBlock}>
                  연락처 *
                </Label>
                <Input
                  id="brochure-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
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
                <Label htmlFor="brochure-email" className={styles.labelBlock}>
                  이메일 *
                </Label>
                <Input
                  id="brochure-email"
                  type="email"
                  inputMode="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={styles.input}
                  required
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className={styles.phoneError}>
                    이메일 주소를 정확히 입력해주세요.
                  </p>
                )}
                <p className={styles.hint}>
                  입력하신 이메일로 소개서 열람 링크를 보내드려요.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className={styles.submitBtn}
              disabled={isDisabled}
            >
              {isSubmitting ? "소개서 발송 중..." : "소개서 받기"}
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.successWrap}
          >
            <img
              src="/images/mail-sent.png"
              alt="소개서 발송 완료"
              className={styles.successIcon}
              style={{ objectFit: "contain" }}
            />
            <h3 className={styles.successTitle}>소개서를 보내드렸어요</h3>
            <p className={styles.successDesc}>
              입력하신 이메일에서 소개서 열람 버튼을 눌러 확인해주세요.
            </p>
            <Button onClick={closeModal} className={styles.confirmBtn}>
              확인
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrochureModal;
