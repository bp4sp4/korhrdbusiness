"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function UpButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,

        border: "none",
        cursor: "pointer",
        display: show ? "block" : "none",
        zIndex: 1000,
        borderRadius: "50%",

        padding: 0,
        transition: "opacity 0.3s",
        width: 68,
        height: 68,
        opacity: show ? 1 : 0,
        overflow: "hidden",
      }}
    >
      <Image
        src="/images/upbtn.png"
        alt="맨 위로"
        width={48}
        height={38}
        style={{
          display: "block",
          margin: "0 auto",
          filter:
            "invert(27%) sepia(70%) saturate(2000%) hue-rotate(190deg) brightness(80%) contrast(100%)",
        }}
      />
    </button>
  );
}
