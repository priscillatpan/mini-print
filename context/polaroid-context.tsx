"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type FrameColor =
  | "white"
  | "cream"
  | "black"
  | "pastel-pink"
  | "pastel-blue"
  | "pastel-mint"
  | "pastel-lavender";

export type Filter =
  | "none"
  | "warm-vintage"
  | "cool-film"
  | "bw"
  | "faded-polaroid";

export type CaptionFont = "Caveat" | "Shadows Into Light" | "Patrick Hand";

interface PolaroidState {
  imageSrc: string | null;
  frameColor: FrameColor;
  filter: Filter;
  captionText: string;
  captionFont: CaptionFont;
  showDate: boolean;
  setImageSrc: (src: string | null) => void;
  setFrameColor: (color: FrameColor) => void;
  setFilter: (filter: Filter) => void;
  setCaptionText: (text: string) => void;
  setCaptionFont: (font: CaptionFont) => void;
  setShowDate: (show: boolean) => void;
  reset: () => void;
}

const PolaroidContext = createContext<PolaroidState | null>(null);

export function PolaroidProvider({ children }: { children: ReactNode }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [frameColor, setFrameColor] = useState<FrameColor>("white");
  const [filter, setFilter] = useState<Filter>("faded-polaroid");
  const [captionText, setCaptionText] = useState("");
  const [captionFont, setCaptionFont] = useState<CaptionFont>("Caveat");
  const [showDate, setShowDate] = useState(false);

  const reset = () => {
    setImageSrc(null);
    setFrameColor("white");
    setFilter("faded-polaroid");
    setCaptionText("");
    setCaptionFont("Caveat");
    setShowDate(false);
  };

  return (
    <PolaroidContext.Provider
      value={{
        imageSrc,
        frameColor,
        filter,
        captionText,
        captionFont,
        showDate,
        setImageSrc,
        setFrameColor,
        setFilter,
        setCaptionText,
        setCaptionFont,
        setShowDate,
        reset,
      }}
    >
      {children}
    </PolaroidContext.Provider>
  );
}

export function usePolaroid() {
  const ctx = useContext(PolaroidContext);
  if (!ctx) throw new Error("usePolaroid must be used within PolaroidProvider");
  return ctx;
}
