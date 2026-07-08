import Image from "next/image";
import styles from "./AboutCtaBanner.module.css";
import { BrochureButton, PartnerButton } from "@/components/common/CtaButtons";

/**
 * 회사소개 - CTA 배너 "함께하실 분을 찾습니다"
 * 좌: 다크 배경 + 텍스트 / 우: 이미지 (반반 분할)
 */
export default function AboutCtaBanner() {
  return (
    <section className={styles.banner}>
      {/* 좌측 - 텍스트 */}
      <div className={styles.left}>
        <div className={styles.content}>
          <div className={styles.textGroup}>
            <h2 className={styles.title}>
              한평생 에듀바이저스와
              <br />
              함께하실 분을 찾습니다.
            </h2>
            <p className={styles.subtitle}>
              판매 실적이 아닌, 고객만족 중심의
              <br className={styles.brMobile} /> 파격적인 보상을 드립니다.
              <br />
              <br className={styles.brMobile} />
              오직 고객 만족에만 집중할 수 있는 업무 환경과
              <br className={styles.brMobile} /> 최고의 복리후생을 제공합니다.
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
      </div>

      {/* 우측 - 이미지 */}
      <div className={styles.right}>
        <Image
          src="/images/about/aboutcta.jpg"
          alt="함께 논의하는 에듀바이저 팀"
          fill
          className={styles.image}
          sizes="50vw"
        />
      </div>
    </section>
  );
}
