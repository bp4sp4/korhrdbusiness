import "./main.css";

export default function Home() {
  return (
    <main className="main w-full min-h-screen flex flex-col items-center bg-white">
      <section
        className="main__hero w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-12 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/main__banner2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          maxWidth: "100%",
        }}
      >
        <div className="main__hero-content flex-1 flex flex-col items-start z-10 p-6 rounded-lg md:bg-transparent md:p-0">
          <h1 className="main__hero-title text-white text-3xl md:text-5xl mb-6">
            대한민국의 취업난 해결 프로젝트 <br />
            교육과 취업을 잇다
            <br />
            <strong>한평생OOO</strong>
          </h1>
          <div className="main__hero-buttons flex">
            <a className="main__hero-btn">Button</a>
          </div>
        </div>
      </section>
      <section className="main__service w-full mx-auto flex bg-white">
        <p className="main__service_desc text-black">
          교육은 열심히 받았지만 왜 취업으로 이어지지 못할까요? 한평생OOOO은
          교육과 취업이 단절되는 근본 원인을 고민한 끝에, 많은 이들이 자신의
          환경과 맞지 않는 교육을 선택하거나, 점점 더 복잡해지는 실무와 취업
          환경에 적용하지 못해 시작조차 어려워하는 경우가 많다는 사실을
          확인했습니다. 이에 한평생은 교육과 취업을 하나의 흐름으로 연결하는
          실질적인 시스템을 구축하고, &apos;시작부터 현장까지&apos; 책임지는
          교육을 실현하고 있습니다.
        </p>
        <div className="main__service__items flex flex-col md:flex-row gap-8 w-full justify-center">
          <div className="main__service__item flex-1 text-center md:text-left">
            <h3 className="main__service__item-title text-xl font-bold mb-4 text-gray-700">
              학생분들이 지인 환경부터 확인합니다.
            </h3>
            <p className="main__service__item-desc text-gray-500 text-base leading-relaxed">
              한평생은 교육은 &apos;어디서부터 시작하느냐&apos;가 무엇보다
              중요하다고 생각합니다. 학습자 각자의 환경과 여건을 먼저 이해하고,
              그에 걸맞은 최적의 교유고가정을 제공함으로써 진짜 필요한 교육을
              실현합니다.
            </p>
          </div>
          <div className="main__service__item flex-1 text-center md:text-left">
            <h3 className="main__service__item-title text-xl font-bold mb-4 text-gray-700">
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
            <h3 className="main__service__item-title text-xl font-bold mb-4 text-gray-700">
              실기와 취업은 저희 몫입니다.
            </h3>
            <p className="main__service__item-desc text-gray-500 text-base leading-relaxed">
              한평생은 교육의 끝이 아닌, 취업까지 연결되는 실질적인 결고를
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
          <div className="main__recruit-wrap max-w-lg px-4 text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              함께하실 분을 찾습니다.
            </h2>
            <p className="text-white text-lg mb-8">
              판매 실적이 아닌, 고객만족 중심의 파격적인 보상을 드립니다.
              <br />
              오직 고객 만족에만 집중할 수 있는 업무 환경과
              <br />
              최고의 복리후생을 제공합니다.
            </p>
            <button className="bg-blue-600 text-white px-8 py-5 rounded-full font-semibold shadow-md hover:bg-blue-700 transition">
              채용중인 분야 보기
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
