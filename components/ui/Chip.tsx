import { ReactNode } from "react";

type Variant = "default" | "accent";
type Size = "sm" | "md";

const sizeMap: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[10px] tracking-[0.18em]",
  md: "px-3 py-1.5 text-[11px] tracking-[0.2em]",
};

/**
 * Sharp 1px chip used for tech labels, status pills, and category badges.
 * Hover within a `group` lifts the border to accent and brightens the text.
 */
export function Chip({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const base =
    "inline-flex items-center font-display font-semibold uppercase whitespace-nowrap transition-colors";
  const palette =
    variant === "accent"
      ? "border border-accent/60 text-accent"
      : "border border-rule text-ink-dim group-hover:border-accent/40 group-hover:text-ink";

  return (
    <span className={`${base} ${palette} ${sizeMap[size]} ${className}`}>
      {children}
    </span>
  );
}
