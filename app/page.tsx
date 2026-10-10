import { MotionConfig } from "framer-motion";
import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Anatomy } from "@/components/sections/Anatomy";
import { Models } from "@/components/sections/Models";
import { Colour } from "@/components/sections/Colour";
import { Inquiry } from "@/components/sections/Inquiry";
import { SiteBar } from "@/components/ui/SiteBar";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteBar />
      <main>
        <Hero />
        <Manifesto />
        <Anatomy />
        <Models />
        <Colour />
        <Inquiry />
      </main>
    </MotionConfig>
  );
}
