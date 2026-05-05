import { ReactNode } from "react";
import { projects, type ProjectTrack } from "@/lib/projects";
import { ProjectRow } from "./ProjectRow";
import { FadeUp } from "@/components/motion/FadeUp";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Props = {
  track: ProjectTrack;
  eyebrow: ReactNode;
  title: ReactNode;
  countLabel: ReactNode;
  id?: string;
};

export function SelectedWork({ track, eyebrow, title, countLabel, id }: Props) {
  const list = projects.filter((p) => p.track === track);

  return (
    <section id={id ?? `work-${track}`} className="py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-20">
        <FadeUp>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            meta={countLabel}
            className="mb-12 lg:mb-20"
          />
        </FadeUp>

        <div
          className={`grid grid-cols-1 gap-6 lg:gap-8 ${
            list.length === 1
              ? "mx-auto max-w-[760px]"
              : "lg:grid-cols-2"
          }`}
        >
          {list.map((project, i) => (
            <FadeUp key={project.id} delay={i * 0.06}>
              <ProjectRow project={project} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
