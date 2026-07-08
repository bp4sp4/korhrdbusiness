import styles from "./GeneralGaCard.module.css";
import {
  IconChevronDown,
  IconStore,
  IconWallet,
  IconPeople,
  IconCoin,
} from "./icons";

const FEES = [
  { icon: <IconStore />, label: "컨텐츠 운영기관(교육원)", rate: "수수료 약 30%" },
  { icon: <IconWallet />, label: "영업조직 운영비", rate: "수수료 약 25%" },
  { icon: <IconPeople />, label: "조직관리자 수당", rate: "수수료 약 20%" },
  { icon: <IconCoin />, label: "적립금", rate: "수수료 약 5%" },
];

/** 비교 섹션 왼쪽 카드 — 일반 GA */
export default function GeneralGaCard() {
  return (
    <div className={styles.card}>
      {/* 헤더 */}
      <div className={styles.head}>
        <h3 className={styles.name}>일반 GA</h3>
        <span className={styles.tag}>중간 단계를 거친 복잡한 구조</span>
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

        <span className={styles.arrow}>
          <IconChevronDown id="ga-arrow-1" />
        </span>

        {/* 수수료 항목 */}
        <div className={styles.fees}>
          {FEES.map((fee) => (
            <div key={fee.label} className={styles.feeRow}>
              <span className={styles.feeIcon}>{fee.icon}</span>
              <span className={styles.feeLabel}>{fee.label}</span>
              <span className={styles.feeBadge}>{fee.rate}</span>
            </div>
          ))}
        </div>

        <span className={styles.arrow}>
          <IconChevronDown id="ga-arrow-2" />
        </span>

        {/* 최종수령액 */}
        <div className={styles.box}>
          <div className={styles.finalInner}>
            <span className={styles.boxLabel}>최종수령액</span>
            <span className={styles.finalValue}>약 250만원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
