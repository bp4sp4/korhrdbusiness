import { HTMLAttributes } from "react";

export interface Iphone15ProProps extends HTMLAttributes<HTMLDivElement> {
  width?: number;
  src?: string;
  videoSrc?: string;
}

export default function Iphone15Pro({
  width = 340,
  src,
  videoSrc,
  ...props
}: Iphone15ProProps) {
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        aspectRatio: "433 / 882",
        margin: "0 auto",
      }}
      {...props}
    >
      {/* 비디오 또는 이미지 */}
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "40px",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: 1,
          }}
        />
      ) : (
        src && (
          <img
            src={src}
            alt="iPhone Screen Content"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "40px",
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: 1,
            }}
          />
        )
      )}
      {/* mockup 프레임 (SVG나 PNG) */}
      <img
        src="/images/iphone15pro-frame.png"
        alt="iPhone 15 Pro Frame"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
