"use client";

export default function ScrollToTop() {
  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 sm:right-8 z-50">
      <img
        src="/images/upbtn.png"
        alt="맨 위로 이동"
        aria-label="맨 위로 이동"
        className="w-10 h-10 cursor-pointer sm:w-10 sm:h-10 hover:opacity-80 transition-opacity"
        onClick={handleScrollToTop}
      />
    </div>
  );
}

