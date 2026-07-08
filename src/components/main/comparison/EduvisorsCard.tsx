import styles from "./EduvisorsCard.module.css";
import { IconVerticalLine, IconChevronDownWhite } from "./icons";

/** 비교 섹션 오른쪽 카드 — 에듀바이저스 */
export default function EduvisorsCard() {
  return (
    <div className={styles.card}>
      {/* 헤더 */}
      <div className={styles.head}>
        <h3 className={styles.name}>에듀바이저스</h3>
        <span className={styles.tag}>중간단계 없이 투명한 구조</span>
      </div>

      {/* 본문 */}
      <div className={styles.body}>
        {/* 매출 */}
        <div className={styles.box}>
          <div className={styles.boxInner}>
            <span className={styles.boxLabel}>매출</span>
            <span className={styles.boxValue}>1000만원 발생시</span>
          </div>
        </div>

        {/* 중앙 세로 라인 + 화살표 + 플로팅 텍스트 */}
        <div className={styles.lineWrap}>
          <IconVerticalLine id="edu-vline" />
          <div className={styles.floatText}>
            수수료 50%
            <br />
            바로 지급
          </div>
          <span className={styles.chevron}>
            <IconChevronDownWhite id="edu-arrow" />
          </span>
        </div>

        {/* 최종 지급액 */}
        <div className={styles.finalBox}>
          <span className={styles.finalDesc}>
            수수료없이 매출의 50%를 그대로 지급
          </span>
          <span className={styles.finalValue}>500만원</span>
        </div>
      </div>
    </div>
  );
}
