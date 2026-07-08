import Image from "next/image";
import styles from "./ComparisonSection.module.css";
import GeneralGaCard from "./comparison/GeneralGaCard";
import EduvisorsCard from "./comparison/EduvisorsCard";

/**
 * 메인 - "중간 단계 없이 바로 지급" 비교 섹션
 * - 배경 그라디언트 + gabackground.png 텍스처(multiply)
 * - 헤더 + gaitem.png (일반 GA vs 에듀바이저스 수수료 비교 이미지)
 */
export default function ComparisonSection() {
  return (
    <section className={styles.section}>
      {/* 배경 텍스처 */}
      <div className={styles.bg} aria-hidden="true" />

      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>중간 단계 없이 바로 지급</h2>
        <p className={styles.subtitle}>
          정당한 보상을 받기 어려운 복잡한 구조대신,
          <br className={styles.brMobile} /> 중간단계 없이 바로 내 매출의 50%를
          수익으로
        </p>
      </div>

      {/* 비교 카드 (왼쪽: 일반 GA / 오른쪽: 에듀바이저스) */}
      <div className={styles.cards}>
        <GeneralGaCard />

        {/* 가운데 - 2배 차이 + 곡선 화살표 */}
        <div className={styles.center}>
          <Image
            src="/images/main/curvedarrow.png"
            alt=""
            width={284}
            height={193}
            className={styles.curvedArrow}
          />
          <span className={styles.multiplier}>2배 차이</span>
        </div>

        <EduvisorsCard />
      </div>
    </section>
  );
}
