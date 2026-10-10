import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, Michroma } from "next/font/google";
import "./globals.css";

// Wide grotesk for wordmarks, nav and labels.
const michroma = Michroma({ variable: "--font-michroma", weight: "400", subsets: ["latin"] });
// Refined serif for display lines.
const instrument = Instrument_Serif({ variable: "--font-instrument", weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
// Quiet sans for running text.
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vauclère — Verdin & Sumac",
  description: "A fictional atelier that builds two open two-seaters by hand. A design demo.",
};

export const viewport: Viewport = {
  themeColor: "#ECEBDF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${michroma.variable} ${instrument.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
