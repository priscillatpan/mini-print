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

export default function Home() {
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
  const [splashExiting, setSplashExiting] = useState(false);
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

  const handleSplashTap = () => {
    setSplashExiting(true);
    setTimeout(() => setPhase("capture"), 300);
  };

  // ─── Splash screen ───
  if (phase === "power-on") {
    return (
      <div
        className={`h-dvh flex flex-col items-center justify-center px-4 cursor-pointer select-none ${splashExiting ? "animate-splash-exit" : ""}`}
        onClick={handleSplashTap}
      >
        <p className="text-[#4a7a9a] text-xs mb-1 animate-splash-subtitle tracking-wide">
          welcome to
        </p>
        <h1
          className="text-3xl font-semibold tracking-tight text-[#2a5a7a] mb-3 animate-splash-title"
        >
          mini print
        </h1>
        <p className="text-[#6a9abb] text-[11px] animate-splash-subtitle" style={{ animationDelay: "0.3s" }}>
          tap to start
        </p>
      </div>
    );
  }

  // ─── Capture phase ───
  if (phase === "capture") {
    return (
      <div className="h-dvh flex flex-col items-center justify-center px-6 relative">
        {showFlash && (
          <div className="fixed inset-0 bg-white z-50 animate-flash" style={{ pointerEvents: "none" }} />
        )}

        {/* Camera icon */}
        <div className="mb-6 animate-fade-in">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="13" r="3" stroke="#3a7aaa" strokeWidth="1.5" />
            <path d="M3 13c0-2.81 0-4.21.67-5.22a4 4 0 0 1 1.1-1.1C5.79 6 7.19 6 10 6h4c2.81 0 4.21 0 5.22.67.44.29.81.67 1.1 1.1.67 1.01.68 2.42.68 5.22s0 4.21-.67 5.22a4 4 0 0 1-1.1 1.1c-1.01.68-2.42.68-5.22.68h-4c-2.81 0-4.21 0-5.22-.67a4 4 0 0 1-1.1-1.1c-.23-.35-.38-.74-.48-1.22" stroke="#3a7aaa" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 10h-.5" stroke="#3a7aaa" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14.5 3.5h-5" stroke="#3a7aaa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-[#4a7a9a] text-xs mb-10 animate-fade-in tracking-wide" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
          mini print
        </p>

        {/* Camera / Library cards */}
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center gap-2.5 px-8 py-5 bg-white/35 backdrop-blur-sm border border-white/40 rounded-2xl active:scale-95 transition-all shadow-sm"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="13" r="3" stroke="#3a6a8a" strokeWidth="1.5" />
              <path d="M3 13c0-2.81 0-4.21.67-5.22a4 4 0 0 1 1.1-1.1C5.79 6 7.19 6 10 6h4c2.81 0 4.21 0 5.22.67.44.29.81.67 1.1 1.1.67 1.01.68 2.42.68 5.22s0 4.21-.67 5.22a4 4 0 0 1-1.1 1.1c-1.01.68-2.42.68-5.22.68h-4c-2.81 0-4.21 0-5.22-.67a4 4 0 0 1-1.1-1.1c-.23-.35-.38-.74-.48-1.22" stroke="#3a6a8a" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M18 10h-.5" stroke="#3a6a8a" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14.5 3.5h-5" stroke="#3a6a8a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[13px] font-medium text-[#3a6a8a]">Camera</span>
          </button>

          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center gap-2.5 px-8 py-5 bg-white/35 backdrop-blur-sm border border-white/40 rounded-2xl active:scale-95 transition-all shadow-sm"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a6a8a" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-[13px] font-medium text-[#3a6a8a]">Library</span>
          </button>
        </div>

        {/* Camera input (opens camera on mobile) */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />
        {/* Gallery input (opens file picker) */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    );
  }

  // ─── Developing phase: "add a note" ───
  if (phase === "developing") {
    return (
      <div className="h-dvh flex flex-col items-center justify-center px-6">
        <p className="text-sm text-[#4a7a9a] mb-5">add a note</p>

        {/* Polaroid ejecting from camera */}
        <div className="mb-6 animate-eject">
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
          className="w-full max-w-[280px] border-b border-[#a4c4dd] bg-transparent px-1 py-2 text-center text-sm text-[#2a5a7a] focus:outline-none focus:border-[#6a9abb] placeholder:text-[#9abccc]"
        />

        <p className="text-[10px] text-[#8ab0c8] mt-1 mb-6">
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
                  ? "border-[#3a7aaa] scale-110"
                  : "border-white/50"
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
          <span className="text-xs text-[#4a7a9a]">add date</span>
        </label>

        {/* Done */}
        <button
          onClick={handleDone}
          className="px-10 py-2.5 text-sm font-medium bg-[#3a7aaa] text-white rounded-full hover:bg-[#2a6a9a] transition-colors shadow-sm"
        >
          Done
        </button>
      </div>
    );
  }

  // ─── Done phase ───
  return (
    <div className="h-dvh flex flex-col items-center justify-center px-4 gap-6">
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
          className="w-full py-3 text-sm font-medium bg-[#3a7aaa] text-white rounded-full hover:bg-[#2a6a9a] disabled:opacity-50 transition-colors shadow-sm"
        >
          {exporting ? "Exporting..." : "Share"}
        </button>

        <button
          onClick={handleDownload}
          disabled={exporting}
          className="w-full py-3 text-sm font-medium text-[#3a6a8a] border border-[#3a7aaa]/30 rounded-full hover:border-[#3a7aaa]/50 disabled:opacity-50 transition-colors"
        >
          Save
        </button>

        <button
          onClick={handleStartOver}
          className="w-full py-2 text-xs text-[#6a9abb] hover:text-[#3a6a8a] transition-colors"
        >
          start over
        </button>
      </div>
    </div>
  );
}
