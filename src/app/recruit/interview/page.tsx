import Link from "next/link";
import { interviews } from "./interviewList";
import "../../main.css";

export default function InterviewListPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12 ">
        <div className="text-sm text-gray-500 mb-2">한평생교육원의 사람들</div>
        <h1 className="text-4xl font-extrabold mb-2">한평생교육원 이야기</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {interviews.map((item) => (
          <Link
            key={item.name}
            href={`/recruit/interview/${item.name}`}
            className="block rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white border border-[#97979780]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-auto object-cover object-center"
            />
            <div className="p-6">
              <div className="font-bold text-xl mb-2">{item.title}</div>
              <div className="text-gray-500 mb-1">{item.subtitle}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
