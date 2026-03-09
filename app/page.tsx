import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Polaroid Creator</h1>
      <p className="text-neutral-500 mb-8 max-w-sm">
        Turn any photo into a cute, shareable digital polaroid. No sign-up needed.
      </p>
      <Link
        href="/create/upload"
        className="px-8 py-3 text-sm font-medium bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
      >
        Create a polaroid
      </Link>
    </div>
  );
}
