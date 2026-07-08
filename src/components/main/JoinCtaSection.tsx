import Image from "next/image";
import styles from "./JoinCtaSection.module.css";

/**
 * 메인 - 마무리 CTA "한평생 에듀바이저스와 함께하세요"
 * (한평생 에듀바이저스가 교육전문가를 지원합니다 섹션 아래)
 */
export default function JoinCtaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textCol}>
          <p className={styles.lead}>교육 전문가를 위한 단 하나의 플랫폼</p>
          <h2 className={styles.headline}>한평생 에듀바이저스와 함께하세요</h2>
        </div>

        <Image
          src="/images/main/gawith.png"
          alt="한평생 에듀바이저스와 함께하는 교육 전문가들"
          width={1583}
          height={741}
          className={styles.image}
          sizes="(max-width: 1465px) 100vw, 1465px"
        />
      </div>
    </section>
  );
}
