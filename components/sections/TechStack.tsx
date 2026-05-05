import { stackGroups } from "@/lib/stack";
import { FadeUp } from "@/components/motion/FadeUp";
import { Chip } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function TechStack() {
  const totalCount = stackGroups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <section id="stack" className="py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-20">
        <FadeUp>
          <SectionHeader
            eyebrow="Tech Stack"
            title={
              <>
                What I <span className="text-accent">build</span> with.
              </>
            }
            meta={`${stackGroups.length.toString().padStart(2, "0")} GROUPS · ${totalCount} TOOLS`}
            className="mb-12 lg:mb-16"
          />
        </FadeUp>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-16 lg:gap-y-16">
          {stackGroups.map((group, i) => (
            <FadeUp key={group.id} delay={i * 0.05}>
              <div className="flex flex-col gap-5">
                <div className="flex items-baseline justify-between border-b border-rule pb-3">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
                    <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mx-2 text-rule">/</span>
                    {group.label}
                  </h3>
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-ink-dim">
                    {group.items.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="group flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
