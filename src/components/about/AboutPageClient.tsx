"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import "../../app/main.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Card } from "@/components/ui/card";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import styles from "./AboutPageClient.module.css";
// import MarqueeDemo from "../magicui/review";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  achievements: string[];
}

export default function AboutPageClient() {
  const eduTopSwiperRef = useRef<SwiperClass | null>(null);
  const eduTopContainerRef = useRef<HTMLDivElement | null>(null);
  const [eduTopActive, setEduTopActive] = useState(false);
  const eduCardsSwiperRef = useRef<SwiperClass | null>(null);
  const eduCardsContainerRef = useRef<HTMLDivElement | null>(null);
  const [eduCardsActive, setEduCardsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer1 = new window.IntersectionObserver(
      ([entry]) => setEduTopActive(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (eduTopContainerRef.current)
      observer1.observe(eduTopContainerRef.current);
    const observer2 = new window.IntersectionObserver(
      ([entry]) => setEduCardsActive(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (eduCardsContainerRef.current)
      observer2.observe(eduCardsContainerRef.current);
    return () => {
      observer1.disconnect();
      observer2.disconnect();
    };
  }, []);

  useEffect(() => {
    if (eduTopSwiperRef.current && eduTopSwiperRef.current.autoplay) {
      if (eduTopActive) {
        eduTopSwiperRef.current.autoplay.start();
      } else {
        eduTopSwiperRef.current.autoplay.stop();
      }
    }
  }, [eduTopActive]);

  useEffect(() => {
    if (eduCardsSwiperRef.current && eduCardsSwiperRef.current.autoplay) {
      if (eduCardsActive) {
        eduCardsSwiperRef.current.autoplay.start();
      } else {
        eduCardsSwiperRef.current.autoplay.stop();
      }
    }
  }, [eduCardsActive]);

  return (
    <div className={styles.page}>
      {/* 1. 히어로/인트로 */}
      <div className={styles.hero}>
        {/* 배경 이미지에 parallax */}
        <motion.div className={styles.heroBgLayer}>
          <div className={styles.heroBgInner}>
            {/* 데스크톱용 이미지 (md 사이즈 이상에서 보임) */}
            <img
              src="/images/about/about_main_banner.jpg"
              alt="메인 배너 이미지"
              className={styles.bannerDesktop}
            />
            {/* 모바일용 이미지 (md 사이즈 미만에서 보임) */}
            <img
              src="/images/about/about_main_banner_moblie.png"
              alt="모바일 메인 배너 이미지"
              className={styles.bannerMobile}
            />
          </div>
          {/* 어두운 오버레이 (모바일만) */}
          <div className={styles.heroOverlay} />
        </motion.div>
        <motion.div
          className={styles.heroContent}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className={styles.heroTitle} style={{ letterSpacing: "-2px" }}>
            누구도 끝까지 책임지지 않던
          </h2>
          <p className={styles.heroSubtitle}>교육의 본질을 바꿉니다.</p>
          <p className={styles.heroDesc}>
            <strong>한평생교육</strong>은 여러분과{" "}
            <span className={styles.mobileBreak}></span>한 평생을 함께
            함께합니다.
          </p>
        </motion.div>
      </div>

      {/* 2. 연혁(타임라인) */}
      <motion.section
        className={styles.timelineSection}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className={styles.container4xl}>
          <div className={styles.timelineInner}>
            <div className={styles.timelineTrack}>
              <TimelineSection />
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. 교육 철학/슬로건 */}
      <motion.section className={styles.philosophy}>
        <div className={styles.centerNarrow}>
          <h3 className={styles.philTitle}>
            &apos;<span className={styles.blue600}>왜?</span>&apos; 교육은
            어렵게만 느껴질까?
          </h3>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* 카드 더미 보일때 카드 데이터 배열*/}
          {(() => {
            const eduTopCards = [
              { img: "/images/about/edu001.png" },
              { img: "/images/about/edu002.png" },
              { img: "/images/about/edu003.png" },
              { img: "/images/about/edu004.png" },
            ];
            return (
              <>
                {/* 모바일 Swiper */}
                <div
                  className={styles.mobileSwiperWrap}
                  ref={eduTopContainerRef}
                >
                  <Swiper
                    modules={[Autoplay]}
                    spaceBetween={10}
                    slidesPerView="auto"
                    centeredSlides={true}
                    loop={true}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    onSwiper={(swiper) => {
                      eduTopSwiperRef.current = swiper;
                    }}
                    className={styles.swiperFull}
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                  >
                    {eduTopCards.map((card, idx) => (
                      <SwiperSlide
                        key={card.img + idx}
                        style={{ width: 270, maxWidth: 270 }}
                        className={styles.slide270}
                      >
                        <div className={styles.slideCenter}>
                          <Card
                            className={styles.eduTopCard}
                            style={{ width: 270, height: 380 }}
                          >
                            <img
                              src={card.img}
                              alt=""
                              className={styles.cardImgCover}
                              style={{ borderRadius: "16px" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </Card>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                {/* 데스크탑 기존 그리드 */}
                <div className={styles.eduTopGrid}>
                  {eduTopCards.map((card, idx) => (
                    <div className={styles.gridItem} key={card.img + idx}>
                      <img
                        src={card.img}
                        alt=""
                        className={styles.eduTopGridImg}
                        style={{ borderRadius: "16px" }}
                      />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
          <div className={styles.centerCol}>
            <p className={styles.philText1}>
              수많은 학생분들을 만나오면서
              <br />
              <strong>
                <span className={styles.blueBrand}>&apos;되는 방법&apos;</span>{" "}
                을 알고, <br className={styles.mobileOnlyBr} />
                <span className={styles.blueBrand}>
                  &apos;실제로 되게&apos;
                </span>{" "}
                만듭니다.
              </strong>
            </p>
          </div>
        </motion.div>
        <div className={styles.centerNarrow}>
          <h3 className={styles.philTitle2}>
            교육은{" "}
            <span className={styles.blueBrand}>진짜 써먹어야 합니다</span>
          </h3>
        </div>
        {/* 아래 educard 카드들도 motion.div로 감싸서 등장 애니메이션 적용 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {(() => {
            const eduCards = [
              { img: "/images/about/educard001.png" },
              { img: "/images/about/educard002.png" },
              { img: "/images/about/educard003.png" },
              { img: "/images/about/educard004.png" },
            ];
            return (
              <>
                {/* 모바일 Swiper */}
                <div
                  className={styles.mobileSwiperWrap}
                  ref={eduCardsContainerRef}
                >
                  <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    centeredSlides={true}
                    loop={true}
                    onSwiper={(swiper) => {
                      eduCardsSwiperRef.current = swiper;
                    }}
                    className={styles.swiperFull}
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                  >
                    {eduCards.map((card, idx) => (
                      <SwiperSlide
                        key={card.img + idx}
                        style={{ width: 274, maxWidth: 317 }}
                        className={styles.slide300}
                      >
                        <div className={styles.slideCenter}>
                          <Card
                            className={styles.eduCard}
                            style={{ width: 310, height: 317 }}
                          >
                            <img
                              src={card.img}
                              alt=""
                              className={styles.cardImgCoverPlain}
                              style={{ borderRadius: "16px" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </Card>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                {/* 데스크탑 기존 그리드 */}
                <div className={styles.eduCardGrid}>
                  {eduCards.map((card, idx) => (
                    <div className={styles.gridItem} key={card.img + idx}>
                      <Card
                        className={styles.eduCardDesktop}
                        style={{ width: 270, height: 310 }}
                      >
                        <img
                          src={card.img}
                          alt=""
                          className={styles.cardImgCover}
                          style={{ borderRadius: "16px" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </Card>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </motion.div>
        <div className={styles.centerCol}>
          <p className={styles.philText2}>
            한평생 에듀바이저스는 단순한 교육이 아닌,
            <br />
            <span className={styles.bold}>
              인생의 방향성과 성장을 함께 하겠습니다.
            </span>
          </p>
        </div>
        {/* <div className="mb-[120px]">
          {" "}
          <MarqueeDemo />
        </div> */}
      </motion.section>

      {/* 6. CEO 메시지 */}
      {/* 데스크톱용 CEO 메시지 */}
      <motion.section
        className={styles.ceoDesktop}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{
          backgroundImage: "url('/images/about/ceo_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.ceoContainer}>
          {/* 메시지 영역 */}
          <div className={styles.ceoMsgCol}>
            <div className={styles.ceoHeading}>CEO Message</div>
            <div className={styles.ceoBody}>
              한평생에듀바이저스 홈페이지에 방문해 주신
              <br /> 모든 분께 감사의 말씀을 전합니다.
              <br />
              <br />
              <strong>
                한평생에듀바이저스는 학생들의 성장과 성공을 최우선으로 생각하며
                <br />
                실질적이고 현장감 있는 교육, 그리고 내일을 바꾸는 서비스를
                제공합니다.
              </strong>
              <br />
              <br />
              앞으로도 더 많은 분들이 성장의 기회를 잡을 수 있도록
              <br /> 혁신을 멈추지 않겠습니다.
              <br />
              <br />
            </div>
          </div>
          {/* 사인 영역 */}
          <div className={styles.ceoSignCol}></div>
        </div>
      </motion.section>

      {/* 모바일용 CEO 메시지 */}
      <motion.section
        className={styles.ceoMobile}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{
          backgroundImage: "url('/images/about/ceo_mobile_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.ceoContainerMobile}>
          {/* 메시지 영역 */}
          <div className={styles.ceoMsgCol}>
            <div className={styles.ceoHeading}>CEO Message</div>
            <div className={styles.ceoBodyMobile}>
              한평생에듀바이저스 홈페이지에 방문해 주신
              <br /> 모든 분께 감사의 말씀을 전합니다.
              <br />
              <br />
              <strong>
                한평생에듀바이저스는 학생들의 성장과 성공을
                <br />
                최우선으로 생각하며 실질적이고 현장감 있는 교육,
                <br />
                그리고 내일을 바꾸는 서비스를 제공합니다.
              </strong>
              <br />
              <br />
              앞으로도 더 많은 분들이 성장의 기회를 잡을 수
              <br /> 있도록 혁신을 멈추지 않겠습니다.
              <br />
              <br />
            </div>
          </div>
          {/* 사인 영역 */}
          <div className={styles.ceoSignCol}></div>
        </div>
      </motion.section>
    </div>
  );
}

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section className={styles.tlSection}>
      <div className={styles.container4xl}>
        <h3 className={styles.tlHeading}>
          한평생교육은 매일,
          <br />
          누군가의 내일을 바꾸고 있습니다.
        </h3>
        <div className={styles.timelineInner} ref={containerRef}>
          <div ref={ref} className={styles.timelineTrack}>
            {data.map((item: TimelineEntry, index: number) => (
              <div key={index} className={styles.tlItem}>
                <div className={styles.tlMarkerCol}>
                  <div className={styles.tlDotWrap}>
                    <div className={styles.tlDot} />
                  </div>
                  <h3 className={styles.tlYearDesktop}>{item.year}</h3>
                </div>
                <div className={styles.tlContent}>
                  <h3 className={styles.tlYearMobile}>{item.year}</h3>
                  <div className={styles.tlWhite}>
                    <h4 className={styles.tlTitle}>{item.title}</h4>
                    <p className={styles.tlDesc}>{item.description}</p>
                    <div className={styles.tlAchievements}>
                      {item.achievements.map(
                        (achievement: string, idx: number) => (
                          <div key={idx} className={styles.tlAchievement}>
                            <div className={styles.tlAchievementDot} />
                            <span>{achievement}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                height: height + "px",
              }}
              className={styles.tlProgressTrack}
            >
              <motion.div
                style={{
                  height: heightTransform,
                  opacity: opacityTransform,
                }}
                className={styles.tlProgressFill}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineSection = () => {
  const timelineData: TimelineEntry[] = [
    {
      year: "2025",
      title: "교육플랫폼의 새로운 기준",
      description:
        "한평생교육은 파편화된 교육 시장을 통합하고, '한평생에듀바이저스' 플랫폼으로 교육 접근성과 안정성을 획기적으로 개선하며, 교육 산업의 새로운 표준을 제시하고 있습니다.",
      achievements: ["한평생 에듀바이저스 정식출범"],
    },
    {
      year: "2024",
      title: "교육플랫폼으로의 도약",
      description:
        "한평생교육은 기존 교육의 한계를 넘어서, 학습부터 자격 취득, 취업 연계까지 아우르는 종합 교육 플랫폼으로 진화하며 업계 내 확고한 지위를 확보하였습니다.",
      achievements: [
        "(주)한평생교육 법인 설립",
        "교육브랜드 정식 플랫폼화 실시",
        "취업연계 서비스 구축",
      ],
    },
    {
      year: "2023",
      title: "평생교육의 첫 서비스화",
      description:
        "교육과 취업을 연결하는 사명을 바탕으로, 교육을 하나의 서비스로 혁신하여 실질적인 가치를 제공하는 여정을 시작하였습니다.",
      achievements: ["한국실습지원센터 설립", "전국단위 실습섭외 서비스 구축"],
    },
  ];

  return <Timeline data={timelineData} />;
};
