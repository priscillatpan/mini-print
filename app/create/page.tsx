"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { usePolaroid } from "@/context/polaroid-context";
import PolaroidFrame, { FRAME_COLORS } from "@/components/polaroid-frame";
import { exportPolaroid } from "@/lib/export";
import type { FrameColor } from "@/context/polaroid-context";

const FRAME_OPTIONS: { value: FrameColor; label: string }[] = [
  { value: "white", label: "White" },
  { value: "cream", label: "Cream" },
  { value: "black", label: "Black" },
  { value: "pastel-pink", label: "Pink" },
  { value: "pastel-blue", label: "Blue" },
  { value: "pastel-mint", label: "Mint" },
  { value: "pastel-lavender", label: "Lavender" },
];

export default function CreatePage() {
  const {
    imageSrc,
    setImageSrc,
    frameColor,
    setFrameColor,
    filter,
    captionText,
    setCaptionText,
    captionFont,
    showDate,
    setShowDate,
    phase,
    setPhase,
    reset,
  } = usePolaroid();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [photoOpacity, setPhotoOpacity] = useState(0);
  const [exporting, setExporting] = useState(false);
  const developIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setPhotoOpacity(0);
        setShowFlash(true);
        if (navigator.vibrate) navigator.vibrate(50);
        setTimeout(() => {
          setShowFlash(false);
          setPhase("developing");
        }, 200);
      };
      reader.readAsDataURL(file);
    },
    [setImageSrc, setPhase]
  );

  // Slowly increase photo opacity while developing
  useEffect(() => {
    if (phase === "developing") {
      setPhotoOpacity(0);
      let opacity = 0;
      developIntervalRef.current = setInterval(() => {
        opacity += 0.005;
        if (opacity >= 0.3) {
          opacity = 0.3;
          if (developIntervalRef.current) clearInterval(developIntervalRef.current);
        }
        setPhotoOpacity(opacity);
      }, 100);
      return () => {
        if (developIntervalRef.current) clearInterval(developIntervalRef.current);
      };
    }
    if (phase === "done") {
      setPhotoOpacity(1);
    }
  }, [phase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDone = () => {
    if (developIntervalRef.current) clearInterval(developIntervalRef.current);
    setPhase("done");
  };

  const generateImage = async () => {
    if (!imageSrc) return null;
    setExporting(true);
    try {
      return await exportPolaroid({
        imageSrc,
        frameColor,
        filter,
        captionText,
        captionFont,
        showDate,
      });
    } catch (err) {
      console.error("Export failed:", err);
      return null;
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) return;
    try {
      const file = new File([blob], "miniprint.png", { type: "image/png" });
      if (navigator.share) {
        await navigator.share({ files: [file] });
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        alert("Copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  };

  const handleDownload = async () => {
    const blob = await generateImage();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "miniprint.png";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    if (developIntervalRef.current) clearInterval(developIntervalRef.current);
    reset();
  };

  // ─── Capture phase ───
  if (phase === "power-on" || phase === "capture") {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-neutral-900 px-4 relative">
        {showFlash && (
          <div className="fixed inset-0 bg-white z-50 animate-flash" style={{ pointerEvents: "none" }} />
        )}

        {/* Camera placeholder — replace with your own image later */}
        <div className="mb-4">
          <p className="text-6xl">📷</p>
        </div>

        <p className="text-neutral-500 text-xs mb-14">mini print</p>

        {/* Shutter + gallery */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="rounded-full bg-white border-[3px] border-neutral-400 active:scale-90 transition-all shadow-lg flex items-center justify-center"
            style={{ width: 72, height: 72 }}
          >
            <div className="w-[58px] h-[58px] rounded-full border-2 border-neutral-200" />
          </button>

          <div className="w-11 h-11" />
        </div>

        <p className="text-neutral-600 text-[11px] mt-5">
          take a photo or choose from library
        </p>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    );
  }

  // ─── Developing phase: "add a note" ───
  if (phase === "developing") {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-neutral-50 px-6">
        <p className="text-sm text-neutral-400 mb-5">add a note</p>

        {/* Small polaroid preview showing the frame + developing photo + live caption */}
        <div className="mb-6 animate-slide-up">
          <PolaroidFrame
            imageSrc={imageSrc}
            frameColor={frameColor}
            filter={filter}
            captionText={captionText}
            captionFont={captionFont}
            showDate={showDate}
            developing={true}
            photoOpacity={photoOpacity}
            className="w-[180px]"
          />
        </div>

        {/* Caption input */}
        <input
          type="text"
          value={captionText}
          onChange={(e) => setCaptionText(e.target.value.slice(0, 40))}
          placeholder="write something..."
          maxLength={40}
          className="w-full max-w-[280px] border-b border-neutral-300 bg-transparent px-1 py-2 text-center text-sm focus:outline-none focus:border-neutral-500 placeholder:text-neutral-300"
        />

        <p className="text-[10px] text-neutral-300 mt-1 mb-6">
          {captionText.length}/40
        </p>

        {/* Frame colors */}
        <div className="flex gap-2 mb-8">
          {FRAME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFrameColor(opt.value)}
              title={opt.label}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                frameColor === opt.value
                  ? "border-neutral-800 scale-110"
                  : "border-neutral-200"
              }`}
              style={{ backgroundColor: FRAME_COLORS[opt.value] }}
            />
          ))}
        </div>

        {/* Date toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer mb-8">
          <input
            type="checkbox"
            checked={showDate}
            onChange={(e) => setShowDate(e.target.checked)}
            className="rounded w-3.5 h-3.5"
          />
          <span className="text-xs text-neutral-400">add date</span>
        </label>

        {/* Done */}
        <button
          onClick={handleDone}
          className="px-10 py-2.5 text-sm font-medium bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  // ─── Done phase ───
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-neutral-50 px-4 gap-6">
      <PolaroidFrame
        imageSrc={imageSrc}
        frameColor={frameColor}
        filter={filter}
        captionText={captionText}
        captionFont={captionFont}
        showDate={showDate}
        developing={false}
        photoOpacity={1}
        className="w-[220px]"
      />

      <div
        className="w-full max-w-[320px] space-y-2 animate-fade-in"
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        <button
          onClick={handleShare}
          disabled={exporting}
          className="w-full py-3 text-sm font-medium bg-neutral-800 text-white rounded-full hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {exporting ? "Exporting..." : "Share"}
        </button>

        <button
          onClick={handleDownload}
          disabled={exporting}
          className="w-full py-3 text-sm font-medium border border-neutral-300 rounded-full hover:border-neutral-400 disabled:opacity-50 transition-colors"
        >
          Save
        </button>

        <button
          onClick={handleStartOver}
          className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          start over
        </button>
      </div>
    </div>
  );
}
