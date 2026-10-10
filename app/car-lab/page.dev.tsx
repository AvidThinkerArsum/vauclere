import type { Metadata } from "next";
import CarLab from "@/components/car/CarLab";

// Dev-only preview of the car drawing. Not linked anywhere and kept out of search engines.
export const metadata: Metadata = {
  title: "Car lab (dev)",
  robots: { index: false, follow: false },
};

export default function CarLabPage() {
  return <CarLab />;
}
