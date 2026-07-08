import Image from "next/image";
import styles from "./HeroSection.module.css";
import { BrochureButton, PartnerButton } from "@/components/common/CtaButtons";

/**
 * 메인 상단 히어로 섹션 (신규 디자인)
 * - 배경: /images/main/main.png (cover)
 * - 상단 파란 그라디언트 위에 헤드라인 / 서브텍스트 / CTA 버튼 2개
 */
export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* 배경 이미지 */}
      <Image
        src="/images/main/main.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.bgImage}
      />

      {/* 상단 파란 그라디언트 */}
      <div className={styles.gradient} aria-hidden="true" />

      {/* 콘텐츠 */}
      <div className={styles.content}>
        <div className={styles.textGroup}>
          <h1 className={styles.headline}>
            당신이 만든 성과,
            <br />
            이제는 더 많이 가져가세요.
          </h1>
          <p className={styles.subtitle}>
            매출의 50%를 보장해 드리는 에듀바이저스에 합류하세요
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
      </div>
    </section>
  );
}
