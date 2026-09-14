import type { Metadata } from "next";
import { siteOrigin } from "@/lib/site-origin";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/dm-sans";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import "./cafe.css";
import "./motion.css";
export const metadata: Metadata = {
  ...(siteOrigin() ? { metadataBase: new URL(siteOrigin()!) } : {}),
  title: "PEBBLE — Specialty coffee, Bucharest",
  description:
    "A little hidden. Easy to love. MERON specialty coffee, plants and a slower pace at PEBBLE, Mendeleev 10, Bucharest.",
  icons: { icon: "/images/snail.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
