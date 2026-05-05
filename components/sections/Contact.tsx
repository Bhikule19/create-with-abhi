import { FadeUp } from "@/components/motion/FadeUp";
import { EMAIL, MAIL_HREF } from "@/lib/socials";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-32 lg:py-48"
    >
      {/* Volt radial wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-[140px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent), transparent 70%)",
        }}
      />

      <FadeUp className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-4 text-center lg:px-20">
        <span className="flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
          <span className="h-px w-8 bg-accent" />
          Contact
          <span className="h-px w-8 bg-accent" />
        </span>

        <h2
          className="font-display font-bold leading-[0.95] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
        >
          Got an idea?
          <br />
          Let&apos;s <span className="text-accent">build</span> it.
        </h2>

        <p className="max-w-[480px] font-sans text-base text-ink-dim lg:text-lg">
          Open to interesting work — products, plugins, motion-led web. Drop a
          line and let&apos;s talk.
        </p>

        <a
          href={MAIL_HREF}
          data-cursor="link"
          className="group relative mt-2 inline-flex items-center gap-3 bg-accent px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-bg transition-transform duration-300 hover:scale-[1.04]"
          style={{ boxShadow: "0 0 60px var(--accent-glow)" }}
        >
          <span>Say Hello</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            ↗
          </span>
        </a>

        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
          OR{" "}
          <a
            href={MAIL_HREF}
            className="text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {EMAIL}
          </a>
        </p>
      </FadeUp>
    </section>
  );
}
