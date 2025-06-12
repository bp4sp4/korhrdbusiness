"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const jobs = [
  {
    id: 1,
    title: "보험설계사 (위촉직 대면 FC, 직영)",
    tags: ["비즈니스", "보험영업", "상담", "손해보험"],
    date: "2025.06.05",
    status: "단기계약직",
    isEvent: false,
  },
  {
    id: 2,
    title: "이벤트: 보험설계사 컨퍼런스",
    tags: ["이벤트", "보험영업", "컨퍼런스"],
    date: "2025.07.15",
    status: "이벤트",
    isEvent: true,
  },
  {
    id: 3,
    title: "보험설계사 (위촉직 대면 FC, 직영)",
    tags: ["비즈니스", "보험영업", "상담", "손해보험"],
    date: "2025.06.05",
    status: "단기계약직",
    isEvent: false,
  },
  {
    id: 4,
    title: "이벤트: 보험설계사 컨퍼런스",
    tags: ["이벤트", "보험영업", "컨퍼런스"],
    date: "2025.07.15",
    status: "이벤트",
    isEvent: true,
  },
];

export default function RecruitListPage() {
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("all");
  const [type, setType] = useState("all");
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data: admins } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email);
      setIsAdmin(Array.isArray(admins) && admins.length > 0);
    }
    checkAdmin();
  }, []);

  const recruitList = jobs.filter((job) => !job.isEvent);
  const eventList = jobs.filter((job) => job.isEvent);

  const filtered = jobs.filter(
    (job) =>
      (company === "all" || job.status === company) &&
      (keyword === "" || job.title.includes(keyword))
  );

  return (
    <main className="max-w-6xl mx-auto mt-10 py-12 px-4">
      <section className="recruit-header-section flex justify-between items-start">
        <div>
          <h1 className="text-[42px] font-bold mb-2">
            대한민국 교육과 취업의 연결
            <br />그 위대한 도전을 한평생에서 함께해보세요.
          </h1>
          <p className="text-gray-500 mb-6 text-[15px]">
            한평생가이던스는 단순히 교육서비스를 판매하는곳이 아닙니다. 고객이
            현재 처한 상황을 면밀히 분석하여
            <br /> 실제 대한민국이 직면한 문제인 교육과 취업이 연결되지 않는다는
            문제를 해결하는 팀 입니다.
            <br />
            이제는 정말 교육시장을 사명감 있게 주도하는 기업이 나와야 합니다.
          </p>

          {/* 검색/필터 바 */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="직무, 키워드로 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1"
            />

            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="모든 지역" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 지역</SelectItem>
                <SelectItem value="서울북부">서울북부</SelectItem>
                <SelectItem value="서울강남">서울강남</SelectItem>
                <SelectItem value="서울은평">서울은평</SelectItem>
                <SelectItem value="서울가산">서울가산</SelectItem>
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="분류" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">분류</SelectItem>
                <SelectItem value="지점장">지점장</SelectItem>
                <SelectItem value="팀장급">팀장급</SelectItem>
                <SelectItem value="경력">경력</SelectItem>
                <SelectItem value="신입">신입</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setCompany("all");
                setType("all");
                setKeyword("");
              }}
            >
              초기화
            </Button>
          </div>
        </div>
        {isAdmin && (
          <button className="ml-4 px-4 py-2 bg-green-600 text-white rounded font-semibold shadow">
            설계사 등록
          </button>
        )}
      </section>

      {/* 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* 왼쪽 2칸: 설계사 채용 리스트 */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {recruitList.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg flex items-center justify-center min-h-[140px] h-full"
            >
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center justify-around gap-4 w-full">
                  <div className="font-semibold text-lg text-center">
                    {job.title}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 오른쪽 1칸: 이벤트/외부채용 */}
        <div
          className="flex flex-col gap-4"
          style={{
            minWidth: 220,
            maxWidth: 320,
            position: "relative",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          {eventList.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-3 flex flex-col h-full bg-gray-50"
              style={{ fontSize: 14, minHeight: 90 }}
            >
              <div className="flex-1">
                <div className="font-semibold mb-1">{job.title}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {job.tags.join(" · ")}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="text-xs text-gray-400">{job.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
