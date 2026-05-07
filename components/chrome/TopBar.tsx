"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HoverSwap } from "./HoverSwap";
import { ThemeToggle } from "./ThemeToggle";
import { RotatingMark } from "./RotatingMark";
import { useMenu } from "./MenuProvider";
import { MAIL_HREF } from "@/lib/socials";

export function TopBar() {
  const { toggle, open } = useMenu();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-4 top-3 z-[100] flex items-center justify-between gap-4 border px-4 py-3 transition-all duration-300 lg:inset-x-6 lg:px-6 lg:py-4 ${
        scrolled
          ? "border-glass bg-bg/55 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent"
      }`}
      style={
        scrolled
          ? {
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
            }
          : undefined
      }
    >
      <Link
        href="/"
        className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight"
      >
        <RotatingMark className="text-accent text-base" />
        <HoverSwap
          primary="CREATE WITH ABHI"
          alt="BHIKULE.DEV"
          className="font-display text-[11px] font-semibold uppercase tracking-[0.2em]"
        />
      </Link>

      <nav className="flex items-center gap-5 lg:gap-8 font-display text-[11px] font-semibold uppercase tracking-[0.2em]">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={toggle}
          className="cursor-pointer transition-colors hover:text-accent"
        >
          <HoverSwap primary={open ? "CLOSE" : "MENU"} alt={open ? "ESC" : "OPEN"} />
        </button>
        <a
          href={MAIL_HREF}
          className="hidden border border-ink px-3 py-1.5 transition-colors hover:border-accent hover:text-accent sm:inline-block"
        >
          <HoverSwap primary="LET'S TALK" alt="CWB.in" />
        </a>
      </nav>
    </header>
  );
}
