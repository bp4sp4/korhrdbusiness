"use client";

import { useState } from "react";
import styles from "./news.module.css";
import Image from "next/image";
import { getSortedNews } from "@/data/newsData";

const newsData = getSortedNews();
const initialCount = 6;

export default function News() {
  const [showAll, setShowAll] = useState(false);
  const displayedNews = showAll ? newsData : newsData.slice(0, initialCount);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>언론 속 한평생 에듀바이저스</h1>
        <p className={styles.subtitle}>
          한평생교육그룹의 다양한 소식과 업적을 확인하세요
        </p>
      </div>

      <div className={styles.newsGrid}>
        {displayedNews.map((item, index) => (
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

      {!showAll && newsData.length > initialCount && (
        <div className={styles.loadMoreContainer}>
          <button
            onClick={() => setShowAll(true)}
            className={styles.loadMoreButton}
          >
            더보기
            <svg
              className={styles.arrowIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
