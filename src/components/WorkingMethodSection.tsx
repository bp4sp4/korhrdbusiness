"use client";

import {
  motion,
  useInView,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

const WorkingMethodSection = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#ffedd5", "#ffffff", "#ddd6fe"]
  );

  const workingMethods = [
    {
      title: "사신없는 판단과 행동",
      subtitle: "Integrity",
      description: "개인의 목표보다 카카오의 미션을 최우선으로 생각합니다",
      icon: "🏆",
      color: "from-yellow-400 to-orange-400",
      bgColor: "bg-yellow-50",
      details:
        "투명하고 정직한 소통을 바탕으로 신뢰할 수 있는 관계를 구축합니다.",
    },
    {
      title: "사용자 중심의 관점",
      subtitle: "User-Centric",
      description: "사용자에게 꼭 필요한 것이지 고민합니다",
      icon: "🔍",
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-blue-50",
      details:
        "사용자의 니즈를 깊이 이해하고 그들의 관점에서 서비스를 설계합니다.",
    },
    {
      title: "최고의 결과를 향한 집념",
      subtitle: "Challenge for Excellence",
      description: "최고의 결과를 얻기 위한 노력을 멈추지 않습니다",
      icon: "🏅",
      color: "from-purple-400 to-pink-400",
      bgColor: "bg-purple-50",
      details:
        "끊임없는 도전과 혁신을 통해 업계 최고 수준의 서비스를 제공합니다.",
    },
    {
      title: "열린 소통과 협업",
      subtitle: "Open Communication",
      description: "투명하고 열린 소통으로 함께 성장합니다",
      icon: "💬",
      color: "from-green-400 to-emerald-400",
      bgColor: "bg-green-50",
      details:
        "다양한 의견을 존중하고 협력을 통해 더 나은 결과를 만들어냅니다.",
    },
    {
      title: "지속적인 학습과 성장",
      subtitle: "Continuous Learning",
      description: "끊임없는 학습을 통해 개인과 조직이 함께 발전합니다",
      icon: "📚",
      color: "from-indigo-400 to-purple-400",
      bgColor: "bg-indigo-50",
      details: "변화하는 환경에 적응하며 지속적으로 역량을 개발합니다.",
    },
  ];

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = 320; // w-80 = 320px
      const gap = 24; // space-x-6 = 24px
      const scrollPosition = index * (slideWidth + gap);

      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    const nextIndex = Math.min(currentSlide + 1, workingMethods.length - 1);
    scrollToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = Math.max(currentSlide - 1, 0);
    scrollToSlide(prevIndex);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        checkScrollButtons();

        // Update current slide based on scroll position
        const slideWidth = 320;
        const gap = 24;
        const scrollLeft = scrollContainer.scrollLeft;
        const newSlide = Math.round(scrollLeft / (slideWidth + gap));
        setCurrentSlide(Math.min(newSlide, workingMethods.length - 1));
      };

      scrollContainer.addEventListener("scroll", handleScroll);
      checkScrollButtons();

      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [workingMethods.length]);

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={
              isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
            }
            transition={{
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
          >
            <span className="text-2xl">🚀</span>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            한평생 가이던스는 하나의 방향을 바라봅니다
          </motion.h2>
        </motion.div>

        {/* Enhanced Horizontal Scroll Container */}
        <div className="relative">
          <motion.div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
            drag="x"
            dragControls={dragControls}
            dragConstraints={{ left: -1000, right: 0 }}
            dragElastic={0.1}
          >
            {workingMethods.map((method, index) => (
              <motion.div
                key={index}
                className={`flex-shrink-0 w-80 ${method.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer relative overflow-hidden`}
                style={{ scrollSnapAlign: "start" }}
                initial={{ opacity: 0, x: 50, rotateY: 15 }}
                animate={
                  isInView
                    ? { opacity: 1, x: 0, rotateY: 0 }
                    : { opacity: 0, x: 50, rotateY: 15 }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                onClick={() => setCurrentSlide(index)}
              >
                {/* Background gradient overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 rounded-3xl`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating particles */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-60"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                />

                <div className="text-center relative z-10">
                  <motion.div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${method.color} rounded-full mb-6 text-3xl shadow-lg relative overflow-hidden`}
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.6 }}
                    animate={
                      currentSlide === index
                        ? {
                            boxShadow: [
                              "0 10px 25px rgba(0,0,0,0.1)",
                              "0 20px 40px rgba(0,0,0,0.2)",
                              "0 10px 25px rgba(0,0,0,0.1)",
                            ],
                          }
                        : {}
                    }
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0"
                      whileHover={{ opacity: 0.2 }}
                      transition={{ duration: 0.3 }}
                    />
                    {method.icon}
                  </motion.div>

                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  >
                    <span className="inline-block px-4 py-2 bg-white/70 rounded-full text-sm font-medium text-gray-600 mb-3 backdrop-blur-sm">
                      {method.subtitle}
                    </span>
                  </motion.div>

                  <motion.h3
                    className="text-xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                  >
                    {method.title}
                  </motion.h3>

                  <motion.p
                    className="text-gray-600 leading-relaxed mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.7 }}
                  >
                    {method.description}
                  </motion.p>

                  {/* Additional details on hover */}
                  <motion.div
                    className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ height: 0 }}
                    whileHover={{ height: "auto" }}
                  >
                    {method.details}
                  </motion.div>
                </div>

                {/* Progress indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={
                    currentSlide === index ? { width: "100%" } : { width: "0%" }
                  }
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Navigation Arrows */}
          <motion.button
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-yellow-500 transition-all duration-300 z-10 ${
              !canScrollLeft
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            onClick={prevSlide}
            disabled={!canScrollLeft}
            whileHover={{ scale: canScrollLeft ? 1.1 : 1 }}
            whileTap={{ scale: canScrollLeft ? 0.9 : 1 }}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          <motion.button
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-yellow-500 transition-all duration-300 z-10 ${
              !canScrollRight
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-110"
            }`}
            onClick={nextSlide}
            disabled={!canScrollRight}
            whileHover={{ scale: canScrollRight ? 1.1 : 1 }}
            whileTap={{ scale: canScrollRight ? 0.9 : 1 }}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>

        {/* Enhanced Scroll Indicators */}
        <motion.div
          className="flex justify-center mt-8 space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {workingMethods.map((_, index) => (
            <motion.button
              key={index}
              className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 h-3 bg-yellow-500"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => scrollToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="mt-6 mx-auto max-w-md"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="w-full bg-gray-200 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1 rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentSlide + 1) / workingMethods.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1</span>
            <span>{workingMethods.length}</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default WorkingMethodSection;
