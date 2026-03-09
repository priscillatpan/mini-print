"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePolaroid } from "@/context/polaroid-context";
import PolaroidFrame from "@/components/polaroid-frame";
import { exportPolaroid } from "@/lib/export";

export default function DownloadPage() {
  const polaroid = usePolaroid();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generateImage = async () => {
    if (!polaroid.imageSrc) return null;
    setExporting(true);
    try {
      const blob = await exportPolaroid({
        imageSrc: polaroid.imageSrc,
        frameColor: polaroid.frameColor,
        filter: polaroid.filter,
        captionText: polaroid.captionText,
        captionFont: polaroid.captionFont,
        showDate: polaroid.showDate,
      });
      return blob;
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
      const file = new File([blob], "polaroid.png", { type: "image/png" });
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
    link.download = "polaroid.png";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSavePreview = async () => {
    const blob = await generateImage();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const handleStartOver = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    polaroid.reset();
    router.push("/create/upload");
  };

  // Show the rendered image for long-press saving on mobile
  if (previewUrl) {
    return (
      <div className="flex flex-col items-center gap-6 flex-1 w-full pt-4">
        <p className="text-sm text-neutral-500">Hold the image to save to Photos</p>
        <img
          src={previewUrl}
          alt="Your polaroid"
          className="w-full max-w-[320px] rounded-sm shadow-lg"
        />
        <button
          onClick={() => {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }}
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 flex-1 w-full pt-4">
      <PolaroidFrame
        imageSrc={polaroid.imageSrc}
        frameColor={polaroid.frameColor}
        filter={polaroid.filter}
        captionText={polaroid.captionText}
        captionFont={polaroid.captionFont}
        showDate={polaroid.showDate}
      />

      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        {/* Share is primary — opens native share sheet on iOS (Save to Photos lives there) */}
        <button
          onClick={handleShare}
          disabled={exporting}
          className="w-full px-6 py-3 text-sm font-medium bg-neutral-800 text-white rounded-full hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {exporting ? "Exporting..." : "Share"}
        </button>

        <button
          onClick={handleDownload}
          disabled={exporting}
          className="w-full px-6 py-3 text-sm font-medium border border-neutral-300 rounded-full hover:border-neutral-400 disabled:opacity-50 transition-colors"
        >
          Download PNG
        </button>

        <button
          onClick={handleSavePreview}
          disabled={exporting}
          className="w-full px-6 py-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Save to Photos (hold to save)
        </button>

        <button
          onClick={handleStartOver}
          className="w-full px-6 py-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
