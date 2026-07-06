# Experience Redesign — Plan 2 of 3: Landing Middle + Lead Flow

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the résumé-era middle sections with the new Work / Services / Process / About / Signals sections and a working lead-capture form (Zod-validated route handler, Resend behind an env var with graceful mailto fallback), completing the landing page's five-act narrative on branch `feat/experience-redesign` (PR #1).

**Architecture:** Each section is a focused client component consuming a typed data module in `lib/` (content lives in data, not JSX). The lead flow is split: `lib/lead.ts` (Zod schema + pure email builder, fully unit-tested) → `app/api/lead/route.ts` (thin handler, unit-tested by calling `POST` directly) → `components/sections/Contact.tsx` (form UI with success/fallback states). Old sections are deleted at the end, once every replacement is live.

**Tech Stack:** Existing foundation from Plan 1 (tokens, `RevealText`, `MagneticButton`, `FadeUp`, cursor `data-cursor` annotations, `.label-mono`, `.text-gradient-accent`). New: `zod` dependency. Resend is called via plain `fetch` (no SDK — YAGNI).

**Spec:** `docs/superpowers/specs/2026-07-05-portfolio-experience-redesign-design.md` §4.02–4.07. Decisions since spec: canonical email is `createwithabhi19@gmail.com` (from `lib/socials.ts`) until the domain mailbox exists; NO booking link on the success screen yet (config slot only); placeholder portrait + quotes, clearly marked.

## Global Constraints

- Package manager: **pnpm** only. Environment: `source ~/.nvm/nvm.sh && nvm use 22` before pnpm commands; invoke as `command pnpm ...` (a shell alias wraps pnpm in a proxy that breaks Playwright's readiness probe).
- Consult `node_modules/next/dist/docs/` before using any App Router API you're unsure of (route handlers: `01-app/03-api-reference/03-file-conventions/route.md`).
- ESLint hard-errors on `react-hooks/set-state-in-effect` and `react-hooks/refs`. Established lint-clean idioms: `useSyncExternalStore` for media queries / storage (see `components/chrome/Cursor.tsx`, `Preloader.tsx`, `Footer.tsx`), ref updates inside dedicated effects (see `components/motion/RevealText.tsx`).
- Section ids (nav contract): `#work`, `#services`, `#process`, `#about`, `#contact` (`#contact` already exists; keep it).
- Canonical email: import `EMAIL` / `MAIL_HREF` from `lib/socials.ts` — never hardcode an address in a component.
- Colors/type/motion tokens from Plan 1 only: `bg-stage`, `bg-surface`, `border-line`, `text-ink`, `text-ink-muted`, `text-brass`, `.label-mono`, `.text-gradient-accent`, `var(--text-display-lg)`, `var(--text-display-md)`, `var(--ease-out-expo)`, `var(--dur-base)`. Never pure #000/#FFF.
- All new motion honors `prefers-reduced-motion` (reveals → opacity-only, pinned scroll → static vertical, marquee → static list).
- No `console.log` in production code. Immutable patterns. Commit format `<type>: <description>`, no attribution footer.
- Verification gate for every task: `command pnpm lint` clean · `command pnpm exec tsc --noEmit` 0 errors · `command pnpm build` succeeds · `command pnpm test` green. (e2e runs in Tasks 8–9 where behavior changes are user-visible.)

---

### Task 1: Content data modules (services, process, signals, work reshape)

**Files:**
- Create: `lib/services.ts`
- Create: `lib/process.ts`
- Create: `lib/signals.ts`
- Modify: `lib/projects.ts` (extend type + data; do not remove existing fields)
- Test: `lib/__tests__/content-data.test.ts`

**Interfaces:**
- Produces:
  - `services: Service[]` where `Service = { id: string; index: "①"|"②"|"③"|"④"; title: string; meta: string; goodFor: string; timeline: string }`
  - `processSteps: ProcessStep[]` where `ProcessStep = { index: string; title: string; deliverable: string }`
  - `signals: Signal[]` where `Signal = { quote: string; attribution: string; placeholder: boolean }`
  - `lib/projects.ts` additions: `kind: "shipped" | "concept"`, `outcome: string`, `gradient: readonly [string, string]`, `featured: boolean` on `Project`; new export `featuredWork: Project[]` (the featured subset, max 4).

- [ ] **Step 1: Write the failing test**

`lib/__tests__/content-data.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { services } from "@/lib/services";
import { processSteps } from "@/lib/process";
import { signals } from "@/lib/signals";
import { featuredWork } from "@/lib/projects";

describe("services data", () => {
  it("defines exactly four offers with timelines", () => {
    expect(services).toHaveLength(4);
    services.forEach((s) => {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.timeline.length).toBeGreaterThan(0);
      expect(s.goodFor.length).toBeGreaterThan(0);
    });
  });
});

describe("process data", () => {
  it("defines the four steps in order", () => {
    expect(processSteps.map((p) => p.title)).toEqual([
      "Discover",
      "Design",
      "Build",
      "Launch",
    ]);
    processSteps.forEach((p) => expect(p.deliverable.length).toBeGreaterThan(10));
  });
});

describe("signals data", () => {
  it("ships 3 quotes, all marked as placeholders", () => {
    expect(signals).toHaveLength(3);
    signals.forEach((s) => expect(s.placeholder).toBe(true));
  });
});

describe("featured work", () => {
  it("selects at most 4 featured projects, each with outcome and gradient", () => {
    expect(featuredWork.length).toBeGreaterThanOrEqual(3);
    expect(featuredWork.length).toBeLessThanOrEqual(4);
    featuredWork.forEach((p) => {
      expect(p.outcome.length).toBeGreaterThan(0);
      expect(p.gradient).toHaveLength(2);
      expect(["shipped", "concept"]).toContain(p.kind);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `command pnpm test`
Expected: FAIL — modules not found / missing exports.

- [ ] **Step 3: Create `lib/services.ts`**

```ts
export type Service = {
  id: string;
  index: "①" | "②" | "③" | "④";
  title: string;
  meta: string;
  goodFor: string;
  timeline: string;
};

export const services: Service[] = [
  {
    id: "signature",
    index: "①",
    title: "Signature sites",
    meta: "DESIGN + BUILD · 4–8 WKS",
    goodFor:
      "Brands and founders who want a site that feels like nothing else — designed and engineered end to end, motion included.",
    timeline: "4–8 weeks",
  },
  {
    id: "landing",
    index: "②",
    title: "Landing pages that convert",
    meta: "1–2 WKS",
    goodFor:
      "Launches, campaigns and products that need one page to make the case — fast turnaround, conversion-first.",
    timeline: "1–2 weeks",
  },
  {
    id: "wordpress",
    index: "③",
    title: "WordPress, done properly",
    meta: "SCOPED PER PROJECT",
    goodFor:
      "Businesses on WordPress who want production discipline — clean themes, plugins, performance and security done right.",
    timeline: "Scoped per project",
  },
  {
    id: "motion",
    index: "④",
    title: "Motion & 3D experiences",
    meta: "THE SECRET WEAPON",
    goodFor:
      "Teams that want the scroll-stopping layer — WebGL, shaders and choreography added to a product or campaign.",
    timeline: "Scoped per project",
  },
];
```

- [ ] **Step 4: Create `lib/process.ts`**

```ts
export type ProcessStep = {
  index: string;
  title: string;
  deliverable: string;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    deliverable: "Call + brief. You get a proposal with fixed scope and price.",
  },
  {
    index: "02",
    title: "Design",
    deliverable: "Direction first, then full design. You see progress weekly.",
  },
  {
    index: "03",
    title: "Build",
    deliverable: "Production code, motion, QA. Staging link from day one.",
  },
  {
    index: "04",
    title: "Launch",
    deliverable: "Deploy, analytics, handover doc. Two weeks of fixes included.",
  },
];
```

- [ ] **Step 5: Create `lib/signals.ts`**

```ts
export type Signal = {
  quote: string;
  attribution: string;
  /** True until real quotes replace these — do not ship placeholder:true past launch. */
  placeholder: boolean;
};

export const signals: Signal[] = [
  {
    quote: "Rare mix of design eye and engineering depth.",
    attribution: "COLLEAGUE — PLACEHOLDER",
    placeholder: true,
  },
  {
    quote: "Took our brief and returned something better than we imagined.",
    attribution: "COLLABORATOR — PLACEHOLDER",
    placeholder: true,
  },
  {
    quote: "Communicates like a PM, ships like a senior engineer.",
    attribution: "TEAMMATE — PLACEHOLDER",
    placeholder: true,
  },
];
```

- [ ] **Step 6: Extend `lib/projects.ts`**

Add to the `Project` type (keep every existing field):

```ts
export type ProjectKind = "shipped" | "concept";

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
  kind: ProjectKind;
  outcome: string;
  gradient: readonly [string, string];
  featured: boolean;
};
```

Then extend each existing project entry with the four new fields. Exact values:

| id | kind | outcome | gradient | featured |
|---|---|---|---|---|
| designmd | shipped | `"DETERMINISTIC DESIGN TOKENS FROM ANY URL"` | `["#1a2138", "#3d2f4f"]` | true |
| medical-report-companion | shipped | `"MEDICAL REPORTS, READABLE IN ANY LANGUAGE"` | `["#20301f", "#101a10"]` | true |
| wp-agent-ai | shipped | `"MULTI-PROVIDER AI INSIDE GUTENBERG"` | `["#2b1f38", "#141416"]` | true |
| serp-optimizer | shipped | `"RANKED SEO FIXES FROM A SINGLE PASTE"` | `["#33261a", "#141416"]` | true |
| thread-x-buddy | shipped | `"LONG-FORM DRAFTS INTO READY THREADS"` | `["#1a2a33", "#141416"]` | false |
| (any other existing entries) | shipped | short uppercase outcome derived from the blurb | `["#1f1f2e", "#141416"]` | false |

At the bottom add:

```ts
export const featuredWork: Project[] = projects.filter((p) => p.featured);
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `command pnpm test`
Expected: PASS (all files, including Plan 1's 20 tests).

- [ ] **Step 8: Verify build + commit**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build`
Expected: all clean.

```bash
git add lib/services.ts lib/process.ts lib/signals.ts lib/projects.ts lib/__tests__/content-data.test.ts
git commit -m "feat: add content data modules for services, process, signals, and featured work"
```

---

### Task 2: Lead schema + email builder (`lib/lead.ts`)

**Files:**
- Create: `lib/lead.ts`
- Test: `lib/__tests__/lead.test.ts`
- Modify: `package.json` (add `zod`)

**Interfaces:**
- Produces:
  - `leadSchema` — Zod object: `name` (string, 2–100 chars, trimmed), `email` (valid email), `projectType` (enum: `"signature" | "landing" | "wordpress" | "motion" | "other"`), `budget` (enum: `"under-1k" | "1k-3k" | "3k-10k" | "10k-plus" | "not-sure"`), `message` (string, 10–2000 chars, trimmed), `company` (string, max 0 chars — honeypot: any non-empty value fails).
  - `type LeadInput = z.infer<typeof leadSchema>`
  - `buildLeadEmail(lead: LeadInput): { subject: string; text: string }` — pure.
  - `PROJECT_TYPE_LABELS: Record<LeadInput["projectType"], string>` and `BUDGET_LABELS: Record<LeadInput["budget"], string>` — single source for form option copy.
  - `BOOKING_URL: string | null = null` — success-screen booking slot, deliberately null until a Cal.com link exists.

- [ ] **Step 1: Install zod**

```bash
command pnpm add zod
```

- [ ] **Step 2: Write the failing test**

`lib/__tests__/lead.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  leadSchema,
  buildLeadEmail,
  PROJECT_TYPE_LABELS,
  BUDGET_LABELS,
  BOOKING_URL,
} from "@/lib/lead";

const valid = {
  name: "Jane Founder",
  email: "jane@startup.io",
  projectType: "signature",
  budget: "3k-10k",
  message: "We need a new marketing site for our Q4 launch.",
  company: "",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    const r = leadSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("rejects invalid email, short name, short message", () => {
    expect(leadSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, name: "J" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });

  it("rejects unknown enum values", () => {
    expect(leadSchema.safeParse({ ...valid, projectType: "spaceship" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, budget: "infinite" }).success).toBe(false);
  });

  it("rejects when the honeypot is filled", () => {
    expect(leadSchema.safeParse({ ...valid, company: "SpamCo" }).success).toBe(false);
  });

  it("trims name and message", () => {
    const r = leadSchema.parse({ ...valid, name: "  Jane  ", message: `  ${valid.message}  ` });
    expect(r.name).toBe("Jane");
    expect(r.message).toBe(valid.message);
  });
});

describe("buildLeadEmail", () => {
  it("includes every field with human-readable labels", () => {
    const { subject, text } = buildLeadEmail(leadSchema.parse(valid));
    expect(subject).toBe("New project lead — Jane Founder");
    expect(text).toContain("jane@startup.io");
    expect(text).toContain(PROJECT_TYPE_LABELS.signature);
    expect(text).toContain(BUDGET_LABELS["3k-10k"]);
    expect(text).toContain(valid.message);
  });
});

describe("BOOKING_URL", () => {
  it("is deliberately null until a booking link exists", () => {
    expect(BOOKING_URL).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `command pnpm test`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `lib/lead.ts`**

```ts
import { z } from "zod";

export const PROJECT_TYPE_LABELS = {
  signature: "Signature site (design + build)",
  landing: "Landing page",
  wordpress: "WordPress",
  motion: "Motion / 3D experience",
  other: "Something else",
} as const;

export const BUDGET_LABELS = {
  "under-1k": "Under $1k",
  "1k-3k": "$1k – $3k",
  "3k-10k": "$3k – $10k",
  "10k-plus": "$10k+",
  "not-sure": "Not sure yet",
} as const;

/** Success-screen booking slot — stays null until a Cal.com link exists. */
export const BOOKING_URL: string | null = null;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(100),
  email: z.string().trim().email("That email doesn't look right"),
  projectType: z.enum(
    Object.keys(PROJECT_TYPE_LABELS) as [keyof typeof PROJECT_TYPE_LABELS],
  ),
  budget: z.enum(Object.keys(BUDGET_LABELS) as [keyof typeof BUDGET_LABELS]),
  message: z
    .string()
    .trim()
    .min(10, "Give me a sentence or two about the project")
    .max(2000),
  /** Honeypot — humans never see this field; any value = bot. */
  company: z.string().max(0),
});

export type LeadInput = z.infer<typeof leadSchema>;

export function buildLeadEmail(lead: LeadInput): { subject: string; text: string } {
  const subject = `New project lead — ${lead.name}`;
  const text = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Project: ${PROJECT_TYPE_LABELS[lead.projectType]}`,
    `Budget: ${BUDGET_LABELS[lead.budget]}`,
    ``,
    lead.message,
  ].join("\n");
  return { subject, text };
}
```

Note: if the installed zod version's `z.enum` typing rejects the `Object.keys` cast pattern, use explicit tuples instead: `z.enum(["signature", "landing", "wordpress", "motion", "other"])` and `z.enum(["under-1k", "1k-3k", "3k-10k", "10k-plus", "not-sure"])` — behavior identical.

- [ ] **Step 5: Run tests to verify they pass**

Run: `command pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/lead.ts lib/__tests__/lead.test.ts package.json pnpm-lock.yaml
git commit -m "feat: add lead schema, labels, and email builder with honeypot"
```

---

### Task 3: Lead API route (`app/api/lead/route.ts`)

**Files:**
- Create: `app/api/lead/route.ts`
- Test: `app/api/lead/__tests__/route.test.ts`
- Modify: `vitest.config.ts` (include `app/**/*.test.ts`)

**Interfaces:**
- Consumes: `leadSchema`, `buildLeadEmail` from `lib/lead.ts`; `EMAIL` from `lib/socials.ts`.
- Produces: `POST /api/lead` behavior contract (Contact.tsx relies on it):
  - Invalid JSON body → 400 `{ ok: false, error: "invalid" }`
  - Schema failure → 400 `{ ok: false, error: "validation", fieldErrors: Record<string, string[]> }`
  - Honeypot tripped (schema failure on `company`) → **200 `{ ok: true }`** (silent accept — never tell bots)
  - Valid + `RESEND_API_KEY` unset → 503 `{ ok: false, error: "unconfigured" }`
  - Valid + key set → POST `https://api.resend.com/emails` with `{ from: process.env.RESEND_FROM ?? "onboarding@resend.dev", to: EMAIL, subject, text }`; Resend 2xx → 200 `{ ok: true }`; Resend failure → 502 `{ ok: false, error: "send-failed" }`

- [ ] **Step 1: Read the route-handler doc**

Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`. Confirm the `export async function POST(request: Request): Promise<Response>` convention; adjust below if the doc differs.

- [ ] **Step 2: Widen vitest include**

In `vitest.config.ts`, change the `include` array to:

```ts
include: ["lib/**/*.test.ts", "components/**/*.test.tsx", "app/**/*.test.ts"],
```

- [ ] **Step 3: Write the failing test**

`app/api/lead/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/lead/route";

const valid = {
  name: "Jane Founder",
  email: "jane@startup.io",
  projectType: "signature",
  budget: "3k-10k",
  message: "We need a new marketing site for our Q4 launch.",
  company: "",
};

function post(body: unknown): Promise<Response> {
  return POST(
    new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/lead", () => {
  beforeEach(() => vi.unstubAllEnvs());
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("400s on malformed JSON", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid");
  });

  it("400s with fieldErrors on validation failure", async () => {
    const res = await post({ ...valid, email: "nope" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("validation");
    expect(body.fieldErrors.email).toBeDefined();
  });

  it("silently accepts honeypot submissions", async () => {
    const res = await post({ ...valid, company: "SpamCo" });
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("503s when RESEND_API_KEY is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("unconfigured");
  });

  it("sends via Resend and 200s when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(init.body);
    expect(sent.to).toContain("createwithabhi19@gmail.com");
    expect(sent.subject).toBe("New project lead — Jane Founder");
    expect(init.headers.Authorization).toBe("Bearer re_test_key");
  });

  it("502s when Resend rejects", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 422 })));
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("send-failed");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `command pnpm test`
Expected: FAIL — route module not found.

- [ ] **Step 5: Implement `app/api/lead/route.ts`**

```ts
import { leadSchema, buildLeadEmail } from "@/lib/lead";
import { EMAIL } from "@/lib/socials";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function POST(request: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { ok: false, error: "invalid" });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Honeypot tripped: pretend success so bots learn nothing.
    if (fieldErrors.company) return json(200, { ok: true });
    return json(400, { ok: false, error: "validation", fieldErrors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json(503, { ok: false, error: "unconfigured" });

  const { subject, text } = buildLeadEmail(parsed.data);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
      to: [EMAIL],
      reply_to: parsed.data.email,
      subject,
      text,
    }),
  });

  if (!res.ok) return json(502, { ok: false, error: "send-failed" });
  return json(200, { ok: true });
}
```

Note: if `vi.stubEnv("RESEND_API_KEY", "")` leaves an empty string rather than unsetting, the `!apiKey` check treats it as unconfigured — intended.

- [ ] **Step 6: Run tests to verify they pass**

Run: `command pnpm test`
Expected: PASS (all suites).

- [ ] **Step 7: Verify build + commit**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build`

```bash
git add app/api/lead/route.ts app/api/lead/__tests__/route.test.ts vitest.config.ts
git commit -m "feat: add lead API route — validation, honeypot, Resend with graceful unconfigured state"
```

---

### Task 4: Work section (case-study cards)

**Files:**
- Create: `components/sections/Work.tsx`
- Modify: `app/page.tsx` (replace BOTH `<SelectedWork …/>` instances with `<Work />`)

**Interfaces:**
- Consumes: `featuredWork` from `lib/projects.ts`; `RevealText`, `FadeUp` (check `components/motion/FadeUp.tsx` props before use: `grep -n "type\|Props" components/motion/FadeUp.tsx`); cursor contract `data-cursor="view"`.
- Produces: section `id="work"`. Cards link to `project.url` when non-null (new tab), otherwise render as non-link articles.

- [ ] **Step 1: Implement `components/sections/Work.tsx`**

```tsx
"use client";

import Image from "next/image";
import { RevealText } from "@/components/motion/RevealText";
import { FadeUp } from "@/components/motion/FadeUp";
import { featuredWork, type Project } from "@/lib/projects";

const KIND_LABEL: Record<Project["kind"], string> = {
  shipped: "SHIPPED PRODUCT",
  concept: "CONCEPT REDESIGN",
};

function CardInner({ project }: { project: Project }) {
  return (
    <>
      <div
        className="relative flex h-64 items-end overflow-hidden p-5 md:h-80"
        style={{
          background: `linear-gradient(140deg, ${project.gradient[0]}, ${project.gradient[1]})`,
        }}
      >
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-8 opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="label-mono relative z-10 text-brass">
          {KIND_LABEL[project.kind]}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-baseline md:justify-between">
        <h3
          className="font-serif font-light text-ink"
          style={{ fontSize: "var(--text-display-md)" }}
        >
          {project.title}
        </h3>
        <span className="label-mono text-ink-muted">
          {project.outcome} · {project.year}
        </span>
      </div>
    </>
  );
}

export function Work() {
  return (
    <section id="work" className="bg-stage px-6 py-24 md:px-12 md:py-36">
      <p className="label-mono text-ink-muted">
        Selected work — proof, not promises
      </p>
      <RevealText
        as="h2"
        className="mt-3 font-serif font-light text-ink"
        delay={0.05}
      >
        <span style={{ fontSize: "var(--text-display-lg)" }}>Case studies.</span>
      </RevealText>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {featuredWork.map((project, i) => (
          <FadeUp key={project.id} delay={i * 0.08}>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                className="group block overflow-hidden rounded-xl border border-line bg-surface"
              >
                <CardInner project={project} />
              </a>
            ) : (
              <article
                data-cursor="view"
                className="group overflow-hidden rounded-xl border border-line bg-surface"
              >
                <CardInner project={project} />
              </article>
            )}
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
```

Adapt `FadeUp` usage to its actual props (it exists from the old site — if it has no `delay` prop, drop the prop rather than modifying FadeUp).

- [ ] **Step 2: Wire into `app/page.tsx`**

Remove the `SelectedWork` import and both `<SelectedWork track="stack" …/>` / `<SelectedWork track="vibe" …/>` blocks; add `import { Work } from "@/components/sections/Work";` and place `<Work />` where the first SelectedWork was. Leave Experience/TechStack/About/Contact untouched for now.

- [ ] **Step 3: Verify + commit**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build && command pnpm test`
Expected: all green. Visual check happens in Task 9's e2e + the live review.

```bash
git add components/sections/Work.tsx app/page.tsx
git commit -m "feat: add Work section — featured case cards with gradient worlds and lens cursor"
```

---

### Task 5: Services section

**Files:**
- Create: `components/sections/Services.tsx`
- Modify: `app/page.tsx` (insert `<Services />` after `<Work />`)

**Interfaces:**
- Consumes: `services` from `lib/services.ts`; `RevealText`.
- Produces: section `id="services"`. Rows expand on hover (desktop) AND on focus/click (keyboard + touch) via native `<details>`-free pattern: a button toggling an `aria-expanded` region (CSS grid-rows transition — no JS height math).

- [ ] **Step 1: Implement `components/sections/Services.tsx`**

```tsx
"use client";

import { useState } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { services } from "@/lib/services";

export function Services() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="services" className="bg-stage px-6 py-24 md:px-12 md:py-36">
      <p className="label-mono text-ink-muted">What I do</p>
      <RevealText as="h2" className="mt-3 font-serif font-light text-ink" delay={0.05}>
        <span style={{ fontSize: "var(--text-display-lg)" }}>
          Four ways to work together.
        </span>
      </RevealText>

      <div className="mt-14 border-t border-line">
        {services.map((s) => {
          const isOpen = open === s.id;
          return (
            <div
              key={s.id}
              className="group border-b border-line"
              onMouseEnter={() => setOpen(s.id)}
              onMouseLeave={() => setOpen(null)}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="flex w-full items-baseline justify-between gap-4 py-6 text-left"
              >
                <span
                  className="font-serif font-light text-ink transition-colors group-hover:text-brass"
                  style={{ fontSize: "var(--text-display-md)" }}
                >
                  <span className="label-mono mr-4 text-brass">{s.index}</span>
                  {s.title}
                </span>
                <span className="label-mono shrink-0 text-ink-muted">{s.meta}</span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transitionTimingFunction: "var(--ease-out-expo)",
                }}
              >
                <div className="overflow-hidden">
                  <p className="max-w-xl pb-6 pl-0 text-sm leading-relaxed text-ink-muted md:pl-12">
                    {s.goodFor}
                    <span className="label-mono mt-3 block text-brass">
                      TIMELINE — {s.timeline}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** — `<Services />` directly after `<Work />`.

- [ ] **Step 3: Verify + commit**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build && command pnpm test`

```bash
git add components/sections/Services.tsx app/page.tsx
git commit -m "feat: add Services section — four expandable editorial rows"
```

---

### Task 6: Process section (pinned horizontal on desktop)

**Files:**
- Create: `components/sections/Process.tsx`
- Modify: `app/page.tsx` (insert `<Process />` after `<Services />`)

**Interfaces:**
- Consumes: `processSteps` from `lib/process.ts`; GSAP + ScrollTrigger (registered pattern per `components/sections/Hero.tsx`).
- Produces: section `id="process"`. Desktop (`min-width: 768px`, motion allowed): section pins while a horizontal track scrubs through the four steps; a progress line scales with scroll. Mobile or reduced motion: plain vertical stack, no pin.

- [ ] **Step 1: Implement `components/sections/Process.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/motion/RevealText";
import { processSteps } from "@/lib/process";

export function Process() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const trk = track.current;
    if (!sec || !trk) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !desktop) return;

    gsap.registerPlugin(ScrollTrigger);
    const distance = trk.scrollWidth - sec.clientWidth;
    if (distance <= 0) return;

    const tween = gsap.to(trk, {
      x: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: () => `+=${distance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    const lineTween = line.current
      ? gsap.fromTo(
          line.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top top",
              end: () => `+=${distance}`,
              scrub: true,
            },
          },
        )
      : null;

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
    };
  }, []);

  return (
    <section
      id="process"
      ref={section}
      className="overflow-hidden bg-stage px-6 py-24 md:min-h-svh md:px-12 md:py-36"
    >
      <p className="label-mono text-ink-muted">How it works</p>
      <RevealText as="h2" className="mt-3 font-serif font-light text-ink" delay={0.05}>
        <span style={{ fontSize: "var(--text-display-lg)" }}>
          No chaos. A process.
        </span>
      </RevealText>

      <div
        ref={line}
        className="mt-10 hidden h-px origin-left bg-brass md:block"
        aria-hidden
      />

      <div
        ref={track}
        className="mt-10 flex flex-col gap-6 md:mt-16 md:w-max md:flex-row md:gap-10"
      >
        {processSteps.map((step) => (
          <div
            key={step.index}
            className="rounded-xl border border-line bg-surface p-6 md:w-[24rem] md:shrink-0 md:p-8"
          >
            <span className="label-mono text-brass">{step.index}</span>
            <h3
              className="mt-3 font-serif font-light text-ink"
              style={{ fontSize: "var(--text-display-md)" }}
            >
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {step.deliverable}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `app/page.tsx`** — `<Process />` after `<Services />`.

- [ ] **Step 3: Manual pin check**

Run the dev server briefly (`command pnpm dev`), scroll through Process on a desktop viewport: section pins, cards travel horizontally, brass line draws. At `<768px` or with reduced motion emulated: plain vertical stack. Kill the server after.

- [ ] **Step 4: Verify + commit**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build && command pnpm test`

```bash
git add components/sections/Process.tsx app/page.tsx
git commit -m "feat: add Process section — scroll-pinned horizontal steps with progress line"
```

---

### Task 7: About + Signals sections

**Files:**
- Modify: `components/sections/About.tsx` (full replacement; keep export name `About`)
- Create: `components/sections/Signals.tsx`
- Modify: `app/page.tsx` (About stays in place; insert `<Signals />` after it)

**Interfaces:**
- Consumes: `currently` from `lib/currently.ts` (check its shape first: `head -20 lib/currently.ts` — adapt the render, not the data); `signals` from `lib/signals.ts`; `RevealText`.
- Produces: `#about` section (keep the id the old About uses — verify with `grep -n 'id=' components/sections/About.tsx` before replacing); Signals section (no nav id needed).

- [ ] **Step 1: Replace `components/sections/About.tsx`**

```tsx
"use client";

import { RevealText } from "@/components/motion/RevealText";
import { currently } from "@/lib/currently";

export function About() {
  return (
    <section id="about" className="bg-stage px-6 py-24 md:px-12 md:py-36">
      <div className="flex flex-col gap-12 md:flex-row md:items-center">
        {/* Portrait placeholder — swap src when the real photo lands in public/images/ */}
        <div
          aria-label="Portrait of Abhishek — photo coming soon"
          className="flex h-72 w-56 shrink-0 items-center justify-center rounded-xl border border-line"
          style={{
            background:
              "linear-gradient(160deg, #2a2a2e 0%, #141416 60%, #1a1626 100%)",
          }}
        >
          <span className="label-mono text-ink-muted">PORTRAIT</span>
        </div>

        <div>
          <p className="label-mono text-ink-muted">The person behind it</p>
          <RevealText as="h2" className="mt-3 font-serif font-light text-ink" delay={0.05}>
            <span style={{ fontSize: "var(--text-display-md)" }}>
              Designer who codes,{" "}
              <em className="text-gradient-accent italic">developer who designs.</em>
            </span>
          </RevealText>
          <p className="mt-6 max-w-xl leading-relaxed text-ink-muted">
            I ship production software daily at a WordPress product company and
            bring that engineering discipline to every freelance build — design,
            code and motion from one pair of hands, so nothing is lost in
            translation.
          </p>
          <p className="label-mono mt-8 text-ink-muted">
            CURRENTLY — {currently[0]?.text ?? "exploring shader-driven type"}
          </p>
        </div>
      </div>
    </section>
  );
}
```

Adapt the `currently` render to the module's actual shape (it may export strings or objects with a different key — read it first; if it exports plain strings use `currently[0]`).

- [ ] **Step 2: Create `components/sections/Signals.tsx`**

Marquee: duplicated list scrolling via CSS keyframes, paused on hover; static wrapped list under reduced motion (media query in CSS, no JS).

```tsx
import { signals } from "@/lib/signals";

export function Signals() {
  const loop = [...signals, ...signals];
  return (
    <section className="overflow-hidden border-y border-line bg-stage py-14">
      <p className="label-mono px-6 text-ink-muted md:px-12">Kind words</p>
      <div className="signals-marquee mt-8 flex w-max gap-5 px-6 md:px-12">
        {loop.map((s, i) => (
          <figure
            key={i}
            aria-hidden={i >= signals.length}
            className="w-72 shrink-0 rounded-xl border border-line bg-surface p-5"
          >
            <blockquote className="text-sm leading-relaxed text-ink">
              &ldquo;{s.quote}&rdquo;
            </blockquote>
            <figcaption className="label-mono mt-4 text-ink-muted">
              — {s.attribution}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

Add to `app/globals.css` under `@layer utilities`:

```css
  @keyframes signals-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .signals-marquee {
    animation: signals-scroll 36s linear infinite;
  }
  .signals-marquee:hover {
    animation-play-state: paused;
  }
  @media (prefers-reduced-motion: reduce) {
    .signals-marquee {
      animation: none;
      flex-wrap: wrap;
      width: auto;
    }
  }
```

- [ ] **Step 3: Wire into `app/page.tsx`** — `<Signals />` directly after `<About />`.

- [ ] **Step 4: Verify + commit**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build && command pnpm test`

```bash
git add components/sections/About.tsx components/sections/Signals.tsx app/globals.css app/page.tsx
git commit -m "feat: rebuild About with placeholder portrait and add Signals quote marquee"
```

---

### Task 8: Contact lead form (replaces old Contact)

**Files:**
- Modify: `components/sections/Contact.tsx` (full replacement; keep export name `Contact` and `id="contact"`)
- Modify: `e2e/landing.spec.ts` (footer email assertion swap — see Step 4)
- Modify: `components/sections/Footer.tsx` (canonical email swap)

**Interfaces:**
- Consumes: `leadSchema`, `PROJECT_TYPE_LABELS`, `BUDGET_LABELS`, `BOOKING_URL`, `type LeadInput` from `lib/lead.ts`; `MAIL_HREF`, `EMAIL` from `lib/socials.ts`; `MagneticButton` NOT used for submit (forms need a real submit button — magnetic effect optional via plain button + data-cursor="link").
- Produces: form POSTs JSON to `/api/lead`. States: idle → submitting → `sent` (success panel; booking CTA only when `BOOKING_URL` non-null) → or `fallback` (503/502/network error: panel with prefilled mailto link built from the form values). Client-side validation runs the SAME `leadSchema` before submitting; field errors render inline.

- [ ] **Step 1: Replace `components/sections/Contact.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { RevealText } from "@/components/motion/RevealText";
import {
  leadSchema,
  PROJECT_TYPE_LABELS,
  BUDGET_LABELS,
  BOOKING_URL,
} from "@/lib/lead";
import { EMAIL } from "@/lib/socials";

type Status = "idle" | "submitting" | "sent" | "fallback";

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus-visible:border-brass";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [mailtoFallback, setMailtoFallback] = useState(`mailto:${EMAIL}`);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    const subject = encodeURIComponent(`Project enquiry — ${parsed.data.name}`);
    const body = encodeURIComponent(parsed.data.message);
    setMailtoFallback(`mailto:${EMAIL}?subject=${subject}&body=${body}`);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        setStatus("sent");
      } else if (res.status === 400) {
        const payload = await res.json();
        setErrors(payload.fieldErrors ?? {});
        setStatus("idle");
      } else {
        setStatus("fallback");
      }
    } catch {
      setStatus("fallback");
    }
  }

  const fieldError = (name: string) =>
    errors[name]?.[0] ? (
      <p className="label-mono mt-1 text-brass">{errors[name][0]}</p>
    ) : null;

  return (
    <section id="contact" className="bg-stage px-6 py-24 md:px-12 md:py-36">
      <p className="label-mono text-ink-muted">Have a project in mind?</p>
      <RevealText as="h2" className="mt-3 font-serif font-light text-ink" delay={0.05}>
        <span style={{ fontSize: "var(--text-display-lg)" }}>
          Let&apos;s make something{" "}
          <em className="text-gradient-accent italic">worth remembering.</em>
        </span>
      </RevealText>

      {status === "sent" ? (
        <div className="mt-14 max-w-xl rounded-xl border border-brass p-8">
          <p className="font-serif text-2xl text-ink">Got it — thank you.</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            I read every enquiry personally and reply within one business day.
          </p>
          {BOOKING_URL && (
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono mt-6 inline-block rounded-full border border-brass px-6 py-3 text-brass"
            >
              Rather talk? Grab a slot →
            </a>
          )}
        </div>
      ) : status === "fallback" ? (
        <div className="mt-14 max-w-xl rounded-xl border border-line p-8">
          <p className="font-serif text-2xl text-ink">
            The form is napping — email me directly.
          </p>
          <a
            href={mailtoFallback}
            className="label-mono mt-6 inline-block rounded-full border border-brass px-6 py-3 text-brass"
            data-cursor="link"
          >
            {EMAIL} →
          </a>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-14 grid max-w-2xl gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="label-mono text-ink-muted">Name</span>
              <input name="name" className={`${inputCls} mt-2`} placeholder="Jane Founder" />
              {fieldError("name")}
            </label>
            <label className="block">
              <span className="label-mono text-ink-muted">Email</span>
              <input
                name="email"
                type="email"
                className={`${inputCls} mt-2`}
                placeholder="jane@company.com"
              />
              {fieldError("email")}
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="label-mono text-ink-muted">Project type</span>
              <select name="projectType" className={`${inputCls} mt-2`} defaultValue="signature">
                {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {fieldError("projectType")}
            </label>
            <label className="block">
              <span className="label-mono text-ink-muted">Budget</span>
              <select name="budget" className={`${inputCls} mt-2`} defaultValue="not-sure">
                {Object.entries(BUDGET_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {fieldError("budget")}
            </label>
          </div>

          <label className="block">
            <span className="label-mono text-ink-muted">The project</span>
            <textarea
              name="message"
              rows={5}
              className={`${inputCls} mt-2 resize-y`}
              placeholder="What are we making, and when does it need to exist?"
            />
            {fieldError("message")}
          </label>

          {/* Honeypot — visually hidden, tabbed past, bots fill it */}
          <label className="sr-only" aria-hidden>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === "submitting"}
              data-cursor="link"
              className="label-mono rounded-full border border-brass px-8 py-4 text-brass transition-colors hover:bg-brass hover:text-stage disabled:opacity-50"
            >
              {status === "submitting" ? "Sending…" : "Start a project →"}
            </button>
            <a href={`mailto:${EMAIL}`} className="label-mono text-ink-muted" data-cursor="link">
              or {EMAIL}
            </a>
          </div>
        </form>
      )}
    </section>
  );
}
```

Check `sr-only` exists in Tailwind 4 defaults (it does); ensure the honeypot input is truly hidden.

- [ ] **Step 2: Swap the footer to the canonical email**

In `components/sections/Footer.tsx`: delete the local `const EMAIL = "hello@createwithabhi.in";` and import `EMAIL` from `@/lib/socials` instead. Everything else stays.

- [ ] **Step 3: Update the e2e footer assertion**

In `e2e/landing.spec.ts`, change the footer email assertion from `hello@createwithabhi.in` to `createwithabhi19@gmail.com` (match the link accessible name exactly as rendered).

- [ ] **Step 4: Verify + commit**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build && command pnpm test && command pnpm test:e2e`
Expected: all green (e2e still 5/5 with the updated email).

```bash
git add components/sections/Contact.tsx components/sections/Footer.tsx e2e/landing.spec.ts
git commit -m "feat: rebuild Contact as lead form with fallback states; canonical gmail everywhere"
```

---

### Task 9: Navigation, cleanup, and e2e extension

**Files:**
- Modify: `components/chrome/MenuOverlay.tsx:8-13` (anchors array)
- Modify: `app/page.tsx` (final section order; remove Experience/TechStack imports)
- Delete: `components/sections/Experience.tsx`, `components/sections/TechStack.tsx`, `components/sections/SelectedWork.tsx`, `components/sections/ProjectRow.tsx`
- Delete: `lib/experience.ts`, `lib/stack.ts` (verify nothing else imports them first: `grep -rn "lib/experience\|lib/stack" app components lib --include="*.ts*"`)
- Modify: `e2e/landing.spec.ts` (new tests)

**Interfaces:**
- Consumes: section ids `#work #services #process #about #contact` (all exist after Tasks 4–8).
- Produces: final page order `Hero → Work → Services → Process → About → Signals → Contact → Footer`; menu anchors `WORK / SERVICES / PROCESS / ABOUT / CONTACT`.

- [ ] **Step 1: Update MenuOverlay anchors**

```ts
const anchors = [
  { label: "WORK", href: "#work" },
  { label: "SERVICES", href: "#services" },
  { label: "PROCESS", href: "#process" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];
```

- [ ] **Step 2: Final `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Signals } from "@/components/sections/Signals";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Work />
      <Services />
      <Process />
      <About />
      <Signals />
      <Contact />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3: Delete dead files**

After confirming the grep in the Files block returns no remaining imports:

```bash
git rm components/sections/Experience.tsx components/sections/TechStack.tsx components/sections/SelectedWork.tsx components/sections/ProjectRow.tsx lib/experience.ts lib/stack.ts
```

If the grep shows a survivor (e.g., ImageTrail or MenuOverlay referencing one), fix that import first — do not leave dead code.

- [ ] **Step 4: Extend `e2e/landing.spec.ts`**

Append these tests:

```ts
test("landing shows the five new sections in order", async ({ page }) => {
  await page.goto("/");
  for (const id of ["work", "services", "process", "about", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.getByText("Case studies.")).toBeVisible();
  await expect(page.getByText("Four ways to work together.")).toBeVisible();
  await expect(page.getByText("No chaos. A process.")).toBeVisible();
});

test("lead form validates inline and falls back gracefully when unconfigured", async ({
  page,
}) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: /start a project/i }).click();
  await expect(page.getByText("Tell me your name")).toBeVisible();

  await page.getByPlaceholder("Jane Founder").fill("Jane Founder");
  await page.getByPlaceholder("jane@company.com").fill("jane@startup.io");
  await page
    .getByPlaceholder(/what are we making/i)
    .fill("We need a new marketing site for our Q4 launch.");
  await page.getByRole("button", { name: /start a project/i }).click();

  // Local dev has no RESEND_API_KEY → route returns 503 → fallback panel
  await expect(page.getByText(/email me directly/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /createwithabhi19@gmail\.com/i }),
  ).toBeVisible();
});

test("menu anchors navigate to the new sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /menu/i }).click();
  await page.getByRole("link", { name: "SERVICES" }).click();
  await expect(page.locator("#services")).toBeInViewport();
});
```

Adjust selectors to the real DOM if a locator misses (e.g., the MENU control's accessible name — check `components/chrome/TopBar.tsx`), but keep the assertions' strength: inline error visible, fallback panel visible, section in viewport.

- [ ] **Step 5: Full verification**

Run: `command pnpm lint && command pnpm exec tsc --noEmit && command pnpm build && command pnpm test && command pnpm test:e2e`
Expected: unit suites green; e2e 8/8.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: final landing wiring — new nav anchors, section order, dead code removed, e2e extended"
```

---

## Self-Review Notes

- **Spec coverage:** §4.02 Work → Task 4 (case-study *pages* and shared-element transitions are Plan 3 by design — cards link to live URLs meanwhile); §4.03 Services → Task 5; §4.04 Process → Task 6; §4.05 About → Task 7 (portrait placeholder per user decision; UpSunday inline-media chips deferred to Plan 3 polish); §4.06 Signals → Task 7; §4.07 Contact hybrid lead path → Tasks 2/3/8 (booking leg intentionally disabled: `BOOKING_URL = null` per user); "particles return behind Contact" deferred to Plan 3 polish (needs a second scene mount — noted, not silently dropped).
- **Decisions honored:** canonical email gmail everywhere (Task 8 removes the footer's hello@ and updates e2e); SERVICES anchor lands in Task 9 (closes the Plan-1 ledger item); placeholders clearly marked (`placeholder: true`, `PLACEHOLDER` attributions, portrait swap comment).
- **Type consistency check:** `featuredWork`/`Project.kind/outcome/gradient` (Task 1) match Task 4's usage; `PROJECT_TYPE_LABELS`/`BUDGET_LABELS`/`BOOKING_URL`/`leadSchema` (Task 2) match Tasks 3 and 8; route response contract (Task 3) matches Contact's status handling (Task 8); section ids match Task 9's anchors and e2e.
- **Known risks flagged for implementers:** FadeUp props unknown → checked in Task 4; `lib/currently.ts` shape unknown → checked in Task 7; zod enum typing variant → fallback given in Task 2; MENU accessible name → checked in Task 9.
