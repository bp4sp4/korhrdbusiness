"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const GoalsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeGoal, setActiveGoal] = useState(0);

  useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const goals = [
    {
      id: 1,
      title: "문제의 본질에 집중",
      description:
        "사용자에게 숨겨진 진짜을 통해 실질적으로 사용자 문제를 해결할 수 있는 서비스와 서비스를 고민합니다",
      color: "from-pink-400 to-red-400",
      bgColor: "bg-pink-50",
      icon: "🎯",
    },
    {
      id: 2,
      title: "시대에 맞는 기술",
      description:
        "시대에 맞는 기술을 통해 새로운 관계와 대화 경험을 확장합니다",
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-blue-50",
      icon: "⚡",
    },
    {
      id: 3,
      title: "안전한 디지털 환경",
      description:
        "사용자 신뢰를 바탕으로 모두에게 안전한 디지털 환경을 만들기 위해 노력합니다",
      color: "from-green-400 to-emerald-400",
      bgColor: "bg-green-50",
      icon: "🛡️",
    },
    {
      id: 4,
      title: "사회적 가치 추구",
      description: "유저와 파트너, 모든가 함께 성장하는 미래를 만들어 갑니다",
      color: "from-purple-400 to-indigo-400",
      bgColor: "bg-purple-50",
      icon: "🌟",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50 overflow-hidden" id="goals">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6"
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
            <span className="text-2xl">🏁</span>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            카카오는 목표를 향해 달려갑니다
          </motion.h2>
        </motion.div>

        <div className="space-y-8">
          {goals.map((goal, index) => {
            const cardRef = useRef(null);
            const cardInView = useInView(cardRef, {
              once: false,
              amount: 0.3,
              margin: "-100px 0px -100px 0px",
            });

            return (
              <motion.div
                key={goal.id}
                ref={cardRef}
                className={`relative rounded-3xl p-8 ${goal.bgColor} cursor-pointer transition-all duration-500 hover:shadow-2xl group overflow-hidden`}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -100 : 100,
                  rotateY: 15,
                }}
                animate={
                  cardInView
                    ? { opacity: 1, x: 0, rotateY: 0 }
                    : {
                        opacity: 0,
                        x: index % 2 === 0 ? -100 : 100,
                        rotateY: 15,
                      }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                onClick={() => setActiveGoal(index)}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Background gradient animation */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-0 rounded-3xl`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating particles */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-60"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
                <motion.div
                  className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full opacity-40"
                  animate={{
                    x: [0, 10, 0],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.7,
                  }}
                />

                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 relative z-10">
                  <motion.div
                    className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${goal.color} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg relative overflow-hidden`}
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.6 }}
                    animate={
                      cardInView
                        ? {
                            boxShadow: [
                              "0 10px 25px rgba(0,0,0,0.1)",
                              "0 20px 40px rgba(0,0,0,0.15)",
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
                    {goal.id}
                  </motion.div>

                  <div className="flex-1 text-center lg:text-left">
                    <motion.h3
                      className="text-2xl font-bold text-gray-900 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        cardInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    >
                      {goal.title}
                    </motion.h3>
                    <motion.p
                      className="text-lg text-gray-600 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        cardInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    >
                      {goal.description}
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex-shrink-0 text-4xl"
                    animate={{
                      scale:
                        activeGoal === index
                          ? [1, 1.3, 1]
                          : cardInView
                          ? [1, 1.1, 1]
                          : 1,
                      rotate: activeGoal === index ? [0, 15, -15, 0] : 0,
                    }}
                    transition={{
                      duration: activeGoal === index ? 0.6 : 2,
                      repeat: cardInView ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    {goal.icon}
                  </motion.div>
                </div>

                {/* Progress indicator */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={cardInView ? { width: "100%" } : { width: "0%" }}
                  transition={{ duration: 1, delay: index * 0.2 + 0.8 }}
                />

                {/* Hover glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-0 rounded-3xl blur-xl`}
                  whileHover={{ opacity: 0.1, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-2xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-orange-200 rounded-full opacity-30 blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </section>
  );
};

export default GoalsSection;
