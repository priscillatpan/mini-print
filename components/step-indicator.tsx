"use client";

import { usePathname } from "next/navigation";

const STEPS = [
  { path: "/create/upload", label: "Upload" },
  { path: "/create/style", label: "Style" },
  { path: "/create/caption", label: "Caption" },
  { path: "/create/download", label: "Save" },
];

export default function StepIndicator() {
  const pathname = usePathname();
  const currentIndex = STEPS.findIndex((s) => s.path === pathname);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {STEPS.map((step, i) => (
        <div key={step.path} className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= currentIndex ? "bg-neutral-800" : "bg-neutral-300"
            }`}
          />
          {i < STEPS.length - 1 && (
            <div
              className={`w-6 h-px ${
                i < currentIndex ? "bg-neutral-800" : "bg-neutral-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
