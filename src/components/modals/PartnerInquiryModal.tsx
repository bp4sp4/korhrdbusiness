import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { sendSlackNotification } from "@/lib/slack";
import { usePartnerModal } from "@/store/usePartnerModal";
import styles from "./CounselingModal.module.css";
import pStyles from "./PartnerInquiryModal.module.css";

const initialForm = {
  name: "",
  phone: "",
  consulting_content: "",
  current_status: "",
  question: "",
};

const PartnerInquiryModal = () => {
  const { isOpen, closeModal } = usePartnerModal();
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
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("partner_inquiries").insert([
        {
          name: formData.name,
          phone: formData.phone,
          consulting_content: formData.consulting_content,
          current_status: formData.current_status,
          question: formData.question,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw new Error(error.message);

      // 슬랙 알림 (실패해도 접수는 성공으로 처리)
      try {
        await sendSlackNotification("partner", {
          name: formData.name,
          phone: formData.phone,
          consulting_content: formData.consulting_content,
          current_status: formData.current_status,
          question: formData.question,
        });
      } catch (slackErr) {
        console.error("파트너 문의 슬랙 알림 전송 실패:", slackErr);
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
    !formData.consulting_content ||
    !formData.current_status ||
    !formData.question ||
    isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className={`${styles.dialogContent} ${pStyles.font14}`}
        onPointerDownOutside={(e) => e.preventDefault()}
        aria-describedby="partner-modal-desc"
      >
        <span id="partner-modal-desc" className={styles.srOnly}>
          파트너 문의 입력 폼입니다. 이름, 연락처, 컨설팅 컨텐츠, 현재상황,
          궁금한 내용을 입력하세요.
        </span>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>파트너 문의</DialogTitle>
        </DialogHeader>

        {!isSubmitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldsGroup}>
              <div className={styles.field}>
                <div className={styles.nameRow}>
                  <Label htmlFor="partner-name" className={styles.label}>
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
                  id="partner-name"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={styles.input}
                  autoComplete="off"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="partner-phone" className={styles.labelBlock}>
                  연락처 *
                </Label>
                <Input
                  id="partner-phone"
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
                <Label
                  htmlFor="partner-consulting"
                  className={styles.labelBlock}
                >
                  컨설팅 컨텐츠 *
                </Label>
                <Textarea
                  id="partner-consulting"
                  placeholder="운영 중이거나 운영하려는 컨설팅/콘텐츠를 알려주세요."
                  value={formData.consulting_content}
                  onChange={(e) =>
                    handleChange("consulting_content", e.target.value)
                  }
                  rows={2}
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="partner-status" className={styles.labelBlock}>
                  현재상황 *
                </Label>
                <Textarea
                  id="partner-status"
                  placeholder="현재 상황(경력, 조직 여부 등)을 간단히 적어주세요."
                  value={formData.current_status}
                  onChange={(e) =>
                    handleChange("current_status", e.target.value)
                  }
                  rows={2}
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="partner-question" className={styles.labelBlock}>
                  궁금한 내용 *
                </Label>
                <Textarea
                  id="partner-question"
                  placeholder="궁금한 점을 자유롭게 남겨주세요."
                  value={formData.question}
                  onChange={(e) => handleChange("question", e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className={styles.submitBtn}
              disabled={isDisabled}
            >
              {isSubmitting ? "문의 접수 중..." : "문의하기"}
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
                alt="문의 접수 완료"
                className={styles.successIcon}
                style={{ objectFit: "contain" }}
              />
            </motion.div>
            <h3 className={styles.successTitle}>문의가 접수되었어요</h3>
            <p className={styles.successDesc}>
              담당자가 확인 후 빠르게 연락드릴게요.
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

export default PartnerInquiryModal;
