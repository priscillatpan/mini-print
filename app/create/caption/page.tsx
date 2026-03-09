"use client";

import { usePolaroid } from "@/context/polaroid-context";
import PolaroidFrame from "@/components/polaroid-frame";
import StepNav from "@/components/step-nav";
import type { CaptionFont } from "@/context/polaroid-context";

const FONT_OPTIONS: { value: CaptionFont; label: string; className: string }[] = [
  { value: "Caveat", label: "Caveat", className: "var(--font-caveat)" },
  { value: "Shadows Into Light", label: "Shadows", className: "var(--font-shadows)" },
  { value: "Patrick Hand", label: "Patrick", className: "var(--font-patrick)" },
];

export default function CaptionPage() {
  const {
    imageSrc,
    frameColor,
    filter,
    captionText,
    setCaptionText,
    captionFont,
    setCaptionFont,
    showDate,
    setShowDate,
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

        <div className="w-full max-w-[320px] space-y-4">
          {/* Caption input */}
          <div>
            <input
              type="text"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value.slice(0, 40))}
              placeholder="Add a caption..."
              maxLength={40}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 bg-white"
            />
            <p className="text-xs text-neutral-400 mt-1 text-right">
              {captionText.length}/40
            </p>
          </div>

          {/* Font picker */}
          <div>
            <p className="text-xs text-neutral-500 mb-2">Font</p>
            <div className="flex gap-2">
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCaptionFont(opt.value)}
                  style={{ fontFamily: opt.className }}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    captionFont === opt.value
                      ? "border-neutral-800 bg-neutral-800 text-white"
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDate}
              onChange={(e) => setShowDate(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-neutral-600">Show date</span>
          </label>
        </div>
      </div>

      <StepNav backHref="/create/style" nextHref="/create/download" nextLabel="Done" />
    </>
  );
}
