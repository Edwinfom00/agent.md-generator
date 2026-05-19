# CLAUDE.md — agent-md-generator

> You are an AI coding assistant working on **agent-md-generator**, a focused web app that generates production-grade `AGENT.md` files via a 4-step wizard powered by DeepSeek. Read this file fully before writing any code.

---

## Project Identity

**Name:** agent-md-generator
**Live URL:** https://agent-md-generator.edwinfom.dev
**Author:** Edwin Fom (https://github.com/Edwinfom00)
**Type:** Web Application — Next.js App Router, single-purpose tool
**License:** MIT

**What it does:**
Guides developers through 12 targeted questions across 4 steps, then calls the DeepSeek API to generate a complete, project-specific `AGENT.md` (600–1000 lines). The output file is placed at the project root so AI assistants (Claude, Cursor, Kiro, Copilot) read it before every response.

**What it does NOT do:**
- Store any user data server-side
- Authenticate users
- Manage projects or workspaces
- Provide a dashboard or persistence layer

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | Server components + client components. See AGENTS.md for version-specific rules. |
| Language | TypeScript 5 — strict mode | No `any`. Use `unknown` + narrowing instead. |
| UI | React 19 | Functional components only. No class components. |
| Styling | Tailwind CSS v4 | Custom design tokens via CSS variables in `globals.css`. PostCSS pipeline. |
| AI / LLM | Vercel AI SDK (`ai@6`) + `@ai-sdk/deepseek` | `generateText()` only — no streaming. Model: `deepseek-chat`. Temp: 0.3, max 8000 tokens. |
| Markdown | `react-markdown` + `remark-gfm` | Used in preview pane and output screen. |
| Animation | `framer-motion` | Used for transitions and loading states. |
| Icons | `react-icons` (Remix Icons: `ri-*`) + `lucide-react` | Prefer Remix Icons (`RiXxx`) for consistency. |
| Utilities | `clsx` + `tailwind-merge` via `cn()` | Always use `cn()` from `src/lib/cn.ts` for className composition. |
| Fonts | Instrument Serif · Geist · JetBrains Mono | Loaded via Next.js `next/font/google` in `layout.tsx`. |
| Node.js | >= 20 | |

**Environment variables:**
```
DEEPSEEK_API_KEY=sk-...   # Required. Server-only. Never expose to client.
```

---

## Project Structure

```
apps/agent-md-generator/
├── src/
│   ├── app/
│   │   ├── page.tsx                  ← entry point — renders <WizardShell />
│   │   ├── layout.tsx                ← root layout: fonts, metadata, body className
│   │   ├── globals.css               ← Tailwind v4 base + all design tokens (CSS vars)
│   │   ├── opengraph-image.tsx       ← OG image (Next.js built-in ImageResponse)
│   │   ├── sitemap.ts                ← SEO sitemap
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts          ← POST /api/generate — only server API route
│   ├── components/
│   │   ├── ui/                       ← dumb, reusable primitives
│   │   │   ├── AppHeader.tsx         ← top nav bar (logo + title)
│   │   │   ├── AppFooter.tsx         ← step navigation: Back / Continue / Generate
│   │   │   ├── StepRail.tsx          ← 4-step horizontal progress indicator
│   │   │   ├── PreviewPane.tsx       ← right-column live AGENT.md preview
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Textarea.tsx
│   │   ├── wizard/                   ← wizard flow components
│   │   │   ├── WizardShell.tsx       ← main state machine (step + answers + generation)
│   │   │   ├── QuestionField.tsx     ← renders text / textarea / select / multiselect
│   │   │   ├── ReviewStep.tsx        ← summary of all answers grouped by category
│   │   │   └── GeneratingScreen.tsx  ← loading state shown during DeepSeek call
│   │   └── output/                   ← post-generation output components
│   │       ├── ResultScreen.tsx      ← full output viewer with tabs and metadata
│   │       ├── OutputPanel.tsx       ← markdown preview + source code view
│   │       ├── CopyButton.tsx        ← copy-to-clipboard button
│   │       └── DownloadButton.tsx    ← download as AGENT.md or CLAUDE.md
│   ├── lib/
│   │   ├── cn.ts                     ← clsx + tailwind-merge helper
│   │   ├── questions.ts              ← 12 questions config, step/category grouping, visibility logic
│   │   └── buildPrompt.ts            ← maps WizardAnswers → DeepSeek prompt string
│   └── types/
│       └── index.ts                  ← all shared TypeScript types
├── _prototype/                       ← design reference (JSX mockups). Read-only. Do not modify.
├── public/                           ← static assets (SVGs, screenshots)
├── AGENTS.md                         ← Next.js version-specific rules
├── CLAUDE.md                         ← this file
├── ROADMAP.md                        ← planned features and improvement backlog
├── README.md                         ← public-facing documentation
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── .env.local                        ← DEEPSEEK_API_KEY (never commit)
```

---

## Architecture

### State machine (`WizardShell.tsx`)

The entire app state lives in `WizardShell`. There is no global store (no Zustand, no Context).

```
WizardStep: 'questions' → 'review' → 'generating' → 'output'
```

State:
- `wizardStep: WizardStep` — current screen
- `currentStep: number` — active question step (1–4)
- `answers: WizardAnswers` — `{ [questionId]: string | string[] }`
- `output: string` — generated markdown content
- `error: string` — error message if generation fails
- `loading: boolean` — true during DeepSeek call

**Navigation rules:**
- `handleNext()` — advances `currentStep`, or moves to `'review'` after step 4
- `handleBack()` — goes back one step, or from review back to step 4
- `handleGenerate()` — calls `/api/generate`, transitions to `'generating'`, then `'output'` or back to `'review'` on error
- `handleReset()` — clears all state, returns to step 1

### Questions system (`src/lib/questions.ts`)

12 questions defined as a typed config array. Each question has:
- `id` — unique key used in `WizardAnswers`
- `step` — which wizard step (1–4)
- `category` — display grouping label
- `type` — `'text' | 'textarea' | 'select' | 'multiselect'`
- `required` — controls `isStepValid()` gate
- `dependsOn?` — conditional visibility: `{ questionId, value: string | string[] }`

**Current conditional questions:**
- `ai_providers` → only shown if `ai_features` is `'yes_core'` or `'yes_secondary'`
- `ui_style` → only shown if `project_type` is `'web_app'`, `'mobile_app'`, or `'fullstack'`

### Generation flow

```
WizardShell.handleGenerate()
  → POST /api/generate { answers: WizardAnswers }
    → buildPrompt(answers) → prompt string
    → createDeepSeek({ apiKey }) → deepseek('deepseek-chat')
    → generateText({ model, prompt, temperature: 0.3, maxOutputTokens: 8000 })
    → return { content: string }
  → setOutput(content)
  → setWizardStep('output')
```

**No streaming.** `generateText` waits for the complete response. This is intentional.

---

## Design System

The app follows an editorial aesthetic. All tokens are CSS variables defined in `src/app/globals.css`.

### Color tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-paper` | `#F1ECE2` | Page background, warm off-white |
| `--color-ink` | `#141413` | Primary text, near-black |
| `--color-cobalt` | `#2536D6` | Primary accent — CTAs, step number, emphasis |
| `--color-ink-mute` | `#6B665B` | Secondary text, hints, metadata |
| `--color-signal` | (red) | Error states |

Use as Tailwind utility classes: `bg-paper`, `text-ink`, `text-cobalt`, `text-ink-mute`.

### Typography

| Variable | Font | Usage |
|----------|------|-------|
| `--font-instrument-serif` | Instrument Serif | Large headings, step titles |
| `--font-geist` | Geist | Body text, UI labels, paragraphs |
| `--font-mono` / `--font-jetbrains-mono` | JetBrains Mono | Code blocks, metadata tags, step counters |

Apply via inline style `fontFamily: 'var(--font-instrument-serif)'` for serif headings. Tailwind classes for mono: `font-mono`.

### Layout

The main wizard uses a two-column grid with a fixed right column:
```css
grid-template-columns: 1fr 540px;
```
Left column: questions (scrollable). Right column: `PreviewPane` (fixed).

---

## Coding Conventions

### TypeScript

```typescript
// ✅ CORRECT
function getLabel(questionId: string, value: string | string[]): string { ... }

// ❌ INCORRECT
function getLabel(questionId: any, value: any): any { ... }
```

- No `any`. Use `unknown` + type narrowing.
- No non-null assertions (`!`) without a comment explaining why it's safe.
- Prefer `type` over `interface` for unions and simple shapes. Use `interface` for objects that may be extended.
- All shared types go in `src/types/index.ts`.

### Components

```typescript
// ✅ CORRECT — named export, functional component
export function QuestionField({ question, answers, onChange, index }: Props) { ... }

// ❌ INCORRECT — default export
export default function QuestionField(...) { ... }
```

- Named exports only. No `export default`.
- Every component that uses state, effects, or browser APIs must have `'use client'` at the top.
- Server components: `page.tsx`, `layout.tsx`, `route.ts`, `opengraph-image.tsx`, `sitemap.ts`.
- No class components.

### className composition

```typescript
// ✅ CORRECT
import { cn } from '@/lib/cn'
className={cn('base-class', condition && 'conditional-class', className)}

// ❌ INCORRECT
className={`base-class ${condition ? 'conditional-class' : ''}`}
```

Always use `cn()` for conditional or merged classNames.

### File organization

- One component per file. File name = component name (PascalCase).
- Utility functions in `src/lib/`. New utility → new file.
- No business logic in components. Components call lib functions; lib functions do the work.
- `_prototype/` is read-only design reference. Never import from it in production code.

### Comments

Write no comments. If a line needs explanation, rename the variable or extract a named function.

---

## API Route

### `POST /api/generate`

**Location:** `src/app/api/generate/route.ts`

**Request body:**
```typescript
{ answers: WizardAnswers }
// WizardAnswers = { [questionId: string]: string | string[] }
```

**Response (success):**
```typescript
{ content: string }  // raw markdown, 600-1000 lines
```

**Response (error):**
```typescript
{ error: string }  // HTTP 400 or 500
```

**Guards:**
1. `DEEPSEEK_API_KEY` must be set — returns 500 if missing
2. Request body must be valid JSON — returns 400 if not
3. `body.answers` must be an object — returns 400 if missing

**Do not add** authentication, CORS headers, or caching to this route without checking the roadmap first (rate limiting is a planned P0 feature).

---

## Key Types

```typescript
// src/types/index.ts

type QuestionType = 'text' | 'select' | 'multiselect' | 'textarea'

interface Question {
  id: string
  step: number           // 1–4
  category: string       // 'Identity' | 'Tech Stack' | 'Architecture' | 'Constraints'
  question: string
  hint?: string
  type: QuestionType
  options?: QuestionOption[]
  placeholder?: string
  required: boolean
  dependsOn?: { questionId: string; value: string | string[] }
}

interface WizardAnswers {
  [questionId: string]: string | string[]
}

type WizardStep = 'questions' | 'review' | 'generating' | 'output'

interface GenerateRequest  { answers: WizardAnswers }
interface GenerateResponse { content: string; error?: string }
```

---

## Hard Constraints

1. **No secrets on the client.** `DEEPSEEK_API_KEY` is read exclusively in `src/app/api/generate/route.ts`. Never import `process.env` in any `'use client'` component.
2. **No new packages without a clear reason.** The bundle is already well-sized. Ask before adding anything.
3. **No database.** This app is intentionally stateless. All persistence is client-side (localStorage for future features).
4. **No authentication.** No login, no sessions, no user accounts.
5. **Do not modify `_prototype/`.** It is a design reference, not production code.
6. **Do not change the generation behavior** (temperature, max tokens, model) without testing that output quality is maintained.
7. **Never use `export default`** for components or utilities.

---

## Development Philosophy

**MVP first, iterate later.** Ship the smallest useful version of each feature. Avoid premature abstraction. Three similar lines is better than a wrong abstraction.

When implementing a roadmap item:
1. Read `ROADMAP.md` for the scoped spec
2. Identify files to touch — touch only those
3. Write the simplest implementation that satisfies the spec
4. No error handling for impossible cases
5. No feature flags

---

## Adding a New Question

1. Open `src/lib/questions.ts`
2. Add a new `Question` object to the `QUESTIONS` array
3. Set `step`, `category`, `type`, `required`, and optionally `dependsOn`
4. If `type` is `'select'` or `'multiselect'`, add `options: QuestionOption[]`
5. Update `buildPrompt.ts` — extract the new answer and inject it into the prompt string
6. If the question affects `WizardAnswers` type, no change needed (it's an index signature)

---

## Adding a New Roadmap Feature

Before writing code:
1. Check `ROADMAP.md` for the existing spec
2. Identify which files need to change
3. Implement only what the spec describes — no scope creep
4. Update `ROADMAP.md` status from 📋 to ✅ when done

---

## Local Development

```bash
# From the monorepo root or directly:
cd apps/agent-md-generator
npm install
cp .env.local.example .env.local
# Add your DEEPSEEK_API_KEY to .env.local
npm run dev
# → http://localhost:3000
```

**Build:**
```bash
npm run build
npm start
```

**Lint:**
```bash
npm run lint
```

There are no tests currently. See ROADMAP.md (P3 — Playwright E2E) for the planned testing strategy.

---

## Final Reminder

- This is a single-purpose tool. Every decision should serve the core flow: questions → generation → download.
- The output quality depends entirely on `buildPrompt.ts`. If something feels off in the generated file, that's where to look.
- The design is intentionally editorial (warm paper tones, serif headings, mono metadata). Do not introduce Material UI, Bootstrap, or any component library that would override the design tokens.
- When in doubt, read `_prototype/` to understand the intended visual direction.
