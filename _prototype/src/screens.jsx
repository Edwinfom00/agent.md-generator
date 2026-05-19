/* global React */
const { Fragment } = React;

// ============================================================
// Shared chrome
// ============================================================

function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">▤ agent</span>
        <span className="brand-name"><b>agent</b><span className="dot">.</span><i>md</i> generator</span>
      </div>
      <div className="powered">
        <span>v1.0 · 2026</span>
        <span className="powered-by">Powered by <b>you</b> — built by Edwin&nbsp;Fom</span>
        <span className="gh">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.88 2.34.67.07-.52.28-.88.51-1.08-1.78-.2-3.64-.89-3.64-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          edwinfom00
        </span>
      </div>
    </header>
  );
}

function StepRail({ current }) {
  const steps = [
    { no: "01", name: "Identity" },
    { no: "02", name: "Tech Stack" },
    { no: "03", name: "Architecture" },
    { no: "04", name: "Constraints" },
  ];
  return (
    <nav className="steps">
      {steps.map((s, i) => {
        const isDone = i < current;
        const isCur = i === current;
        return (
          <div key={s.no} className={`step ${isDone ? "is-done" : ""} ${isCur ? "is-current" : ""}`}>
            <div className="step-no">{s.no}</div>
            <div className="step-name">{s.name}</div>
            <span className="tick">{isDone ? "✓ done" : isCur ? "in progress" : "—"}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AppFooter({ step, total, primary = "Continue", backLabel = "Back", accent = false }) {
  return (
    <footer className="app-footer">
      <div className="left">
        <button className="btn ghost"><span className="arrow">←</span> {backLabel}</button>
      </div>
      <div className="footer-counter">step <b>{String(step + 1).padStart(2, "0")}</b> of {String(total).padStart(2, "0")} · <b>autosaved</b> in browser</div>
      <div className="right">
        <span className="footer-counter">⌘ + ↵ to continue</span>
        <button className={`btn primary ${accent ? "accent" : ""}`}>{primary} <span className="arrow">→</span></button>
      </div>
    </footer>
  );
}

// ============================================================
// Form bits
// ============================================================

function Question({ no, title, hint, required, children }) {
  return (
    <div className="q">
      <div className="q-no">Q.{String(no).padStart(2, "0")}</div>
      <div className="q-body">
        <div className="q-title">{title}{required && <span className="req">*</span>}</div>
        {hint && <div className="q-hint">{hint}</div>}
        {children}
      </div>
    </div>
  );
}

function TextField({ value, placeholder, focused, prefix }) {
  const has = !!value;
  const cls = `text-field ${focused ? "is-focused" : ""} ${has ? "has-value" : "placeholder"}`;
  return (
    <div className={cls}>
      {prefix && <span className="prefix">{prefix}</span>}
      <span>{has ? value : placeholder}</span>
      {focused && <span className="caret" />}
    </div>
  );
}

function TextArea({ value, placeholder, count }) {
  const has = !!value;
  return (
    <>
      <div className={`textarea ${has ? "has-value" : "placeholder"}`}>
        {has ? value : placeholder}
      </div>
      <div className="textarea-foot">
        <span>markdown supported</span>
        <span>{count || "0"} / 600</span>
      </div>
    </>
  );
}

function OptionGrid({ items, value, keys }) {
  return (
    <div className="options">
      {items.map((it, i) => {
        const checked = value === it.v;
        return (
          <div key={it.v} className={`opt ${checked ? "checked" : ""}`}>
            <span className="opt-radio" />
            <div className="opt-label">
              <b>{it.label}</b>
              <span>{it.desc}</span>
            </div>
            <span className="opt-key">{keys ? keys[i] : String.fromCharCode(65 + i)}</span>
          </div>
        );
      })}
    </div>
  );
}

function CheckGrid({ items, value }) {
  return (
    <div className="options">
      {items.map((it, i) => {
        const checked = value.includes(it.v);
        return (
          <div key={it.v} className={`opt ${checked ? "checked" : ""}`}>
            <span className="opt-check">✓</span>
            <div className="opt-label">
              <b>{it.label}</b>
              <span>{it.desc}</span>
            </div>
            <span className="opt-key">{String.fromCharCode(65 + i)}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChipRow({ items, value, accent = false }) {
  return (
    <div className="chips">
      {items.map((it) => {
        const checked = value.includes(it.v || it);
        return (
          <div key={it.v || it} className={`chip ${checked ? "checked" : ""} ${accent ? "accent" : ""}`}>
            <span className="dot" />
            <span>{it.label || it}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Preview pane (right side, shows live AGENT.md)
// ============================================================

function PreviewPane({ stage }) {
  return (
    <aside className="preview-col">
      <div className="preview-head">
        <span className="preview-title">Live preview · AGENT.md</span>
        <div className="preview-actions">
          <span>⌘C copy</span>
          <span>⌘↓ download</span>
        </div>
      </div>
      <div className="preview-doc">
        {stage >= 1 && <h1>Preflight</h1>}
        {stage >= 1 && <p className="ghost"># A VS Code extension</p>}
        {stage >= 1 && (
          <>
            <h2>// Project</h2>
            <p>Preflight helps developers ship cleaner code by detecting <code>console.log</code> statements, tracking TODOs with deadlines, and generating AI-powered commit messages from staged diffs.</p>
            <h3>Type</h3>
            <p><code>vscode_extension</code> · TypeScript · VS Code API</p>
          </>
        )}
        {stage >= 2 && (
          <>
            <h2>// Tech stack</h2>
            <ul>
              <li>TypeScript (strict)</li>
              <li>VS Code Extension API</li>
              <li>Vercel AI SDK</li>
              <li>Zod for input validation</li>
            </ul>
            <h3>AI providers</h3>
            <p>OpenAI · Anthropic (Claude) · model-agnostic</p>
          </>
        )}
        {stage >= 3 && (
          <>
            <h2>// Folder structure</h2>
            <p>src/<br/>&nbsp;&nbsp;commands/  <span className="ghost">— VS Code commands</span><br/>&nbsp;&nbsp;detectors/ <span className="ghost">— debug-statement scanners</span><br/>&nbsp;&nbsp;ai/        <span className="ghost">— commit-msg pipeline</span><br/>&nbsp;&nbsp;lib/       <span className="ghost">— utils</span></p>
            <h3>Conventions</h3>
            <ul>
              <li>No TypeScript <code>any</code></li>
              <li>Named exports only</li>
              <li>Functional components only</li>
              <li>Small focused files</li>
            </ul>
          </>
        )}
        {stage >= 4 && (
          <>
            <h2>// Constraints</h2>
            <ul>
              <li>No new dependencies without approval</li>
              <li>No telemetry or tracking</li>
              <li>Keep it lightweight (&lt; 200 kb bundle)</li>
            </ul>
            <p>Development philosophy: <b>MVP first, iterate later</b>.</p>
          </>
        )}
        {stage < 1 && (
          <p className="ghost">// answers will materialize here as you fill them in<span className="caret" /></p>
        )}
      </div>
    </aside>
  );
}

// ============================================================
// SCREEN 0 — Hero / landing
// ============================================================

function HeroScreen() {
  return (
    <div className="screen" data-screen-label="00 Hero">
      <AppHeader />
      <div className="hero">
        <div className="hero-left">
          <div>
            <div className="hero-eyebrow">
              <span className="pulse" />
              <span><b>v1.0</b> · markdown spec generator for ai coding agents</span>
            </div>
            <h1 className="hero-title">
              A <em>brief</em><br/>
              for your <em>agent</em>.<span className="stamp">.md</span>
            </h1>
            <p className="hero-sub">
              Twelve questions. Four minutes. Out comes a <b>production-grade <code style={{fontFamily:"var(--mono)", fontSize:15, background:"var(--cobalt-soft)", padding:"1px 6px", borderRadius:3, color:"var(--cobalt-deep)"}}>AGENT.md</code></b> your assistants will read before every keystroke — so they write code that matches your conventions, not theirs.
            </p>
            <div className="hero-cta-row">
              <button className="btn primary accent">Start the brief <span className="arrow">→</span></button>
              <button className="btn ghost">See a sample <span className="arrow">↗</span></button>
            </div>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-label">questions</div>
              <div className="hero-stat-val">12<span className="unit">total</span></div>
            </div>
            <div>
              <div className="hero-stat-label">avg. time</div>
              <div className="hero-stat-val">3:48<span className="unit">min</span></div>
            </div>
            <div>
              <div className="hero-stat-label">storage</div>
              <div className="hero-stat-val">0<span className="unit">bytes server</span></div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="sample-tab-row">
            <div className="sample-tab active">AGENT.md</div>
            <div className="sample-tab">README.md</div>
            <div className="sample-tab">CLAUDE.md</div>
          </div>
          <div className="preview-doc" style={{flex:1, marginTop:0}}>
            <h1>Preflight</h1>
            <p className="ghost"># Engineering spec for AI assistants</p>
            <h2>// Project</h2>
            <p>A VS Code extension that ships cleaner code by detecting <code>debug</code> statements, tracking <code>TODO</code> deadlines, and writing commit messages from staged diffs.</p>
            <h2>// Conventions</h2>
            <ul>
              <li>No TypeScript <code>any</code> — use <code>unknown</code></li>
              <li>Named exports only · no default exports</li>
              <li>Small focused files · one responsibility</li>
              <li>Explicit error handling, always</li>
            </ul>
            <h2>// Forbidden</h2>
            <ul>
              <li>New dependencies without approval</li>
              <li>Secrets in frontend code</li>
              <li>Telemetry or user tracking</li>
            </ul>
            <h2>// Philosophy</h2>
            <p>MVP first, iterate later. The simplest thing that<span className="caret" /></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 1 — Step 01 · Identity
// ============================================================

function Step01() {
  return (
    <div className="screen" data-screen-label="01 Identity">
      <AppHeader />
      <StepRail current={0} />
      <div className="body">
        <div className="form-col">
          <div className="form-head">
            <h2 className="lead">Who is this <em>project</em>?</h2>
            <div className="meta">step 01 of 04<br/><b>Identity</b><br/>≈ 60 seconds</div>
          </div>

          <Question no={1} title="What is the name of your project?" hint="This becomes the H1 of your AGENT.md — keep it short and human." required>
            <TextField value="Preflight" focused={false} />
          </Question>

          <Question no={2} title="What type of project is this?" hint="Defines the architecture and conventions the AI will assume." required>
            <OptionGrid
              value="vscode_extension"
              items={[
                { v: "web_app", label: "Web Application", desc: "Next.js · React · SvelteKit" },
                { v: "mobile_app", label: "Mobile Application", desc: "React Native · Expo · Flutter" },
                { v: "vscode_extension", label: "VS Code Extension", desc: "TypeScript · VS Code API" },
                { v: "npm_package", label: "npm Package / Library", desc: "TypeScript · SDK · CLI" },
                { v: "api_backend", label: "API / Backend", desc: "Express · Fastify · NestJS · Hono" },
                { v: "fullstack", label: "Full-Stack Application", desc: "Frontend + backend in one repo" },
              ]}
            />
          </Question>

          <Question no={3} title="Describe it in 2–3 sentences." hint="What does it do, who is it for, what problem does it solve?" required>
            <TextArea
              value={`Preflight is a VS Code extension that helps developers ship cleaner code by detecting forgotten debug statements, tracking TODOs with deadlines, and generating AI-powered commit messages from staged diffs.\n\nBuilt for solo devs and small teams who care about hygiene but hate ceremony.`}
              count="241"
            />
          </Question>
        </div>
        <PreviewPane stage={1} />
      </div>
      <AppFooter step={0} total={4} primary="Continue to Tech Stack" />
    </div>
  );
}

// ============================================================
// SCREEN 2 — Step 02 · Tech Stack
// ============================================================

function Step02() {
  const stackItems = [
    "TypeScript", "JavaScript", "React", "Next.js", "React Native",
    "Expo", "Tailwind CSS", "Node.js", "Python", "Go", "Rust",
    "Prisma", "Supabase", "Vercel AI SDK", "Zustand", "Zod",
  ];
  const aiProviders = [
    "OpenAI", "Anthropic (Claude)", "DeepSeek", "Google Gemini", "Ollama (local)", "Model-agnostic",
  ];
  return (
    <div className="screen" data-screen-label="02 Tech Stack">
      <AppHeader />
      <StepRail current={1} />
      <div className="body">
        <div className="form-col">
          <div className="form-head">
            <h2 className="lead">What's <em>under</em> the hood?</h2>
            <div className="meta">step 02 of 04<br/><b>Tech Stack</b><br/>≈ 45 seconds</div>
          </div>

          <Question no={4} title="What is your primary tech stack?" hint="Pick everything that ships in production. The AI will refuse to suggest alternatives." required>
            <ChipRow
              value={["TypeScript", "Node.js", "Vercel AI SDK", "Zod"]}
              items={stackItems}
            />
          </Question>

          <Question no={5} title="Does your project use AI / LLM features?" required>
            <OptionGrid
              value="yes_core"
              items={[
                { v: "yes_core", label: "Yes — AI is a core feature", desc: "The app is built around AI capabilities" },
                { v: "yes_secondary", label: "Yes — secondary feature", desc: "AI enhances some flows but isn't the core" },
                { v: "no", label: "No AI features", desc: "Pure logic, no LLM integration" },
              ]}
            />
          </Question>

          <Question no={6} title="Which AI providers will you use?" hint="Conditional on Q.05 — the AI uses this to pick the right SDK and error patterns.">
            <div className="note-strip">unlocked because <b>Q.05 = AI is core</b></div>
            <ChipRow
              accent
              value={["OpenAI", "Anthropic (Claude)", "Model-agnostic"]}
              items={aiProviders}
            />
          </Question>
        </div>
        <PreviewPane stage={2} />
      </div>
      <AppFooter step={1} total={4} primary="Continue to Architecture" />
    </div>
  );
}

// ============================================================
// SCREEN 3 — Step 03 · Architecture
// ============================================================

function Step03() {
  return (
    <div className="screen" data-screen-label="03 Architecture">
      <AppHeader />
      <StepRail current={2} />
      <div className="body">
        <div className="form-col">
          <div className="form-head">
            <h2 className="lead">How is it <em>organized</em>?</h2>
            <div className="meta">step 03 of 04<br/><b>Architecture</b><br/>≈ 90 seconds</div>
          </div>

          <Question no={7} title="Describe your folder structure." hint="Paste a tree. The AI will use this to put new files in the right place." required>
            <TextArea
              count="287"
              value={`src/
  commands/   <- VS Code commands (registered in extension.ts)
  detectors/  <- debug-statement scanners (.ts/.tsx/.py)
  ai/         <- prompt builders + provider adapters
  lib/        <- pure utilities, no side-effects
  types/      <- shared TS types
test/         <- vitest, mirrors src/`}
            />
          </Question>

          <Question no={8} title="Most important coding conventions?" hint="Rules the AI must always follow. Strict typing, file size, error handling…" required>
            <CheckGrid
              value={["no_any", "named_exports", "small_files", "no_overengineering", "error_handling", "env_secrets"]}
              items={[
                { v: "no_any", label: "No TypeScript any", desc: "Use unknown instead — narrow with guards" },
                { v: "no_comments", label: "No code comments", desc: "Code must be self-documenting" },
                { v: "functional", label: "Functional components only", desc: "No class components" },
                { v: "server_components", label: "Prefer Server Components", desc: "Use client only when needed" },
                { v: "named_exports", label: "Named exports only", desc: "No default exports" },
                { v: "small_files", label: "Small focused files", desc: "One responsibility per file" },
                { v: "no_overengineering", label: "No overengineering", desc: "Build the simplest thing that works" },
                { v: "error_handling", label: "Explicit error handling", desc: "Always handle errors gracefully" },
              ]}
            />
          </Question>
        </div>
        <PreviewPane stage={3} />
      </div>
      <AppFooter step={2} total={4} primary="Continue to Constraints" />
    </div>
  );
}

// ============================================================
// SCREEN 4 — Step 04 · Constraints
// ============================================================

function Step04() {
  return (
    <div className="screen" data-screen-label="04 Constraints">
      <AppHeader />
      <StepRail current={3} />
      <div className="body">
        <div className="form-col">
          <div className="form-head">
            <h2 className="lead">What must it <em>never</em> do?</h2>
            <div className="meta">step 04 of 04<br/><b>Constraints</b><br/>≈ 60 seconds</div>
          </div>

          <Question no={9} title="Hard constraints — things the AI must NEVER do." required>
            <CheckGrid
              value={["no_new_deps", "no_telemetry", "lightweight"]}
              items={[
                { v: "no_db", label: "No database", desc: "Local state or files only" },
                { v: "no_auth", label: "No authentication", desc: "No login, no user accounts" },
                { v: "no_new_deps", label: "No new dependencies", desc: "Ask before adding any package" },
                { v: "no_telemetry", label: "No telemetry or tracking", desc: "No analytics, no user tracking" },
                { v: "no_breaking_changes", label: "No breaking API changes", desc: "Maintain backward compat" },
                { v: "offline_first", label: "Offline first", desc: "Must work without internet" },
                { v: "lightweight", label: "Keep it lightweight", desc: "Minimize bundle size" },
                { v: "no_class_components", label: "No class components", desc: "Function components only" },
              ]}
            />
          </Question>

          <Question no={10} title="Development philosophy?" hint="How should the AI approach building features?" required>
            <OptionGrid
              value="mvp_first"
              items={[
                { v: "mvp_first", label: "MVP first, iterate later", desc: "Build the smallest useful version" },
                { v: "production_grade", label: "Production-grade from day one", desc: "Build it right the first time" },
                { v: "teachable", label: "Teachable & approachable", desc: "Easy to understand and explain" },
                { v: "performance", label: "Performance first", desc: "Optimize for speed and efficiency" },
              ]}
            />
          </Question>

          <Question no={11} title="Anything else the AI should know?" hint="Edge cases, decisions already made, conventions specific to this codebase.">
            <TextArea
              value={`API keys live in .env.local and are never bundled to the client. All LLM calls go through the Vercel AI SDK. Deployed on Vercel. Use Zod for any user-facing input. Prefer streaming responses where possible.`}
              count="218"
            />
          </Question>
        </div>
        <PreviewPane stage={4} />
      </div>
      <AppFooter step={3} total={4} primary="Generate AGENT.md" accent />
    </div>
  );
}

// ============================================================
// SCREEN 5 — Result
// ============================================================

function ResultScreen() {
  const lines = [
    { t: "h1", s: "# Preflight" },
    { t: "comment", s: "<!-- Engineering spec for AI coding assistants · v1 · 2026-05-19 -->" },
    { t: "blank" },
    { t: "h2", s: "## 1. Project" },
    { t: "p", s: 'Preflight is a **VS Code extension** that helps developers ship cleaner code by' },
    { t: "p", s: "detecting forgotten `debug` statements, tracking `TODO` deadlines, and generating" },
    { t: "p", s: "AI-powered commit messages from staged diffs." },
    { t: "blank" },
    { t: "h3", s: "Type" },
    { t: "p", s: "`vscode_extension` · TypeScript · VS Code Extension API" },
    { t: "blank" },
    { t: "h2", s: "## 2. Tech stack" },
    { t: "p", s: "- TypeScript (strict mode, no `any`)" },
    { t: "p", s: "- VS Code Extension API" },
    { t: "p", s: "- Vercel AI SDK · model-agnostic provider layer" },
    { t: "p", s: "- Zod for input validation" },
    { t: "blank" },
    { t: "h3", s: "AI providers" },
    { t: "p", s: "OpenAI · Anthropic (Claude) · model-agnostic" },
    { t: "blank" },
    { t: "h2", s: "## 3. Folder structure" },
    { t: "code", s: "```" },
    { t: "code", s: "src/" },
    { t: "code", s: "  commands/   ← VS Code commands" },
    { t: "code", s: "  detectors/  ← debug-statement scanners" },
    { t: "code", s: "  ai/         ← prompt builders + provider adapters" },
    { t: "code", s: "  lib/        ← pure utilities" },
    { t: "code", s: "  types/      ← shared TS types" },
    { t: "code", s: "```" },
    { t: "blank" },
    { t: "h2", s: "## 4. Conventions (must follow)" },
    { t: "p", s: "- **No TypeScript `any`** — use `unknown` and narrow with guards" },
    { t: "p", s: "- **Named exports only** — no `export default`" },
    { t: "p", s: "- **Small focused files** — one responsibility per file" },
    { t: "p", s: "- **Explicit error handling** — never swallow errors" },
  ];

  function lineClass(t) {
    return t === "h1" ? "h1"
         : t === "h2" ? "h2"
         : t === "h3" ? "h3"
         : t === "comment" ? "comment"
         : t === "code" ? "key"
         : "";
  }

  return (
    <div className="screen" data-screen-label="05 Result">
      <AppHeader />
      <div className="result">
        <aside className="result-aside">
          <span className="brand-mark">↳ generated</span>
          <h2>Your <em>AGENT.md</em><br/>is ready.</h2>
          <p>34 lines · 4 sections · 1.2 kb. Drop this at the root of your repo as <code style={{fontFamily:"var(--mono)", fontSize:13, background:"var(--paper-deep)", padding:"1px 6px", borderRadius:3}}>AGENT.md</code> — your AI assistant will read it before every reply.</p>

          <div className="result-actions">
            <button className="btn primary accent">Download AGENT.md <span className="arrow">↓</span></button>
            <button className="btn">Copy to clipboard <span className="arrow">⧉</span></button>
            <button className="btn ghost">Open as gist <span className="arrow">↗</span></button>
          </div>

          <div className="summary-card">
            <div className="summary-row"><span className="k">Name</span><span className="v">Preflight</span></div>
            <div className="summary-row"><span className="k">Type</span><span className="v tag">vscode_extension</span></div>
            <div className="summary-row"><span className="k">Stack</span><span className="v">TS · VS Code · AI SDK · Zod</span></div>
            <div className="summary-row"><span className="k">AI providers</span><span className="v">OpenAI · Anthropic</span></div>
            <div className="summary-row"><span className="k">Philosophy</span><span className="v">MVP first</span></div>
            <div className="summary-row"><span className="k">Constraints</span><span className="v">3 active</span></div>
          </div>

          <p className="ghost" style={{fontSize:12, color:"var(--ink-mute)", marginTop:"auto"}}>
            Nothing was sent to a server. All answers stayed in your browser. ⏎ Edit any answer to regenerate.
          </p>
        </aside>

        <main className="result-main">
          <div className="code-frame">
            <div className="code-frame-head">
              <span className="file">AGENT.md</span>
              <span className="meta">
                <span>markdown</span>
                <span>1,247 bytes</span>
                <span>UTF-8</span>
                <span style={{color:"var(--cobalt)"}}>● synced</span>
              </span>
            </div>
            <div className="code-body">
              <div className="code-gutter">
                {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <div className="code-content">
                {lines.map((l, i) => (
                  <div key={i} className={lineClass(l.t)}>{l.s || "\u00A0"}</div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================================
// Export to window for canvas
// ============================================================
Object.assign(window, {
  HeroScreen, Step01, Step02, Step03, Step04, ResultScreen,
});
