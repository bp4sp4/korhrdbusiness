import Image from "next/image";
import styles from "./PayoutBanner.module.css";

/**
 * 메인 - "에듀바이저스에서는 매출의 50%를 드립니다" 배너
 * (혹시 이런 고민을 하고 계신가요? 섹션 아래)
 */
export default function PayoutBanner() {
  return (
    <section className={styles.banner}>
      {/* 배경 */}
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.inner}>
        {/* 텍스트 */}
        <div className={styles.textCol}>
          <h2 className={styles.title}>
            에듀바이저스에서는
            <br />
            <span className={styles.highlight}>매출의 50%</span>를 드립니다.
          </h2>
          <p className={styles.subtitle}>
            투명한 구조, 정직한 보상으로
            <br className={styles.brDesktop} /> 교육 전문가가{" "}
            <br className={styles.brMobile} />더 자유롭게 성장할 수 있는 환경을
            만듭니다.
          </p>
        </div>

        {/* 50% 이미지 */}
        <Image
          src="/images/main/ga50.png"
          alt="매출의 50%"
          width={300}
          height={235}
          className={styles.badge}
        />
      </div>
    </section>
  );
}
