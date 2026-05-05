import { currently } from "@/lib/currently";
import { FadeUp } from "@/components/motion/FadeUp";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function About() {
  return (
    <section id="about" className="py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-20">
        <FadeUp>
          <SectionHeader
            eyebrow="About"
            meta="MUMBAI · GMT+5:30"
            className="mb-12 lg:mb-16"
          />
        </FadeUp>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeUp className="lg:col-span-7">
            <p
              className="font-display font-semibold leading-[1.15] tracking-[-0.02em] text-ink"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              I&apos;m drawn to the parts of the stack where{" "}
              <span className="text-accent">craft shows</span> — type, motion,
              and the seams between systems that should feel like one thing.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="lg:col-span-5">
            <div className="border border-rule bg-paper p-8 lg:p-10">
              <p className="mb-8 flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Currently
              </p>
              <ul className="space-y-5 font-sans text-base text-ink">
                {currently.map((c) => (
                  <li
                    key={c.label}
                    className="grid grid-cols-[100px_1fr] items-baseline gap-x-4 border-t border-rule pt-4 first:border-t-0 first:pt-0"
                  >
                    <span className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-dim">
                      {c.label}
                    </span>
                    <span className="text-base">{c.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
