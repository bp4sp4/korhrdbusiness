import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "40대여성",
    username: "#경력단절 #재취업 #육아병행",
    body: "아이 초등학교 들어가기 전에 어린이집 보내고 남는 시간에 준비했어요. 처음엔 과연 내가 할 수 있을까 반신반의했는데,천천히 따라가다 보니 어느새 과정 다 마쳤네요.특히 수업 들으면서 챙겨줄 수 있는 건 다 챙겨주신 게 좋았어요.",
    img: "images/about/review/40w.png",
  },
  {
    name: "50대남성",
    username: "#은퇴후직업 #자기계발 #취업준비",
    body: "배움에 나이가 중요하지 않다는 걸 느꼈습니다. 누군가가 아닌 나를 위해서 무언가 해보는 게 정말 오랜만이고 보람찬 과정 통해서 하루하루 만들어 나가는 게 정말 뿌듯하네요. 온라인으로 무언가 한다는 게 처음엔 걱정됐지만 며칠 해보니 익숙해지더군요. 덕분에 잘 마쳤습니다.",
    img: "images/about/review/50m.png",
  },
  {
    name: "30대여성",
    username: "#육아병행 #진로설계 #자격증준비",
    body: "아이 낮잠 잘 때 짬짬이 들을 수 있어서 부담 없이 시작했어요.처음엔 무조건 자격증만 따야지 했는데,공부하다 보니 오히려 제가 어떤 방향으로 나아가야 할지 생각하게 되더라고요.덕분에 자존감도 많이 회복됐고, 오랜만에 제 삶을 위한 결정을 한 것 같아 뿌듯해요.",
    img: "images/about/review/30w.png",
  },
  {
    name: "20대남성",
    username: "#비전공자 #스펙업 #자격증준비",
    body: "관련 전공도 아니고 아무것도 몰랐는데, 친절하게 하나씩 설명해주셔서 수월하게 따라갈 수 있었어요. 자격증 준비하면서 실무 감각도 조금씩 생긴 느낌이에요. 특히 처음 상담 때부터 과정이 끝날 때까지 계속 챙겨주셔서 든든하고 공신력 있는 곳에서 진행해서 믿음이 갔어요. 감사합니다.",
    img: "images/about/review/20m.png",
  },
  {
    name: "20대여성",
    username: "#학사편입 #학벌개선 #학점은행제",
    body: "처음엔 편입을 어떻게 준비해야 할지 막막했는데, 학점은행제로 방향을 잡고 나니 훨씬 수월해졌어요. 중간에 포기하고 싶을 때도 있었지만, 에듀바이저스에서 커리큘럼도, 일정 관리도 잘 도와주셔서 끝까지 해낼 수 있었어요. 결국 원하는 대학에 편입 성공했어요!",
    img: "images/about/review/20w.png",
  },
  {
    name: "40대여성",
    username: "#전업주부 #재취업준비",
    body: "사실 아무것도 모르고 무작정 시작한 느낌이 컸는데,수업이랑 실습 등등 필요한 것들은 에듀바이저님이 꼼꼼하게 챙겨주셔서 어렵지 않게 마무리할 수 있었어요.반복되는 일상들을 보냈었지만 요즘은 제가 조금씩 성장하고 있다는 걸 느껴요.자연스럽게 어디에 취업하고 싶은지도 생각이 있어요! ",
    img: "images/about/review/40w.png",
  },
  {
    name: "60대여성",
    username: "#자기계발 #취업준비",
    body: "막내까지 대학보내고 저를 위한 시간을 쓰는 게 처음이였어요. 괜히 이 나이에 시작해서 돈만 버릴까봐 싶기도 하고 사실 좀 쑥스럽기도 했고요. 그런데 수업 참여하면서 보니 같은 연령대 수강생도 많아서 저도 힘내서 마칠 수 있었던 것 같아요. 큰 변화까진 아니더라도 작은 자신감을 하나 얻은 느낌이에요.",
    img: "images/about/review/60w.png",
  },
];

const firstRow = reviews.slice(0, 7);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] "
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full object-cover"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white mb-0.5">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-blue-500 dark:text-blue-400">
            {username.split(" ").map((tag, index) => (
              <span
                key={index}
                className="inline-block  dark:bg-blue-900/30 text-[#2b7fff] dark:text-blue-400 px-0.5 py-1 rounded-full mr-1 mb-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-[17px]">{body}</blockquote>
    </figure>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mb-5">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
