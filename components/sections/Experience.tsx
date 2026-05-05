import { experience } from "@/lib/experience";
import { FadeUp } from "@/components/motion/FadeUp";
import { Chip } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-20">
        <FadeUp>
          <SectionHeader
            eyebrow="Experience"
            title={
              <>
                Where I&apos;ve <span className="text-accent">shipped</span>.
              </>
            }
            meta={`${experience.length.toString().padStart(2, "0")} ROLES · 2021 — NOW`}
            className="mb-12 lg:mb-16"
          />
        </FadeUp>

        <ol>
          {experience.map((entry, i) => (
            <FadeUp key={entry.id} delay={i * 0.06}>
              <li className="grid grid-cols-1 gap-6 border-t border-rule py-12 lg:grid-cols-[260px_1fr] lg:gap-12 lg:py-16 first:border-t-0">
                {/* Left rail — year range */}
                <div className="flex flex-col gap-3">
                  <div
                    className={`font-display font-bold leading-[0.95] tracking-[-0.04em] ${
                      entry.isCurrent ? "text-accent" : "text-ink"
                    }`}
                    style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                  >
                    {entry.start}
                    <br />
                    <span className="text-ink-dim">— </span>
                    {entry.end}
                  </div>
                  {entry.isCurrent && (
                    <span className="flex items-center gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                      </span>
                      Current
                    </span>
                  )}
                </div>

                {/* Right — role / company / bullets / chips */}
                <div className="flex flex-col gap-6">
                  <header className="flex flex-col gap-2">
                    <h3
                      className="font-display font-bold leading-[1.05] tracking-[-0.03em]"
                      style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
                    >
                      {entry.role}
                    </h3>
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
                      {entry.company} <span className="mx-2 text-rule">/</span>{" "}
                      {entry.location}
                    </p>
                  </header>

                  <ul className="flex flex-col gap-3 font-sans text-sm leading-[1.65] text-ink-dim lg:text-base">
                    {entry.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="grid grid-cols-[18px_1fr] items-start gap-2"
                      >
                        <span className="mt-[0.65em] inline-block h-px w-3 bg-rule" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="group/chips flex flex-wrap gap-2 pt-1">
                    {entry.stack.map((tech) => (
                      <span key={tech} className="group inline-flex">
                        <Chip>{tech}</Chip>
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}
