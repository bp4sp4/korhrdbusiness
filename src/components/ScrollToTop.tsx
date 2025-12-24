"use client";

export default function ScrollToTop() {
  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
      <img
        src="/images/upbtn.png"
        alt="맨 위로 이동"
        aria-label="맨 위로 이동"
        className="w-12 h-12 sm:w-10 sm:h-10 cursor-pointer hover:opacity-80 active:opacity-70 transition-opacity shadow-lg"
        onClick={handleScrollToTop}
      />
    </div>
  );
}

