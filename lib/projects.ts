export type ProjectTrack = "stack" | "vibe";

export type Project = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  stack: string[];
  year: string;
  url: string | null;
  github?: string | null;
  image: string;
  track: ProjectTrack;
  highlight?: string;
};

export const projects: Project[] = [
  // ─── Built with Stack ─────────────────────────────────────────────
  {
    id: "designmd",
    index: "01",
    title: "DESIGN.md Extractor",
    blurb:
      "Paste a URL, get a deterministic DESIGN.md — colour tokens, typography roles, spacing, components, with citations to the actual CSS rules.",
    stack: ["Next.js", "TypeScript", "OKLCH", "AST"],
    year: "2026",
    url: "https://designmd-extractor-rouge.vercel.app/",
    image: "/images/projects/designmd.svg",
    track: "stack",
    highlight: "Deterministic tokens",
  },
  {
    id: "medical-report-companion",
    index: "02",
    title: "Medical Report Companion",
    blurb:
      "Medical-report summaries in multiple languages. DPDP-aware. Groq Llama 3.3 70B for low-latency inference.",
    stack: ["Next.js", "Supabase", "Groq", "Llama 3.3"],
    year: "2026",
    url: "https://medical-report-companion.vercel.app/",
    github: "https://github.com/Bhikule19/medical-report-companion",
    image: "/images/projects/medical-report.svg",
    track: "stack",
    highlight: "Multiple languages",
  },
  {
    id: "wp-agent-ai",
    index: "03",
    title: "WP Agent AI",
    blurb:
      "Gutenberg AI block + admin dashboard. Multi-provider (OpenRouter / Anthropic / Groq), async jobs, Force UI for the settings.",
    stack: ["WordPress", "Gutenberg", "Force UI", "Multi-provider"],
    year: "2025",
    url: null,
    image: "/images/projects/wp-agent-ai.svg",
    track: "stack",
    highlight: "Multi-provider AI",
  },

  // ─── Vibe Coded ───────────────────────────────────────────────────
  {
    id: "serp-optimizer",
    index: "02",
    title: "SERP Optimizer",
    blurb:
      "On-page SEO smith — paste a URL, get a ranked checklist of meta, headings, schema, and content fixes with before/after previews.",
    stack: ["React", "Vite", "Tailwind", "Lovable"],
    year: "2026",
    url: "https://serpsmith-studio.lovable.app",
    image: "/images/projects/serp-optimizer.svg",
    track: "vibe",
    highlight: "Ranked SEO fixes",
  },
  {
    id: "thread-x-buddy",
    index: "03",
    title: "Thread/X Buddy",
    blurb:
      "Paste a long-form draft, get a tweet-sized thread — auto-numbered, character-aware, with hook and CTA suggestions for X/Twitter.",
    stack: ["React", "Vite", "Tailwind", "Lovable"],
    year: "2026",
    url: "https://thread-x-buddy-maker.lovable.app",
    image: "/images/projects/thread-x-buddy.svg",
    track: "vibe",
    highlight: "Long-form → thread",
  },
    {
    id: "ai-pdf-translator",
    index: "01",
    title: "AI PDF Translator",
    blurb:
      "Chrome extension that translates Japanese (and any language) PDFs in-place. Free pipeline — no LLM cost, just Google Translate POST plus Tesseract OCR fallback.",
    stack: ["Chrome MV3", "TypeScript", "PDF.js", "Tesseract"],
    year: "2025",
    url: null,
    image: "/images/projects/ai-pdf-translator.svg",
    track: "vibe",
    highlight: "Zero-cost pipeline",
  }
];
