export type Experience = {
  id: string;
  start: string;
  end: string;
  isCurrent: boolean;
  role: string;
  company: string;
  location: string;
  bullets: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    id: "brainstorm-force",
    start: "JUN 2024",
    end: "NOW",
    isCurrent: true,
    role: "Software Developer",
    company: "Brainstorm Force",
    location: "Pune, MH",
    bullets: [
      "Built complete frontend component-based architecture for a multi-tenant SaaS platform using Next.js 15, React 18, and TypeScript — App Router and React Server Components throughout.",
      "Developed 50+ reusable UI components (dashboards, data tables, comment threads, notification panels) with Tailwind CSS and shadcn/ui — consistent design system, scaling cleanly.",
      "Designed Zustand global state stores for authentication, projects, comments, notifications, and real-time updates — selective subscriptions for performance.",
      "Integrated REST APIs with robust error handling, optimistic UI, JWT auth + auto-refresh, and OAuth2 plugin connectivity.",
      "Maintained and optimised React-based admin interfaces for WordPress plugins serving 2M+ active users — perf, reliability, cross-browser.",
    ],
    stack: [
      "Next.js 15",
      "React 18",
      "TypeScript",
      "Zustand",
      "Tailwind",
      "shadcn/ui",
      "Force UI",
      "Laravel",
      "JWT",
      "OAuth2",
      "WebSockets",
    ],
  },
  {
    id: "freelance",
    start: "DEC 2023",
    end: "MAY 2024",
    isCurrent: false,
    role: "Web Developer",
    company: "Freelance",
    location: "Mumbai, MH",
    bullets: [
      "Delivered custom WordPress websites with advanced SEO — 70% increase in client organic traffic, consistent 95+ Lighthouse scores.",
      "Shipped fully responsive solutions in PHP, owning project lifecycles end-to-end. 80% client retention rate.",
    ],
    stack: ["WordPress", "PHP", "Tailwind", "SEO", "Lighthouse", "Figma"],
  },
  {
    id: "focal-media",
    start: "FEB 2023",
    end: "NOV 2023",
    isCurrent: false,
    role: "Web Developer",
    company: "Focal Media LLP",
    location: "Thane, MH",
    bullets: [
      "Owned end-to-end solution architecture from frontend UI through backend logic as primary technical contributor.",
      "Implemented frontend perf optimisations and technical SEO across multiple client projects.",
      "Full project lifecycle management as the primary technical lead.",
    ],
    stack: ["JavaScript", "PHP", "WordPress", "SCSS", "Bootstrap", "REST"],
  },
  {
    id: "ola-electric",
    start: "NOV 2021",
    end: "JUL 2022",
    isCurrent: false,
    role: "Diagnostic Service Engineer",
    company: "OLA Electric",
    location: "Surat, GJ",
    bullets: [
      "Diagnosed electric vehicles in the field — broke down breakdowns into actionable steps for the service team.",
      "Implemented warranty and SOP processes with clear problem statements for field engineers.",
    ],
    stack: ["EV Systems", "SOP Design", "Field Diagnostics"],
  },
];
