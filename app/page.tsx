import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { TechStack } from "@/components/sections/TechStack";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Experience />
      <TechStack />
      <SelectedWork
        track="stack"
        eyebrow="Selected Work — 01"
        title={
          <>
            Built with the <span className="text-accent">stack</span>.
          </>
        }
        countLabel="04 PROJECTS · PRODUCTION"
        id="work-stack"
      />
      <SelectedWork
        track="vibe"
        eyebrow="Selected Work — 02"
        title={
          <>
            Vibe-<span className="text-accent">coded</span>.
          </>
        }
        countLabel="01 PROJECT · AI-COLLAB"
        id="work-vibe"
      />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
