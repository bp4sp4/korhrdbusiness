"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PurposeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 bg-white" id="intro">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            사람을 이해하는 기술로
          </h2>
          <p className="text-xl text-gray-600">
            필요한 미래를 더 가깝게 만듭니다
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-900">존재이유</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              카카오는 사람과 사람, 사람과 기술, 사람과 정보를 연결하여 더 나은
              세상을 만들어가는 것을 존재이유로 합니다. 우리는 기술을 통해
              사람들의 일상을 더욱 편리하고 풍요롭게 만들고, 모든 사람이 자신의
              가능성을 실현할 수 있는 환경을 조성합니다.
            </p>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                연결을 통한 가치 창출
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 h-80">
              <motion.div
                className="absolute top-8 right-8 w-16 h-16 bg-yellow-300 rounded-full opacity-60"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-8 left-8 w-12 h-12 bg-orange-300 rounded-full opacity-70"
                animate={{
                  y: [0, -10, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative z-10 h-full flex items-center justify-center">
                <motion.div
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-700 font-medium">사람 중심의 기술</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
