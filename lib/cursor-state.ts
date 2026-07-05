export type CursorState = "default" | "view" | "link";

/** Resolve cursor treatment from the hovered element's annotations. */
export function resolveCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return "default";

  const annotated = target.closest<HTMLElement>("[data-cursor]");
  const value = annotated?.dataset.cursor;
  if (value === "view" || value === "link") return value;

  if (target.closest("a, button, [role='button']")) return "link";
  return "default";
}
