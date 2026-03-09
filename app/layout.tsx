import type { Metadata } from "next";
import { Caveat, Shadows_Into_Light, Patrick_Hand } from "next/font/google";
import { PolaroidProvider } from "@/context/polaroid-context";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Polaroid Creator",
  description: "Turn any photo into a cute, shareable digital polaroid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${caveat.variable} ${shadowsIntoLight.variable} ${patrickHand.variable} antialiased bg-neutral-50 text-neutral-900 min-h-dvh`}
      >
        <PolaroidProvider>{children}</PolaroidProvider>
      </body>
    </html>
  );
}
