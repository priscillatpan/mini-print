"use client";

import { useCallback, useRef, useState } from "react";
import { usePolaroid } from "@/context/polaroid-context";
import PolaroidFrame from "@/components/polaroid-frame";
import StepNav from "@/components/step-nav";

export default function UploadPage() {
  const { imageSrc, setImageSrc, frameColor, filter, captionText, captionFont, showDate } =
    usePolaroid();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setImageSrc]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

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

        {/* Upload area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`w-full max-w-[320px] rounded-lg border-2 border-dashed p-5 transition-colors ${
            dragging
              ? "border-neutral-800 bg-neutral-100"
              : "border-neutral-200"
          }`}
        >
          <div className="flex gap-3">
            {/* Take a photo */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 py-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-600"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span className="text-xs text-neutral-600 font-medium">
                Take photo
              </span>
            </button>

            {/* Choose from library */}
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-2 py-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-600"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs text-neutral-600 font-medium">
                Choose photo
              </span>
            </button>
          </div>

          {imageSrc && (
            <p className="text-xs text-neutral-400 text-center mt-3">
              Tap again to change photo
            </p>
          )}

          {/* Camera input — capture attribute opens native camera on mobile */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />

          {/* Gallery input — no capture attribute opens photo picker */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <StepNav nextHref="/create/style" nextDisabled={!imageSrc} />
    </>
  );
}
