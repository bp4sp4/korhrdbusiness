import { motion } from "framer-motion";

const EducationRecruitSection = () => (
  <section className="flex flex-col md:flex-row items-center justify-between min-h-[600px] md:min-h-[680px] max-w-[1100px] mx-auto p-0 w-full overflow-hidden">
    {/* 아이폰 모형 - 먼저 등장 */}
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full  mx-auto h-[420px] md:h-[400px] flex items-center justify-center order-2 md:order-1 translate-y-[40px] md:translate-y-0 z-10 relative"
    >
      <img
        src="/images/eduservice/recruit.gif"
        alt="iPhone Frame"
        className="relative z-0  w-[100%] h-[100%] md:w-[560px] md:h-[560px]"
      />
    </motion.div>
    {/* 텍스트 - 나중에 등장 */}
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full md:w-auto mb-8 md:mb-0 md:ml-16 flex-shrink-0 px-4 order-1 md:order-2"
      style={{
        padding: "72px 32px 0",
      }}
    >
      <h2 className="text-[32px] md:text-[48px] text-[#1E1E1E] font-extrabold text-left md:text-right leading-tight mb-4">
        내일의 전문가 오늘 지원하세요
      </h2>
      <p className="text-[16px] md:text-[20px] text-[#979797]  text-left md:text-right">
        목표를 현실로, 한평생이 도와드립니다.
      </p>
    </motion.div>
  </section>
);

export default EducationRecruitSection;
