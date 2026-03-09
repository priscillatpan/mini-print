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

interface ExportOptions {
  imageSrc: string;
  frameColor: FrameColor;
  filter: Filter;
  captionText: string;
  captionFont: CaptionFont;
  showDate: boolean;
}

// Instax Mini proportions scaled to export size
// Frame: 5.4 x 8.6 cm → at 1200px wide: 1200 x 1911
const EXPORT_WIDTH = 1200;
const EXPORT_HEIGHT = Math.round(EXPORT_WIDTH * (8.6 / 5.4));

// Photo area percentages (from polaroid-frame.tsx)
const PHOTO_LEFT = 0.074;
const PHOTO_TOP = 0.0465;
const PHOTO_WIDTH = 1 - 2 * PHOTO_LEFT;
const PHOTO_HEIGHT = 0.72;

// Caption area
const CAPTION_BOTTOM = 0;
const CAPTION_HEIGHT = 0.2335;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function exportPolaroid(options: ExportOptions): Promise<Blob> {
  const { imageSrc, frameColor, filter, captionText, captionFont, showDate } =
    options;

  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  // Draw frame background
  ctx.fillStyle = FRAME_COLORS[frameColor];
  ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

  // Draw photo area background
  const photoX = Math.round(EXPORT_WIDTH * PHOTO_LEFT);
  const photoY = Math.round(EXPORT_HEIGHT * PHOTO_TOP);
  const photoW = Math.round(EXPORT_WIDTH * PHOTO_WIDTH);
  const photoH = Math.round(EXPORT_HEIGHT * PHOTO_HEIGHT);

  const isDark = frameColor === "black";
  ctx.fillStyle = isDark ? "#2a2a2a" : "#f0f0f0";
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Draw the photo
  const img = await loadImage(imageSrc);

  // Apply filter
  if (filter !== "none") {
    ctx.filter = FILTERS[filter];
  }

  // Cover-fit the image into the photo area
  const imgRatio = img.width / img.height;
  const areaRatio = photoW / photoH;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;

  if (imgRatio > areaRatio) {
    sw = img.height * areaRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / areaRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
  ctx.filter = "none";

  // Draw caption
  const textColor = isDark ? "#e5e5e5" : "#333333";
  const captionAreaY = EXPORT_HEIGHT * (1 - CAPTION_HEIGHT);
  const captionCenterY = captionAreaY + (EXPORT_HEIGHT * CAPTION_HEIGHT) / 2;

  if (captionText) {
    ctx.fillStyle = textColor;
    ctx.font = `${Math.round(EXPORT_WIDTH * 0.045)}px "${captionFont}", cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textY = showDate ? captionCenterY - 10 : captionCenterY;
    ctx.fillText(captionText, EXPORT_WIDTH / 2, textY, EXPORT_WIDTH * 0.8);
  }

  if (showDate) {
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.5;
    ctx.font = `${Math.round(EXPORT_WIDTH * 0.025)}px "${captionFont}", cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const dateY = captionText ? captionCenterY + 25 : captionCenterY;
    ctx.fillText(dateStr, EXPORT_WIDTH / 2, dateY);
    ctx.globalAlpha = 1;
  }

  // Paper texture: generate noise and overlay
  const noiseCanvas = document.createElement("canvas");
  noiseCanvas.width = EXPORT_WIDTH;
  noiseCanvas.height = EXPORT_HEIGHT;
  const noiseCtx = noiseCanvas.getContext("2d")!;
  const noiseData = noiseCtx.createImageData(EXPORT_WIDTH, EXPORT_HEIGHT);
  for (let i = 0; i < noiseData.data.length; i += 4) {
    const v = Math.random() * 255;
    noiseData.data[i] = v;
    noiseData.data[i + 1] = v;
    noiseData.data[i + 2] = v;
    noiseData.data[i + 3] = isDark ? 15 : 10; // subtle opacity
  }
  noiseCtx.putImageData(noiseData, 0, 0);
  ctx.globalCompositeOperation = "multiply";
  ctx.drawImage(noiseCanvas, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}
