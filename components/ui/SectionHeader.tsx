import { ReactNode } from "react";

/**
 * Volt-rule eyebrow + optional headline + optional right meta. Used at the top
 * of Experience, TechStack, SelectedWork, About, Contact for visual rhythm.
 */
export function SectionHeader({
  eyebrow,
  title,
  meta,
  className = "",
}: {
  eyebrow: ReactNode;
  title?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-6 border-b border-rule pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12 ${className}`}
    >
      <div className="flex flex-col gap-3">
        <span className="flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </span>
        {title && (
          <h2 className="font-display text-4xl font-bold tracking-[-0.02em] lg:text-6xl">
            {title}
          </h2>
        )}
      </div>
      {meta && (
        <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
          {meta}
        </span>
      )}
    </div>
  );
}
