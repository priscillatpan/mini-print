"use client";

import { forwardRef } from "react";
import type { FrameColor, Filter, CaptionFont } from "@/context/polaroid-context";

const FRAME_COLORS: Record<FrameColor, string> = {
  white: "#ffffff",
  cream: "#faf5ef",
  black: "#1a1a1a",
  "pastel-pink": "#f8d7da",
  "pastel-blue": "#d1ecf1",
  "pastel-mint": "#d4edda",
  "pastel-lavender": "#e2d9f3",
};

const FILTERS: Record<Filter, string> = {
  none: "none",
  "warm-vintage": "sepia(0.15) saturate(1.2) brightness(1.05) contrast(0.95)",
  "cool-film": "saturate(0.9) brightness(1.05) contrast(1.1) hue-rotate(10deg)",
  bw: "grayscale(1) contrast(1.1)",
  "faded-polaroid": "sepia(0.1) saturate(0.85) brightness(1.1) contrast(0.9)",
};

interface PolaroidFrameProps {
  imageSrc: string | null;
  frameColor: FrameColor;
  filter: Filter;
  captionText: string;
  captionFont: CaptionFont;
  showDate: boolean;
  developing?: boolean;
  photoOpacity?: number;
  className?: string;
}

const PolaroidFrame = forwardRef<HTMLDivElement, PolaroidFrameProps>(
  (
    {
      imageSrc,
      frameColor,
      filter,
      captionText,
      captionFont,
      showDate,
      developing = false,
      photoOpacity,
      className,
    },
    ref
  ) => {
    const bgColor = FRAME_COLORS[frameColor];
    const isDark = frameColor === "black";
    const textColor = isDark ? "#e5e5e5" : "#333333";

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: bgColor,
          aspectRatio: "5.4 / 8.6",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)",
        }}
        className={`relative rounded-sm overflow-hidden ${className ?? "w-full max-w-[320px]"}`}
      >
        {/* Paper texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            opacity: isDark ? 0.06 : 0.04,
            mixBlendMode: "multiply",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Photo area */}
        <div
          style={{
            position: "absolute",
            top: "4.65%",
            left: "7.4%",
            right: "7.4%",
            height: "72%",
            overflow: "hidden",
            backgroundColor: isDark ? "#2a2a2a" : "#f0f0f0",
            borderRadius: "1px",
          }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Your polaroid photo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: FILTERS[filter],
                opacity: photoOpacity ?? 1,
                transition: developing ? "none" : "opacity 0.6s ease-out",
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span
                style={{ color: isDark ? "#555" : "#ccc" }}
                className="text-4xl"
              >
                +
              </span>
            </div>
          )}

        </div>

        {/* Caption area */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "23.35%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 10%",
          }}
        >
          {captionText && (
            <p
              style={{
                fontFamily: `"${captionFont}", cursive`,
                color: textColor,
                fontSize: "clamp(12px, 4.5cqw, 20px)",
                lineHeight: 1.2,
                textAlign: "center",
                wordBreak: "break-word",
              }}
            >
              {captionText}
            </p>
          )}
          {showDate && (
            <p
              style={{
                fontFamily: `"${captionFont}", cursive`,
                color: textColor,
                opacity: 0.5,
                fontSize: "clamp(8px, 2.5cqw, 12px)",
                marginTop: "2px",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    );
  }
);

PolaroidFrame.displayName = "PolaroidFrame";

export default PolaroidFrame;
export { FRAME_COLORS, FILTERS };
