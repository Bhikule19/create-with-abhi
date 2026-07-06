"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { HoverSwap } from "./HoverSwap";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Theme is forced (see app/layout.tsx `forcedTheme="dark"`) — toggling
  // would be a no-op, so don't render a dead control.
  if (forcedTheme) return null;

  const isDark = mounted && resolvedTheme === "dark";
  const primary = isDark ? "LIGHT MODE" : "DARK MODE";
  const alt = isDark ? "DARK MODE" : "LIGHT MODE";

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="cursor-pointer"
    >
      <HoverSwap primary={primary} alt={alt} />
    </button>
  );
}
