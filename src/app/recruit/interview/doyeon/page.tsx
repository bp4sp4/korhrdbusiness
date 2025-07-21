import Link from "next/link";
import { Button } from "@/components/ui/button";
import { interviews } from "../interviewList";
import InterviewNav from "@/components/InterviewNav";

export default function InterviewDetail() {
  const currentIndex = interviews.findIndex((i) => i.name === "doyeon");
  const prev = currentIndex > 0 ? interviews[currentIndex - 1] : null;
  const next =
    currentIndex < interviews.length - 1 ? interviews[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* === 상단: 직접 작성 === */}
      <h1 className="text-3xl font-bold text-center mb-2">
        에듀바이저스 북부지점 인터뷰 질문
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        영업 1팀 | 강도연 대리
      </p>
      <div className="rounded-2xl overflow-hidden mb-12">
        <img
          src="/images/recruit/interview/doyeon1/doyeon.jpg"
          alt="한평생에듀바이저스 대표 이미지"
          className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
        />
      </div>

      {/* === 본문: 이미지 + 텍스트 섹션 === */}
      <section className="mb-12">
        <h2 className=" font-bold mb-2 md:px-10 text-[20px] md:text-[26px] ">
          자기소개와 북부지점만의 핵심 가치가 궁금해요.
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          안녕하세요. 에듀바이저스 북부지점 위드업 사업단 팀장을 맡고 있는
          강도연입니다. 우리 지점은 이름처럼 &apos;함께 성장 하는
          곳&apos;이에요.
          <br /> 학습자 한 분 한 분의 목표를 내 일처럼 생각하고, 끝까지 함께하는
          것을 가장 중요하게 생각합니다.
          <br />
          <br /> 처음 상담을 받을 때부터 자격증 취득이나 학위까지의 모든 과정을
          편안하게 걸어갈 수 있도록 든든한 길잡이가 되어드리는 게 북부지점의
          핵심가치입니다.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/doyeon1/doyeon001.jpg"
            alt="한평생에듀바이저스 교육 현장"
            className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
          />
        </div>
        <h2 className=" font-bold mb-2 md:px-10 text-[20px] md:text-[26px]">
          팀장님께서 생각하시는 북부지점의 가장 큰 강점이 있다면요?
          <br />그 강점으로 이뤄낸 가장 자랑스러운 성과는 무엇인가요?
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          저희 북부지점의 강점은 바로 사람과 팀입니다. 서로를 응원해주고 좋은
          에너지를 나누는 분위기 덕분에 상담을 받으시는 분들도 금방 마음을
          열어요.
          <br />
          <br /> 이런 분위기 덕분에 지난해에는 학습자 만족도 1위를 달성했고,
          자격증 취득률과 학위 취득률에서도 전국 최고 성과를 낼 수 있었습니다.
          무엇보다 이 모든 결과가 함께 움직였기에 가능했다는 점이 가장
          자랑스럽습니다.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/doyeon1/doyeon002.jpg"
            alt="한평생에듀바이저스 교육 현장"
            className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
          />
        </div>
        <h2 className="font-bold mb-2 md:px-10 text-[20px] md:text-[26px]">
          팀원들이 자율적으로 성장하고 최고의 성과를 낼 수 있도록 이끄는
          팀장님만의 방식은 무엇인가요?
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          저는 팀원들이 스스로 성장하는 모습을 볼 때 가장 큰 보람을 느낍니다.
          그래서 항상 긍정적인 피드백과 함께 작은 시도도 응원해주고, &apos;일단
          해보자&apos;는 실행력을 강조해요.
          <br />
          <br /> 잘된 부분은 함께 기뻐하고, 부족한 부분은 같이 고민하면서
          채워가는 방식이죠. 덕분에 팀원들이 자신의 강점을 찾고 스스로 빛날 수
          있는 환경이 만들어졌다고 생각합니다.
        </p>
        <div className="rounded-2xl overflow-hidden mb-8">
          <img
            src="/images/recruit/interview/doyeon1/doyeon003.jpg"
            alt="한평생에듀바이저스 교육 현장"
            className="w-full w-[311px] h-[211px] md:w-[864px] md:h-[576px] object-cover"
          />
        </div>
        <h2 className="font-bold mb-2 md:px-10 text-[20px] md:text-[26px]">
          북부지점에서 앞으로 이루고 싶은 가장 큰 목표와, 그 목표 달성에 기여할
          수 있는 인재는 어떤 분인지 궁금해요.
        </h2>
        <p className="mb-10 md:px-10 text-[17px] mt-4 md:text-[19px]">
          저희 위드업 사업단 북부지점은 앞으로 학습자 한 분 한 분에게 &apos;여기
          만나서 정말 다행이다&apos;라는 말을 듣는 지점이 되고 싶습니다.
          <br />
          <br /> 그 목표를 이루려면 밝고 긍정적인 에너지로 사람을 대하고, 실행력
          있게 움직일 줄 아는 분이 필요해요. 함께 고민하고 배우면서 성장할
          준비가 된 분이라면 누구들 우리 팀의 든든한 동료가 될 수 있습니다.
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
          <Link href="/recruit/21">
            <Button
              variant="outline"
              className="w-[100px] h-[40px] bg-[#2B7FFF] text-white rounded-xl hover:text-white font-bold hover:bg-[#1459c5]"
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
