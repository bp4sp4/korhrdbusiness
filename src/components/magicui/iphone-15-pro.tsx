import { SVGProps } from "react";

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
  videoSrc?: string;
}

export default function Iphone15Pro({
  width = 433,
  height = 882,
  src,
  videoSrc,
  ...props
}: Iphone15ProProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "340px",
        aspectRatio: "433 / 882",
        margin: "0 auto",
      }}
    >
      {/* 비디오 */}
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
