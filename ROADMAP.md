# Roadmap — agent-md-generator

> Twelve questions. Four minutes. A production-grade AGENT.md.

This document tracks planned improvements, features, and technical debt for `agent-md-generator`. Items are grouped by priority and theme.

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Shipped |
| 🚧 | In progress |
| 📋 | Planned |
| 💡 | Idea / under consideration |

---

## P0 — Critical (ship next)

### ✅ Sauvegarde automatique (localStorage)

**Problem:** If the user closes the tab mid-wizard, all answers are lost with no recovery path.

**Solution:** Persist wizard state in `localStorage` after every answer change. On mount, detect a saved session and offer "Resume where you left off" or "Start fresh".

**Files to touch:**
- `src/components/wizard/WizardShell.tsx` — sync `answers` + `currentStep` + `wizardStep` to `localStorage` on every `setAnswers` call
- Add a `SessionBanner` component shown on mount if a saved session is detected

**Scope:** ~40 lines. No new dependency needed (`localStorage` is native).

---

### ✅ Rate limiting on `/api/generate`

**Problem:** The endpoint is publicly accessible. A single client can spam it and exhaust the DeepSeek API quota without any guard.

**Solution:** Add IP-based rate limiting using Upstash Redis + `@upstash/ratelimit`. Limit to 5 requests per IP per hour.

**Files to touch:**
- `src/app/api/generate/route.ts` — add rate limit check before calling DeepSeek
- `.env.local` — add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

**Dependencies to add:** `@upstash/ratelimit`, `@upstash/redis`

---

## P1 — High value

### ✅ Templates de démarrage

**Problem:** Users start from a blank wizard with no initial guidance. High cognitive load for new users.

**Solution:** Add a "Start from a template" screen before Step 1. Offer 4-5 pre-filled answer sets:

| Template | Pre-fills |
|----------|-----------|
| Next.js SaaS | TypeScript, React, Next.js, Tailwind, Prisma, Supabase |
| API Backend Node.js | TypeScript, Node.js, Fastify/Hono, Zod |
| Mobile React Native | TypeScript, React Native, Expo |
| Full-Stack Monorepo | TypeScript, React, Node.js, Prisma |
| CLI Tool | TypeScript, Node.js |

Selecting a template pre-fills `answers` state — the user can still edit everything.

**Files to touch:**
- New `src/lib/templates.ts` — define template configs
- New `src/components/wizard/TemplatePickerScreen.tsx`
- `src/components/wizard/WizardShell.tsx` — add `'template'` as initial `WizardStep`
- `src/types/index.ts` — add `'template'` to `WizardStep` union

---

### ✅ Import depuis `package.json` / `requirements.txt`

**Problem:** Users with existing projects have to manually type their tech stack even though it's already declared in their manifest file.

**Solution:** On the Tech Stack step, add a file drop zone: "Drop your `package.json` or `requirements.txt` to auto-fill". Parse the file client-side, map known packages to question options, and pre-check them.

**Mapping examples:**
- `next` → Next.js ✓
- `tailwindcss` → Tailwind CSS ✓
- `@prisma/client` → Prisma ✓
- `@supabase/supabase-js` → Supabase ✓
- `zustand` → Zustand ✓
- `zod` → Zod ✓

**Files to touch:**
- New `src/lib/parseManifest.ts` — parsing + mapping logic
- `src/components/wizard/QuestionField.tsx` or a new `ManifestDropZone.tsx`

**No server-side processing needed** — parse happens entirely in the browser.

---

### ✅ Validation du contenu généré

**Problem:** DeepSeek can occasionally return malformed or incomplete output. The app currently displays whatever it receives without checking.

**Solution:** After generation, run a lightweight validation pass on the markdown:
1. Check that at least 6 expected section headings are present (`## Tech Stack`, `## Architecture`, `## Constraints`, etc.)
2. Check that total length is ≥ 2000 characters
3. If validation fails → show a warning banner with a "Regenerate" button, don't silently show broken output

**Files to touch:**
- New `src/lib/validateOutput.ts`
- `src/app/api/generate/route.ts` — call validator before returning response, or return a `warnings` field
- `src/components/output/ResultScreen.tsx` — display warning banner if `warnings` is non-empty

---

## P2 — Medium value

### ✅ Questions conditionnelles enrichies

**Problem:** The current wizard has only one conditional (`ai_providers` depends on `ai_features`). Users on Python or mobile projects get questions that don't apply to them.

**Solution:** Add conditional logic for:
- Python selected → show "Python framework?" (Django / FastAPI / Flask / FastAPI)
- `mobile_app` selected → show "Target platforms?" (iOS only / Android only / Both)
- `npm_package` selected → show "Distribution?" (ESM only / CommonJS + ESM / Browser + Node)

**Files to touch:**
- `src/lib/questions.ts` — add new questions with `dependsOn` config
- `src/types/index.ts` — no change needed (already supports multi-value `dependsOn`)

---

### ✅ Score de complétude du fichier généré

**Problem:** Users can't tell at a glance if their generated file is thorough or missing important sections.

**Solution:** After generation, compute and display a "Coverage score" (e.g., "9/12 sections covered"). Score based on presence of canonical AGENT.md sections. Show a breakdown list: ✅ Tech Stack · ✅ Architecture · ❌ Testing strategy · etc.

**Files to touch:**
- New `src/lib/scoreOutput.ts`
- `src/components/output/ResultScreen.tsx` — add score widget to the output metadata bar

---

### ✅ Export multi-format

**Problem:** Different AI tools expect differently named files with slightly different conventions:

| Tool | Expected file |
|------|--------------|
| Claude Code | `CLAUDE.md` |
| Kiro | `AGENT.md` |
| Cursor | `.cursorrules` |
| Windsurf | `.windsurfrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |

**Solution:** On the output screen, replace the current two-button download with a dropdown "Download as..." that lists all formats. Content is identical; only filename and minor formatting differ.

**Files to touch:**
- `src/components/output/DownloadButton.tsx` — convert to dropdown
- New `src/lib/formatOutput.ts` — per-format transformations (mostly filename changes, minor preamble adjustments)

---

### ✅ Édition inline post-génération

**Problem:** If the user wants to tweak one sentence in the generated file, they currently have to go back, re-answer, and regenerate — an expensive roundtrip.

**Solution:** Add an "Edit" toggle on the output screen that switches the preview from read-only to an editable `<textarea>`. Changes are reflected in the download immediately without hitting the API again.

**Files to touch:**
- `src/components/output/ResultScreen.tsx` — add `isEditing` state + editable textarea mode
- `src/components/output/OutputPanel.tsx` — conditional render: markdown preview vs. plain textarea

---

### ✅ Historique des générations (localStorage)

**Problem:** If the user generates a file, navigates away, and comes back, the output is gone.

**Solution:** Store the last 3 generations in `localStorage` (answers snapshot + output content + timestamp). Show a "Recent generations" panel accessible from the header.

**Files to touch:**
- New `src/lib/history.ts` — read/write helpers for history in localStorage
- `src/components/ui/AppHeader.tsx` — add "History" button
- New `src/components/ui/HistoryDrawer.tsx`

---

## P3 — Future

### ✅ Mode "Update AGENT.md"

Allow users to upload an existing `AGENT.md`, describe what they want to change ("Add a testing section", "Update the tech stack to include Drizzle"), and generate a patched version. Uses a diff-aware prompt instead of generating from scratch.

---

### ✅ Partage via lien

Generate a shareable URL that encodes the wizard answers as base64 URL params (no backend needed). The recipient opens the link and the wizard is pre-filled with the sender's configuration. Useful for teams sharing a project spec template.

Example: `https://agent-md-generator.edwinfom.dev?config=eyJwcm9qZWN0X25hbWUiOiJNeUFwcCJ9`

---

### ✅ Mode CLI

```bash
npx agent-md-generator
```

Interactive terminal wizard (using `@clack/prompts`) that asks the same 12 questions and writes `AGENT.md` directly to the project root. Targets developers who prefer working in the terminal.

**Files added:**
- `cli/index.ts` — entry point: env loading, question loop, file write
- `cli/prompts.ts` — per-type renderers (`text`, `textarea`, `select`, `multiselect`)
- `cli/generate.ts` — DeepSeek call (same params as the web API route)
- `tsup.config.ts` — builds `dist/cli.mjs` (ESM, Node 20, shebang injected)

**Dependencies added:** `@clack/prompts` (runtime), `tsup` (devDependency)

**Build:** `npm run build:cli` → `dist/cli.mjs`

---

### 💡 Tests E2E (Playwright)

Add a Playwright test that:
1. Completes the full 4-step wizard with sample answers
2. Clicks "Generate AGENT.md"
3. Asserts the output screen is reached and contains expected headings
4. Asserts the download buttons are present

Critical regression safety net — the generation flow is the entire value of the app.

---

## Shipped ✅

- 4-step wizard (Identity → Tech Stack → Architecture → Constraints)
- Live preview pane updating in real-time as you answer
- Conditional questions (`ai_providers` depends on `ai_features`, `ui_style` depends on `project_type`)
- Review screen with full answer summary before generation
- DeepSeek generation via `/api/generate` — 600-1000 line output
- Download as `AGENT.md` or `CLAUDE.md`
- Copy to clipboard
- No server-side storage — answers discarded after generation
- Custom design system (paper/ink/cobalt tokens, Instrument Serif + Geist + JetBrains Mono)
- Responsive two-column layout

---

*Last updated: 2026-05-19*
- Share via link: fixed URL-safe base64 encoding (btoa + encodeURIComponent + `-`/`_` substitution)
