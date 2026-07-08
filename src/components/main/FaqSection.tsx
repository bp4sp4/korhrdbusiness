"use client";

import { useState } from "react";
import styles from "./FaqSection.module.css";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Q. 왜 매출의 50%를 지급하나요?",
    a: "에듀바이저스는 영업자의 노력과 성과가 가장 큰 보상으로 이어져야 한다고 생각합니다. 불필요한 중간 마진과 조직 운영 구조를 최소화하여, 성과를 만든 컨설턴트에게 더 많은 수익이 돌아갈 수 있도록 매출의 50%를 지급하는 보상 체계를 운영하고 있습니다.",
  },
  {
    q: "Q. 누구나 지원할 수 있나요?",
    a: "교육 컨설턴트 또는 교육 상담 경험이 있으신 분이라면 누구나 지원하실 수 있습니다. 경력이 있으시다면 더욱 빠르게 활동을 시작하실 수 있도록 지원해드립니다.",
  },
  {
    q: "Q. 출근해야 하나요?",
    a: "아닙니다. 출퇴근에 얽매이지 않는 프리랜서 형태로 자유롭게 활동하실 수 있습니다. 시간과 장소에 구애받지 않고 본인의 일정에 맞춰 업무를 진행하시면 됩니다.",
  },
  {
    q: "Q. 초기 비용이 필요한가요?",
    a: "아닙니다. 가입비, 교육비, 초기 비용 등 어떠한 비용도 발생하지 않습니다. 기존에 하시던 업무 방식 그대로 활동하실 수 있도록 지원해드립니다.",
  },
  {
    q: "Q. 매출이 낮아도 50%를 지급받을 수 있나요?",
    a: "네. 가능합니다. 매출의 50% 지급은 최소 매출 조건이나 목표 달성과 관계없이 동일하게 적용됩니다.",
  },
  {
    q: "Q. 어떤 상품을 영업하게 되나요?",
    a: "1인 컨설턴트 등록 상담 후, 기존에 진행하시던 교육 과정과 최대한 동일하거나 유사한 상품을 영업하실 수 있도록 업무 환경을 세팅해드립니다.",
  },
  {
    q: "Q. 상담만 받아봐도 되나요?",
    a: "물론입니다. 업무 방식, 수익 구조, 활동 방법 등을 충분히 안내받으신 후 결정하셔도 됩니다. 부담 없이 편하게 상담을 신청해 주세요.",
  },
];

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M16.1524 5.02274C15.9414 4.81184 15.6553 4.69336 15.357 4.69336C15.0587 4.69336 14.7726 4.81184 14.5616 5.02274L8.99288 10.5915L3.42413 5.02274C3.21195 4.81782 2.92777 4.70442 2.6328 4.70698C2.33783 4.70955 2.05567 4.82786 1.84708 5.03645C1.6385 5.24503 1.52018 5.5272 1.51762 5.82217C1.51506 6.11714 1.62845 6.40132 1.83338 6.61349L8.1975 12.9776C8.40847 13.1885 8.69457 13.307 8.99288 13.307C9.29119 13.307 9.57728 13.1885 9.78825 12.9776L16.1524 6.61349C16.3633 6.40253 16.4818 6.11643 16.4818 5.81812C16.4818 5.51981 16.3633 5.23371 16.1524 5.02274Z" fill="#919191" />
    </svg>
  );
}

/**
 * 메인 - 자주 묻는 질문 (FAQ 아코디언)
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>자주 묻는 질문</h2>

      <div className={styles.list}>
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.q} className={styles.item}>
              <button
                type="button"
                className={`${styles.header} ${open ? styles.headerOpen : ""}`}
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span className={styles.question}>{faq.q}</span>
                <span className={`${styles.icon} ${open ? styles.iconOpen : ""}`}>
                  <ChevronIcon />
                </span>
              </button>
              {open && (
                <div className={styles.body}>
                  <p className={styles.answer}>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
