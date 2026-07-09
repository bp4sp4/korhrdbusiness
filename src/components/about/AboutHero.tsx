import styles from "./AboutHero.module.css";
import { BrochureButton, PartnerButton } from "@/components/common/CtaButtons";

/**
 * 회사소개 상단 히어로 (메인 히어로와 동일 스타일)
 * - 배경 이미지(기존 aboutbackground.jpg) + 좌측 다크 그라디언트
 * - 좌측 정렬 흰색 타이틀 / 서브텍스트 / CTA 버튼 2개
 */
export default function AboutHero() {
  return (
    <section className={styles.hero}>
      {/* 배경 이미지 (기존) */}
      <div className={styles.bg} aria-hidden="true" />

      {/* 좌측 다크 그라디언트 */}
      <div className={styles.gradient} aria-hidden="true" />

      {/* 콘텐츠 */}
      <div className={styles.content}>
        <div className={styles.textGroup}>
          <h1 className={styles.title}>
            당신의 교육 비즈니스를
            <br />더 자유롭게.
          </h1>
          <p className={styles.subtitle}>
            교육 컨설팅 · 콘텐츠를 자유롭게 운영할 수 있는 파트너, 에듀바이저스에
            합류하세요
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
