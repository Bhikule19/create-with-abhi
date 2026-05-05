"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { Project } from "@/lib/projects";

const TRACK_LABEL: Record<Project["track"], string> = {
  stack: "STACK",
  vibe: "VIBE",
};

const TOTAL_PER_TRACK = (track: Project["track"]) =>
  track === "stack" ? "04" : "01";

export function ProjectRow({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const isLink = Boolean(project.url);

  const Tag: React.ElementType = isLink ? "a" : "div";

  return (
    <Tag
      href={isLink ? project.url! : undefined}
      target={isLink ? "_blank" : undefined}
      rel={isLink ? "noopener noreferrer" : undefined}
      data-cursor="view"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group relative block overflow-hidden bg-paper transition-transform duration-500 hover:-translate-y-1"
    >
      {/* Image surface — borderless block, scales on hover */}
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-paper">
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover"
            unoptimized
          />
        </motion.div>

        {/* Volt radial glow on hover */}
        <motion.div
          aria-hidden
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, var(--accent-glow) 0%, transparent 55%)",
          }}
        />

        {/* Index + track badge — top-left */}
        <div className="absolute left-5 top-5 flex items-center gap-3">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {project.index}
            <span className="ml-2 text-ink-dim">/ {TOTAL_PER_TRACK(project.track)}</span>
          </span>
          <span className="hidden sm:inline-flex">
            <Chip variant="accent">{TRACK_LABEL[project.track]}</Chip>
          </span>
        </div>

        {/* Status — top right */}
        <span className="absolute right-5 top-5 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
          {isLink ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Live
            </>
          ) : (
            <>WIP</>
          )}
        </span>

        {/* Highlight metric — bottom-left of the image surface */}
        {project.highlight && (
          <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 border-l border-accent pl-3 font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-ink">
            {project.highlight}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-5 px-5 py-6 lg:px-7 lg:py-8">
        <div className="flex items-baseline justify-between gap-4">
          <motion.h3
            animate={{ color: hovered ? "var(--accent)" : "var(--ink)" }}
            transition={{ duration: 0.3 }}
            className="font-display text-2xl font-semibold leading-[1.05] tracking-[-0.02em] lg:text-4xl"
          >
            {project.title}
          </motion.h3>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
            {project.year}
          </span>
        </div>

        <p className="font-sans text-sm leading-[1.55] text-ink-dim lg:text-base">
          {project.blurb}
        </p>

        {/* Tech chips + view CTA */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {project.stack.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
          {isLink && (
            <span className="ml-auto inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent transition-transform group-hover:translate-x-1">
              View ↗
            </span>
          )}
        </div>
      </div>
    </Tag>
  );
}
