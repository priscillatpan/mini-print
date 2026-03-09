"use client";

import { usePolaroid } from "@/context/polaroid-context";
import PolaroidFrame, { FRAME_COLORS, FILTERS } from "@/components/polaroid-frame";
import StepNav from "@/components/step-nav";
import type { FrameColor, Filter } from "@/context/polaroid-context";

const FRAME_OPTIONS: { value: FrameColor; label: string }[] = [
  { value: "white", label: "White" },
  { value: "cream", label: "Cream" },
  { value: "black", label: "Black" },
  { value: "pastel-pink", label: "Pink" },
  { value: "pastel-blue", label: "Blue" },
  { value: "pastel-mint", label: "Mint" },
  { value: "pastel-lavender", label: "Lavender" },
];

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "none", label: "None" },
  { value: "warm-vintage", label: "Warm" },
  { value: "cool-film", label: "Cool" },
  { value: "bw", label: "B&W" },
  { value: "faded-polaroid", label: "Faded" },
];

export default function StylePage() {
  const {
    imageSrc,
    frameColor,
    setFrameColor,
    filter,
    setFilter,
    captionText,
    captionFont,
    showDate,
  } = usePolaroid();

  return (
    <>
      <div className="flex flex-col items-center gap-6 flex-1 w-full pt-4">
        <PolaroidFrame
          imageSrc={imageSrc}
          frameColor={frameColor}
          filter={filter}
          captionText={captionText}
          captionFont={captionFont}
          showDate={showDate}
        />

        {/* Frame color picker */}
        <div className="w-full max-w-[320px]">
          <p className="text-xs text-neutral-500 mb-2">Frame</p>
          <div className="flex gap-2 flex-wrap">
            {FRAME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFrameColor(opt.value)}
                title={opt.label}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  frameColor === opt.value
                    ? "border-neutral-800 scale-110"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
                style={{ backgroundColor: FRAME_COLORS[opt.value] }}
              />
            ))}
          </div>
        </div>

        {/* Filter picker */}
        <div className="w-full max-w-[320px]">
          <p className="text-xs text-neutral-500 mb-2">Filter</p>
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  filter === opt.value
                    ? "border-neutral-800 bg-neutral-800 text-white"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StepNav backHref="/create/upload" nextHref="/create/caption" />
    </>
  );
}
