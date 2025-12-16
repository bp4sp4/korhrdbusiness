"use client";

import styles from "./NewsSection.module.css";
import Image from "next/image";
import Link from "next/link";

const newsData = [
  {
    title:
      "한평생교육, 교육컨설팅 브랜드 '에듀바이저스' 출범… 커리어 설계 중심 서비스 강화",
    date: "2025.07.22",
    link: "https://www.ksilbo.co.kr/news/articleView.html?idxno=1032547",
    thumbnail: "/images/main/news1.jpg",
    source: "경상일보",
  },

  {
    title: "한평생교육, 교육컨설팅 브랜드 '에듀바이저스' 출범",
    date: "2024.07.21",
    link: "https://www.nbntv.co.kr/news/articleView.html?idxno=4005015",
    thumbnail: "/images/main/news2.jpg",
    source: "내외경제TV",
  },
  {
    title: "한평생교육, 교육컨설팅 전문 브랜드 '에듀바이저스' 출범",
    date: "2024.07.17",
    link: "http://www.kdpress.co.kr/news/articleView.html?idxno=139430",
    thumbnail: "/images/main/news4.png",
    source: "데일리경제",
  },
  {
    title: "한평생교육, 교육컨설팅 브랜드 '에듀바이저스' 공식 출범",
    date: "2024.07.18",
    link: "https://www.gokorea.kr/news/articleView.html?idxno=833065",
    thumbnail: "/images/main/news3.jpg",
    source: "공감신문",
  },

  {
    title:
      "한평생교육, 교육컨설팅 브랜드 '에듀바이저스' 출범… 커리어 설계 중심 서비스 강화",
    date: "2024.07.16",
    link: "https://www.siminilbo.co.kr/news/newsview.php?ncode=1160287540055868",
    thumbnail: "/images/main/news5.jpg",
    source: "시민일보",
  },
  {
    title:
      "한평생교육, '에듀바이저스' 공식 출범… 교육서비스에 커리어 컨설팅 접목",
    date: "2024.07.23",
    link: "https://www.siminilbo.co.kr/news/newsview.php?ncode=1160287540055868",
    thumbnail: "/images/main/news6.jpg",
    source: "시민일보",
  },
];

export default function NewsSection() {
  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        <div className={styles.tag}>PR</div>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>언론 속 한평생 에듀바이저스</h2>
          <Link
            href="/recruit/news"
            className="hover:text-[#1E1E1E] text-[#979797] group"
          >
            <span className="flex items-center pb-0.1 transition-all">
              더보기
              <span style={{ width: 14, height: 14 }}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m7.5 20.4c-.5-.5-.5-1.2 0-1.7l6.7-6.7-6.8-6.7c-.5-.5-.5-1.2 0-1.7s1.2-.5 1.7 0l7.5 7.5c.5.5.5 1.2 0 1.7l-7.5 7.5c-.2.3-.5.4-.8.4s-.6-.1-.8-.3z"
                    fill="#b0b8c1"
                    className="transition-colors group-hover:fill-[#1E1E1E]"
                  ></path>
                </svg>
              </span>
            </span>
          </Link>
        </div>
        <div className={styles.newsGrid}>
          {newsData.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.newsCard}
            >
              <div className={styles.thumbnailContainer}>
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className={styles.thumbnail}
                />
              </div>
              <div className={styles.newsContent}>
                <div className={styles.newsMeta}>
                  <span className={styles.source}>{item.source}</span>
                  <span className={styles.date}>{item.date}</span>
                </div>
                <h3 className={styles.newsTitle}>{item.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
