import Link from "next/link";
import { Button } from "@/components/ui/button";
import { interviews } from "../interviewList";
import InterviewNav from "@/components/InterviewNav";

export default function InterviewDetail() {
  const currentIndex = interviews.findIndex((i) => i.name === "eunhye");
  const prev = currentIndex > 0 ? interviews[currentIndex - 1] : null;
  const next =
    currentIndex < interviews.length - 1 ? interviews[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* === 상단: 직접 작성 === */}
      <h1 className="text-3xl font-bold text-center mb-2">
        안녕하세요 강남지점 지점장 장은혜입니다!
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        영업 3팀 | 장은혜 대리
      </p>
      <div className="rounded-2xl overflow-hidden mb-12">
        <img
          src="/images/recruit/interview/eunhye3/main001.jpg"
          alt="한평생에듀바이저스 대표 이미지"
          className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
        />
      </div>

      {/* === 본문: 이미지 + 텍스트 섹션 === */}
      <section className="mb-12">
        <h2 className=" font-bold mb-2 md:px-10 text-[20px] md:text-[26px] ">
          자기소개와 지점의 비전이 궁금해요.
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          안녕하세요, AIO 지점장 장은혜입니다.저희 지점은 인내(Assiduity),
          도전(Innovate), 겸손(Overcome) 세 가지 핵심 가치를 중심으로 운영되고
          있으며,
          <br />
          <br /> 모든 성별·연령을 넘어서 국내뿐 아니라 글로벌 교육 플랫폼을
          지향하고 있어 학생들에게 폭넓은 교육 기회를 제공하는 데에 전념하고
          있습니다.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/eunhye3/main002.jpg"
            alt="한평생에듀바이저스 교육 현장"
            className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
          />
        </div>
        <h2 className=" font-bold mb-2 md:px-10 text-[20px] md:text-[26px]">
          팀의 가장 큰 도전이 있다면요? 그 과정에서 얻은 시너지는 무엇인가요?
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          현재 저희가 가장 힘쓰고 있는 부분은 해외 유학 교육 분야의 확장입니다.
          처음은 백지상태에서 시작하여 새로운 구조를 기획하고 실행하는 일이라
          쉽지 않았지만, 팀원들이 자율적으로 역할을 분담하며 각자 성장과 도전에
          몰입하게 되었습니다.
          <br />
          <br />이 과정에서 인내와 도전 의식을 실천하고 학습하며 팀원들끼리
          협업하는 문화가 자연스럽게 자리 잡혔습니다.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/eunhye3/main003.jpg"
            alt="한평생에듀바이저스 교육 현장"
            className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
          />
        </div>
        <h2 className="font-bold mb-2 md:px-10 text-[20px] md:text-[26px]">
          팀장님의 리더십 철학, 그리고 팀 의사결정의 핵심 원칙은 무엇인가요?
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          리더십 철학이라고 하면 뭔가 거창한데 사실 되게 간단합니다.
          간단명료하게 리더는 말에 책임을 지는 사람이기 떄문에 결정한 결과에
          있어 말보다 행동으로 실천하여 본이 되어야 한다고 생각하기에 부단히
          애쓰고 있습니다.
          <br />
          <br /> 팀의 의사결정 핵심 원칙은 각 팀 리더 중심의 결정 체제 아래
          진행되며 사전 벤치마킹을 통해 충분한 데이터와 사례를 기반으로 방향을
          설정하고 있습니다. 이런 철저한 준비는 특히 교육 분야에선 효과적인 전략
          수립과 실행을 돕고 있습니다.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/eunhye3/main004.jpg"
            alt="한평생에듀바이저스 교육 현장"
            className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
          />
        </div>
        <h2 className="font-bold mb-2 md:px-10 text-[20px] md:text-[26px]">
          한평생교육 에듀바이저로서 이루고 싶은 개인적인 목표와, 에듀바이저스에
          가장 잘 맞는 인재는 무엇인가요?
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          개인적인 목표로는 글로벌 시대에 발맞춰 한국을 넘어 해외 교육사업까지
          확장하는 게 목표이며 강남 사옥 설립을 이루는게 목표입니다.
          <br />
          <br />
          에듀바이저스에 가장 이상적인 인재는 핵심 가치인 인내하며 도전하는
          자세, 겸손하게 배우고 성장하려는 태도를 지닌 인재가 적합합니다.
          <br /> 이러한 인재는 자연스럽게 팀과 함께 발전하고 성장해 나갈 수
          있다고 생각합니다.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/recruit/interview">
            <Button
              variant="outline"
              className="w-[100px] h-[40px] border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100"
            >
              목록보기
            </Button>
          </Link>
          <Link href="/recruit/34">
            <Button
              variant="outline"
              className="w-[100px] h-[40px] bg-[#2B7FFF] text-white hover:text-white rounded-xl font-bold hover:bg-[#1459c5]"
            >
              합류하기
            </Button>
          </Link>
        </div>
      </section>
      {/* === 인터뷰 네비게이션 === */}
      <InterviewNav prev={prev} next={next} />
    </div>
  );
}
