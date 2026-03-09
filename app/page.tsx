import Link from "next/link";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center px-4 text-center bg-neutral-900">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-1">mini print</h1>
      <p className="text-neutral-500 mb-8 text-sm max-w-xs">
        turn any photo into a cute little instant film print
      </p>
      <Link
        href="/create"
        className="px-8 py-3 text-sm font-medium bg-white text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
      >
        take a photo
      </Link>
    </div>
  );
}
