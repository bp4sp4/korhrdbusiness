"use client";

import Image from "next/image";
import "@/app/main.css";
import { motion, Easing } from "framer-motion";
import { useEffect, useState } from "react";
import { useCounselModal } from "@/store/useCounselModal";
import styles from "./HomePageClient.module.css";

export default function HomePageClient() {
  const { openModal } = useCounselModal();

  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as Easing,
      },
    },
  };

  function ArrowBlink() {
    const [active, setActive] = useState(true);
    useEffect(() => {
      const interval = setInterval(() => {
        setActive((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }, []);
    return (
      <span className={styles.arrowWrap}>
        <Image
          src="/images/main/arrow_action.png"
          width={22}
          height={11}
          alt="활성 화살표"
          className={`${styles.arrowImg} ${
            active ? styles.arrowVisible : styles.arrowHiddenUp
          }`}
        />
        <Image
          src="/images/main/arrow_beaction.png"
          width={22}
          height={11}
          alt="비활성 화살표"
          className={`${styles.arrowImg} ${
            !active ? styles.arrowVisible : styles.arrowHiddenDown
          }`}
        />
      </span>
    );
  }

  return (
    <main className={`main ${styles.root}`}>
      {/* 구조화된 데이터 (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "에듀바이저스",
            alternateName: ["한평생 에듀바이저스", "한평생에듀바이저스"],
            description:
              "에듀바이저스(한평생 에듀바이저스)는 1:1 맞춤형 커리어 설계와 실무 중심 교육을 통해 성공적인 취업과 커리어 개발을 돕는 교육 서비스입니다. 자격증, 유학 프로그램까지 한평생교육의 전문가가 함께합니다.",
            url: "https://www.eduvisor.kr",
            logo: "https://www.eduvisor.kr/images/logo2.png",
            address: {
              "@type": "PostalAddress",
              addressCountry: "KR",
              addressLocality: "서울",
              addressRegion: "서울특별시",
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              availableLanguage: "Korean",
            },
            sameAs: ["https://www.eduvisor.kr"],
            keywords:
              "에듀바이저스, 한평생 에듀바이저스, 커리어 설계, 자격증 교육, 유학 프로그램",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "교육 서비스",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "커리어 설계 상담",
                    description: "1:1 맞춤형 커리어 설계 상담 서비스",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "자격증 교육",
                    description: "민간자격증, 교육 프로그램",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "유학 프로그램",
                  },
                },
              ],
            },
          }),
        }}
      />
      {/* Desktop Hero Section */}
      <section
        className={`main__hero ${styles.heroDesktop}`}
        style={{
          width: "100vw",
          height: "75vh",
          backgroundImage: "url('/images/main/main__banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "80% 0",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={`main__hero-content ${styles.heroContentDesktop}`}>
          <div className={`main__hero-title ${styles.heroTitleDesktop}`}>
            <motion.p
              className={styles.heroLead}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              취업난 해결 프로젝트
            </motion.p>
            <motion.h2
              className={styles.heroName}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              한평생 에듀바이저스
            </motion.h2>
          </div>
          <div className={`main__hero-buttons ${styles.heroButtons}`}>
            <a href="about" className="main__hero-btn">
              시작하기
            </a>
          </div>
        </div>
      </section>
      {/* Mobile Hero Section */}
      <section
        className={`main__hero ${styles.heroMobile}`}
        style={{
          width: "100vw",
          height: "75vh",
          backgroundImage: "url('/images/main/main__banner__mobile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={`main__hero-content ${styles.heroContentMobile}`}>
          <div className={styles.heroMobileInner}>
            <div className={`main__hero-title ${styles.heroTitleMobile}`}>
              <motion.p
                className={styles.heroLeadMobile}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                취업난 해결 프로젝트
              </motion.p>
              <motion.h2
                className={styles.heroNameMobile}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                한평생 에듀바이저스
              </motion.h2>
            </div>
            <div className={`main__hero-buttons ${styles.heroButtons}`}>
              <a href="about" className={`main__hero-btn ${styles.heroBtnMobile}`}>
                시작하기
              </a>
            </div>
          </div>
        </div>
      </section>
      <section
        className={`main__hero-btn-wrap ${styles.bannerStart}`}
        style={{
          backgroundImage: "url('/images/main/main__banner001.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={styles.bannerStartInner}>
          <div className={styles.bannerStartRow}>
            <img
              src="/images/logo2.png"
              className={styles.startLogo}
              alt="로고"
            />
            <span className={styles.startText}>한평생 에듀바이저스의 시작</span>
            <ArrowBlink />
          </div>
        </div>
      </section>

      <div
        className="background-image "
        style={{
          backgroundImage: "url('/images/main/main__banner002.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          width: "100%",
        }}
      >
        {/* 데스크탑 전용 */}
        <section className={`main__service ${styles.service}`}>
          <div className={`main__service__title ${styles.serviceTitle}`}>
            <h2 className={styles.serviceHeading}>
              교육은 받았지만
              <br className={styles.brMobileOnly} />
              <span className={styles.blueBrand}>&nbsp;왜</span> 취업은
              어려울까요?
            </h2>
            <p className={styles.serviceText}>
              <br />
              한평생 에듀바이저스는 많은이들이
              <strong>자신과 맞지 않는 교육을 선택</strong>하거나 복잡해진
              <br className={styles.brDesktopOnly} /> 실무·취업 환경에 적응하지 못해
              <strong>시작조차 어려운하는 경우가 많다</strong>는 사실을
              확인했습니다.
              <br />
              <br />
              <strong>이에 교육과 취업을 하나로 구축하고,</strong>
              <br />
              <strong>&#39;시작부터 현장까지&#39;</strong> 책임지는
              <span className={styles.blueBrandBold}>맞춤형 실무교육을 실현</span>
              하고 있습니다.
            </p>
          </div>
        </section>
        {/* 모바일 전용 */}
        <section className={styles.serviceMobile}>
          <h2 className={styles.serviceHeading}>
            교육은 받았지만
            <br className={styles.brMobileOnly} />
            <span className={styles.blueBrand}>왜</span> 취업은 어려울까요?
          </h2>
          <p className={styles.serviceText}>
            <br />
            한평생 에듀바이저스는 많은이들이
            <strong>자신과 맞지 않는 교육을 선택 하거나</strong> 복잡해진
            <br className={styles.brDesktopOnly} /> 실무·취업 환경에 적응하지 못해
            <strong>시작조차 어려운하는 경우가 많다는</strong> 사실을
            확인했습니다.
            <br />
            <br />
            <strong>이에 교육과 취업을 하나로 구축하고,</strong>
            <strong>&#39;시작부터 현장까지&#39; 책임지는</strong>
            <span className={styles.blueBrandBold}>
              맞춤형 실무교육을 실현
              <span className={styles.dark1e}> 하고 있습니다.</span>
            </span>
          </p>
        </section>
      </div>

      <section className={styles.diffSection}>
        <h2 className={styles.diffHeading}>한평생 에듀바이저스는 다릅니다.</h2>
        {/* STEP 1 */}
        <div className={styles.stepRow}>
          <img
            src="/images/main/main001.png"
            width={391}
            height={303}
            alt="상담 장면"
            className={styles.stepImg}
          />
          <div className={styles.stepCol}>
            <div className={styles.stepBadge}>
              <img src="/images/main/step1.png" alt="step1" />
            </div>
            <div className={styles.stepText380}>
              <div className={styles.stepTitle}>
                학생분들이 처한 환경부터 확인합니다.
              </div>
              <div className={styles.stepBody}>
                한평생의 교육은 <strong>&#39;어디서부터 시작하느냐&#39;</strong>
                가
                <br />
                무엇보다 중요하다고 생각합니다.
                <br />
                <br />
                학습자 각자의 환경과 여건을 먼저 이해하고,
                <br /> 그에 걸맞은 최적의 교육과정을 제공함으로써
                <br /> <strong>진짜 필요한 교육을 실현합니다.</strong>
                <br />{" "}
                <span className={styles.blueBrand}>
                  (사회복지사 자격증 상담은 무료로 진행됩니다. 사회복지사 자격증
                  수강료 70% 할인)
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* STEP 2 */}
        <div className={styles.stepRowReverse}>
          <img
            src="/images/main/main002.png"
            width={391}
            height={303}
            alt="면접 장면"
            className={styles.stepImg}
          />
          <div className={styles.stepCol}>
            <div className={styles.stepBadge}>
              <img src="/images/main/step2.png" alt="step2" />
            </div>
            <div className={styles.stepText518}>
              <div className={styles.stepTitle}>
                꼼꼼하고 세밀하게 관리합니다.
              </div>
              <div className={styles.stepBody}>
                한평생 에듀바이저스는 학습자의 중도 포기를{" "}
                <br className={styles.brMobileOnly} />
                철저히 방지하기 위해, 전문 양성과정을 거친
                <br className={styles.brMobileOnly} />
                설계사들이 체계적인 학습관리 시스템으로
                <br className={styles.brMobileOnly} />
                &nbsp;
                <strong>학습 완료까지 책임지고 동행합니다.</strong>
                <br />
                <br />
                학습자 한 사람 한 사람의 끝맺음을
                <br className={styles.brMobileOnly} />
                우리의 사명으로 여깁니다.
              </div>
            </div>
          </div>
        </div>
        {/* STEP 3 */}
        <div className={styles.stepRow3}>
          <img
            src="/images/main/main003.png"
            width={391}
            height={303}
            alt="취업 준비 장면"
            className={styles.stepImg}
          />
          <div className={styles.stepCol}>
            <div className={styles.stepBadge}>
              <img src="/images/main/step3.png" alt="step3" />
            </div>
            <div className={styles.stepText515}>
              <div className={styles.stepTitle}>
                실기와 취업은 저희 몫입니다.
              </div>

              <div className={styles.stepBody}>
                한평생은 교육의 끝이 아닌,
                <br className={styles.brDesktopOnly} />
                <strong>
                  취업까지 연결되는 실질적인 결과를 중요하게 생각합니다.
                </strong>
                <br />
                <br />
                실기 능력 향상부터 취업 연계까지 전 과정을 지원하며, 교육이
                현장으로 자연스럽게 이어질 수 있도록 끝까지 책임집니다.
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 취업지원 섹션 */}
      <section className={`main__recruit ${styles.recruit}`}>
        <div
          className={styles.recruitPanel}
          style={{
            backgroundImage: "url('/images/main/metting.png')",
            backgroundSize: "cover",
          }}
        >
          <div className={styles.recruitRow}>
            <div className={styles.recruitTextCol}>
              <h2 className={styles.recruitHeading}>
                한평생교육에서
                <br />
                함께 시작해 보세요
              </h2>
              <p className={styles.recruitPara}>
                실용적이고 학습자 만족 중심의
                <br />
                과정을 운영하고 있습니다.
              </p>
              <p className={styles.recruitPara}>
                상담 비용은 일절 발생하지 않으니
                <br />
                편하게 이야기 나눠보시길 바랍니다.
              </p>
            </div>
            <div className={styles.recruitBtnCol}>
              <div className={styles.recruitBtnPos}>
                <button
                  type="button"
                  onClick={openModal}
                  className={styles.recruitBtn}
                >
                  교육상담 신청하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 취업지원 섹션 */}
      <section className={styles.recruitMobile}>
        <img
          src="/images/main/main__banner002__mobile.png"
          alt="채용 미팅 모바일"
          className={styles.recruitMobileImg}
        />

        <div className={styles.recruitMobileContent}>
          <h2 className={styles.recruitMobileHeading}>
            한평생교육에서
            <br />
            함께 시작해 보세요
          </h2>
          <p className={styles.recruitMobilePara}>
            실용적이고 학습자 만족 중심의
            <br />
            과정을 운영하고 있습니다.
            <br />
            <br />
            상담 비용은 일절 발생하지 않으니
            <br />
            편하게 이야기 나눠보시길 바랍니다.
          </p>
          <button
            type="button"
            onClick={openModal}
            className={styles.recruitMobileBtn}
          >
            교육상담 신청하기
          </button>
        </div>
      </section>
    </main>
  );
}
