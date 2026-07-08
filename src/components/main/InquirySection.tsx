import styles from "./InquirySection.module.css";
import { BrochureButton, PartnerButton } from "@/components/common/CtaButtons";

/**
 * 메인 - 마지막 상담 CTA "한평생 에듀바이저스, 무료로 상담받아보세요"
 */
export default function InquirySection() {
  return (
    <section className={styles.section}>
      <div className={styles.textCol}>
        <h2 className={styles.title}>
          한평생 에듀바이저스,
          <br />
          무료로 상담받아보세요
        </h2>
        <p className={styles.subtitle}>
          더 높은 수익 구조와 체계적인 지원으로,
          <br className={styles.brMobile} /> 당신의 비즈니스 성장을 돕겠습니다.
        </p>
      </div>

      <div className={styles.buttons}>
        <BrochureButton className={`${styles.btn} ${styles.btnPrimary}`}>
          소개서 받기
        </BrochureButton>
        <PartnerButton className={`${styles.btn} ${styles.btnSecondary}`}>
          파트너 문의
        </PartnerButton>
      </div>
    </section>
  );
}
