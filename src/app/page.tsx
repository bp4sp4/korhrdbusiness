import "./main.css";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Link from "next/link";

export default function Home() {
  return (
    <main className="main w-full min-h-screen flex flex-col items-center bg-white">
      <section
        className="main__hero w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between py-12 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/main__banner2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          height: "100vh",
          maxWidth: "100%",
        }}
      >
        <div className="main__hero-content flex-1 flex flex-col items-start z-10 rounded-lg md:bg-transparent md:p-0">
          <div className="main__hero-title text-white text-5xl md:text-7xl mb-6 flex flex-col gap-3">
            <TypingAnimation
              duration={40}
              className="text-white text-5xl md:text-3xl font-normal"
            >
              EP.1 취업난 해결 프로젝트
            </TypingAnimation>
            <TypingAnimation
              duration={40}
              className="text-white text-5xl md:text-5xl font-bold"
              delay={1200}
            >
              한평생가이던스
            </TypingAnimation>
          </div>
          <div className="main__hero-buttons flex">
            <a className="main__hero-btn">Button</a>
          </div>
        </div>
      </section>
      <section className="main__service w-full mx-auto flex bg-white">
        <p className="main__service_desc text-black">
          <strong className="block font-bold text-[35px] mb-4">
            교육은 받았지만 왜 취업은 어려울까요?
          </strong>
          한평생OOOO은 많은 이들이 자신과 맞지 않는 교육을 선택하거나
          <br />
          복잡해진 실무·취업 환경에 적응하지 못해 시작조차 어려운 현실을
          확인했습니다.
          <br /> 이에 교육과 취업을 하나로 잇는 실질적인 시스템을 구축하고,
          <br /> 시작조차 어려워하는 경우가 많다는 사실을 확인했습니다.
          <br /> &apos;시작부터 현장까지&apos;책임지는 맞춤형 실무교유을
          실현하고 있습니다.
        </p>
        <div className="main__service__items flex flex-col md:flex-row gap-8 w-full justify-center">
          <div className="main__service__item flex-1 text-center md:text-left">
            <h3 className="main__service__item-title text-[21px] font-semibold mb-4 text-gray-600">
              학생분들이 처한 환경부터 확인합니다.
            </h3>
            <p className="main__service__item-desc text-gray-500 text-base leading-relaxed">
              한평생의 교육은 &apos;어디서부터 시작하느냐&apos;가 무엇보다
              중요하다고 생각합니다. 학습자 각자의 환경과 여건을 먼저 이해하고,
              그에 걸맞은 최적의 교육과정을 제공함으로써 진짜 필요한 교육을
              실현합니다.
            </p>
          </div>
          <div className="main__service__item flex-1 text-center md:text-left">
            <h3 className="main__service__item-title text-[21px] font-semibold mb-4 text-gray-600">
              꼼꼼하고 세밀하게 관리합니다.
            </h3>
            <p className="main__service__item-desc text-gray-500 text-base leading-relaxed">
              한평생OOOO은 학습자의 중도 포기를 철저히 방지하기 위해, 전문
              양성과정을 거친 설계사들이 체계적인 학습관리 시스템으로 학습
              완료까지 책임지고 동행합니다. 학습자 한사람 한 사람의 끝맺음을
              우리의 사명으로 여깁니다.
            </p>
          </div>
          <div className="main__service__item flex-1 text-center md:text-left">
            <h3 className="main__service__item-title text-[21px] font-semibold mb-4 text-gray-600">
              실기와 취업은 저희 몫입니다.
            </h3>
            <p className="main__service__item-desc text-gray-500 text-base leading-relaxed">
              한평생은 교육의 끝이 아닌, 취업까지 연결되는 실질적인 결과를
              중요하게 생각합니다. 실기 능력 향상부터 취업 연계까지 전 과정을
              지원하며, 교육이 현장으로 자연스럽게 이어질 수 있도록 끝까지
              책임집니다.
            </p>
          </div>
        </div>
      </section>

      {/* Recruit Section */}
      <section className="main__recruit w-full flex flex-col md:flex-row items-stretch h-auto md:h-[400px]">
        {/* 좌측 텍스트/버튼 */}
        <div
          className="flex-1 h-[300px] md:h-full flex flex-col justify-center bg-[#aeb2a3]"
          style={{
            backgroundImage: "url('/images/metting.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="main__recruit-wrap text-left">
            <h2 className="text-[30px] md:text-[30px] font-semibold mb-4 text-white">
              함께하실 분을 찾습니다.
            </h2>
            <p className="text-white text-[17px] mb-8">
              판매 실적이 아닌, 고객만족 중심의 파격적인 보상을 드립니다.
              <br />
              오직 고객 만족에만 집중할 수 있는 업무 환경과
              <br />
              최고의 복리후생을 제공합니다.
            </p>
            <Link
              href="/recruit"
              className="bg-blue-600 text-white px-[36px] py-[16px] rounded-full font-semibold shadow-md hover:bg-blue-700 transition inline-block text-center"
            >
              채용중인 지점 보기 ＞
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
