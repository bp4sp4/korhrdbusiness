import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./AboutValueSection.module.css";

type Value = {
  no: string;
  title: ReactNode;
  desc: ReactNode;
  image: string;
  imageAlt: string;
};

const VALUES: Value[] = [
  {
    no: "01",
    title: (
      <>
        <span className={styles.blue}>
          영업에만
          <br />
          집중
        </span>
        <span className={styles.dark}>할 수 있도록</span>
      </>
    ),
    desc: (
      <>
        <p className={styles.descP}>
          복잡한 운영과 관리 업무는 저희가 함께합니다.
        </p>
        <p className={styles.descP}>
          에듀바이저스는 학습자를 만나고 상담하는
          <br /> 가장 중요한 일,{" "}
          <strong className={styles.strong}>
            영업에만 집중할 수 있도록
          </strong>{" "}
          <br />
          든든하게 지원합니다.
        </p>
      </>
    ),
    image: "/images/about/value01.jpg",
    imageAlt: "상담 중인 에듀바이저",
  },
  {
    no: "02",
    title: (
      <>
        <span className={styles.dark}>혼자가 아닌</span>
        <br />
        <span className={styles.blue}>함께 시작하는 환경</span>
      </>
    ),
    desc: (
      <>
        <p className={styles.descP}>
          새로운 시작이 부담스럽지 않도록 교육 콘텐츠와
          <br /> 운영 시스템, 업무 지원을 함께 제공합니다.
        </p>
        <p className={styles.descP}>
          혼자 모든 것을 해결하는 것이 아니라, 영업에 집중할 수
          <br className={styles.brDeskOnly} /> 있는 환경을 만들어드립니다.
        </p>
        <p className={styles.descP}>
          에듀바이저스는{" "}
          <strong className={styles.strong}>함께 시작하는 파트너</strong>가
          되고자 합니다.
        </p>
      </>
    ),
    image: "/images/about/value02.jpg",
    imageAlt: "함께 논의하는 팀",
  },
  {
    no: "03",
    title: (
      <>
        <span className={styles.dark}>노력한 만큼</span>
        <br />
        <span className={styles.blue}>보상받을 수 있도록</span>
      </>
    ),
    desc: (
      <>
        <p className={styles.descP}>
          고객을 만나고 계약을 만드는 사람은 영업자입니다.
        </p>
        <p className={styles.descP}>
          그래서 노력한 만큼 더 가져갈 수 있는 구조를 만들었고,{" "}
          <br className={styles.brDeskOnly} />
          <strong className={styles.strong}>매출의 50%를 수수료로 지급</strong>
          합니다.
        </p>
        <p className={styles.descP}>
          앞으로의 성장을 에듀바이저스가 함께합니다.
        </p>
      </>
    ),
    image: "/images/about/value03.jpg",
    imageAlt: "성장하는 에듀바이저",
  },
];

/**
 * 회사소개 - 에듀바이저스만의 가치 (3개 가치 카드)
 */
export default function AboutValueSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>에듀바이저스만의 가치</h2>

      <div className={styles.cards}>
        {VALUES.map((v) => (
          <div key={v.no} className={styles.card}>
            <div className={styles.info}>
              <span className={styles.badge}>{v.no}</span>
              <h3 className={styles.title}>{v.title}</h3>
              <div className={styles.desc}>{v.desc}</div>
            </div>

            <div className={styles.thumbWrap}>
              <Image
                src={v.image}
                alt={v.imageAlt}
                fill
                className={styles.thumb}
                sizes="(max-width: 900px) 100vw, 560px"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
