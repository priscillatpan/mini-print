"use client";

import { useRouter } from "next/navigation";

interface StepNavProps {
  backHref?: string;
  nextHref?: string;
  nextDisabled?: boolean;
  nextLabel?: string;
}

export default function StepNav({
  backHref,
  nextHref,
  nextDisabled = false,
  nextLabel = "Next",
}: StepNavProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center w-full max-w-[320px] mx-auto mt-6">
      {backHref ? (
        <button
          onClick={() => router.push(backHref)}
          className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Back
        </button>
      ) : (
        <div />
      )}
      {nextHref && (
        <button
          onClick={() => router.push(nextHref)}
          disabled={nextDisabled}
          className="px-6 py-2 text-sm font-medium bg-neutral-800 text-white rounded-full hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
