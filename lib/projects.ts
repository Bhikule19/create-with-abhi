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
    id: "docease",
    index: "01",
    title: "DocEase",
    blurb:
      "AI-powered platform for document simplification and accessibility — 10 languages, voice synthesis, custom QA chatbot, and 7+ chart types for sentiment, word-frequency, and structure analysis.",
    stack: ["React.js", "TypeScript", "Gemini AI", "Recharts", "PDF.js", "Tailwind"],
    year: "2024",
    url: null,
    github: null,
    image: "/images/projects/docease.svg",
    track: "stack",
    highlight: "60% perf boost · Redux Toolkit",
  },
  {
    id: "designmd",
    index: "02",
    title: "DESIGN.md Extractor",
    blurb:
      "Paste a URL, get a deterministic DESIGN.md — colour tokens, typography roles, spacing, components, with citations to the actual CSS rules.",
    stack: ["Next.js", "TypeScript", "OKLCH", "AST"],
    year: "2026",
    url: null,
    image: "/images/projects/designmd.svg",
    track: "stack",
    highlight: "Deterministic tokens",
  },
  {
    id: "medical-report-companion",
    index: "03",
    title: "Medical Report Companion",
    blurb:
      "Plain-language medical-report summaries in 6 Indian languages. DPDP-aware. Groq Llama 3.3 70B for low-latency inference.",
    stack: ["Next.js", "Supabase", "Groq", "Llama 3.3"],
    year: "2026",
    url: "https://github.com/Bhikule19/medical-report-companion",
    github: "https://github.com/Bhikule19/medical-report-companion",
    image: "/images/projects/medical-report.svg",
    track: "stack",
    highlight: "6 Indian languages",
  },
  {
    id: "wp-agent-ai",
    index: "04",
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
  },
];
