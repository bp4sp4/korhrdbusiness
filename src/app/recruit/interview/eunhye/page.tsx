export default function InterviewDetail() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* === 상단: 직접 작성 === */}
      <h1 className="text-3xl font-bold text-center mb-2">
        한평생교육원의 비전과 이야기
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        영업 3팀 | 장은혜 대리
      </p>
      <div className="rounded-2xl overflow-hidden mb-12">
        <img
          src="/images/recruit/interview/eunhye3/main001.jpg"
          alt="한평생교육원 대표 이미지"
          className="w-full w-[864px] h-[576px] object-cover"
        />
      </div>

      {/* === 본문: 이미지 + 텍스트 섹션 === */}
      <section className="mb-12">
        <h2 className=" font-bold mb-2 px-10 text-[26px]">
          안녕하세요, 은혜대리님 반가워요!
        </h2>
        <p className="mb-10 px-10 text-[19px]">
          한평생교육원은 평생교육의 가치를 실현하며, 모두가 성장할 수 있는 교육
          환경을 만들어가고 있습니다. 다양한 교육 프로그램과 헌신적인 교직원들이
          함께하는 이곳에서, 학생과 교사가 함께 성장하는 이야기를 전해드립니다.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/eunhye3/main002.jpg"
            alt="한평생교육원 교육 현장"
            className="w-full w-[864px] h-[576px] object-cover"
          />
        </div>
        <h2 className=" font-bold mb-2 px-10 text-[26px]">
          앞으로의 영업팀의 방향이 궁금해요.
        </h2>
        <p className="mb-10 px-10 text-[19px]">
          한평생교육원의 영업팀은 각자의 전문성을 살려 다양한 교육 프로그램을
          많은 분들께 알리고 있습니다. 최근에는 팀원 간의 협업을 강화하여, 더
          체계적이고 효율적인 상담과 안내가 이루어지도록 노력하고 있어요. <br />
          <br />
          앞으로도 변화하는 교육 트렌드에 맞춰 새로운 프로그램을 개발하고,
          학생과 학부모님께 꼭 필요한 정보를 제공하는 것이 저희 팀의 목표입니다.{" "}
          무엇보다도, 서로를 존중하고 응원하는 분위기 속에서 함께 성장하는
          영업팀이 되고 싶어요.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/eunhye3/main003.jpg"
            alt="한평생교육원 교육 현장"
            className="w-full w-[864px] h-[576px] object-cover"
          />
        </div>
        <h2 className="font-bold mb-2 px-10 text-[26px]">
          어떤 분이 영업팀에 합류하길 바라나요?
        </h2>
        <p className="mb-10 px-10 text-[19px]">
          저희 팀은 새로운 도전을 두려워하지 않고, 함께 성장하고자 하는 분을
          기다리고 있습니다. <br />
          스스로 배우고자 하는 의지가 강하고, 동료들과 소통하며 긍정적인
          에너지를 나눌 수 있는 분이라면 누구든 환영이에요. <br />
          무엇보다도, 고객의 입장에서 생각하고 더 나은 서비스를 만들기 위해
          고민하는 분과 함께하고 싶습니다.
        </p>
      </section>

      {/* === 하단: 직접 작성 === */}
      {/* 여기에 직접 원하는 내용을 추가하세요 */}
    </div>
  );
}
