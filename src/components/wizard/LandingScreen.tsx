'use client'

import { useState, useEffect } from 'react'
import {
  RiArrowRightLine,
  RiGithubLine,
  RiCheckLine,
  RiCloseLine,
  RiCodeSSlashLine,
  RiNodeTree,
  RiShieldKeyholeLine,
  RiTerminalBoxLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFileSettingsLine,
} from 'react-icons/ri'
import { cn } from '@/lib/cn'

interface LandingScreenProps {
  onStart: () => void
}

const TOOLS = ['Claude', 'Cursor', 'Kiro', 'Copilot', 'Windsurf']

const FEATURES = [
  { num: '12', label: 'Targeted questions' },
  { num: '4 min', label: 'Average completion' },
  { num: '600+', label: 'Lines generated' },
  { num: '5', label: 'AI tools supported' },
]

const CAPABILITIES = [
  {
    icon: RiShieldKeyholeLine,
    title: 'Hard Guard Constraints',
    desc: 'Specify strict boundaries: forbid structural code changes, external libraries, or config alterations without consent.',
  },
  {
    icon: RiCodeSSlashLine,
    title: 'Stack-Aware Conventions',
    desc: 'Align your assistant on named exports, strict type safety, tailwind patterns, and testing guidelines.',
  },
  {
    icon: RiNodeTree,
    title: 'Workspace Architecture',
    desc: 'Provide a clean folder roadmap and component trees so the LLM understands exactly where to write new files.',
  },
  {
    icon: RiTerminalBoxLine,
    title: 'Workflow & Commands',
    desc: 'Embed correct script targets (e.g. build, lint, database migrations) to prevent runtime syntax hallucinations.',
  },
]

const TEMPLATE_PREVIEWS: Record<
  string,
  { title: string; desc: string; rules: string[]; file: string }
> = {
  nextjs: {
    title: 'Next.js App Template',
    desc: 'Optimized for modern React server components, named exports, strict TypeScript, and Tailwind utility patterns.',
    file: 'nextjs-blueprint.md',
    rules: [
      'Always utilize Named Exports. Never export default.',
      'Prefer Tailwind CSS utility classes; avoid raw inline styles.',
      'Import absolute assets using the path alias prefix @/.',
    ],
  },
  python: {
    title: 'Python CLI Template',
    desc: 'Engineered for console applications, microservices, PEP-8 compliance, and rich terminal feedback.',
    file: 'cli-assistant.md',
    rules: [
      'Use Typer for CLI arguments and rich for console logging.',
      'Enforce PEP 8 conventions (snake_case for functions).',
      'Explicitly prohibit installing external pip packages.',
    ],
  },
  rust: {
    title: 'Rust Backend Template',
    desc: 'Formulated for high-performance servers, Tokio async engines, and exhaustive error compilation checks.',
    file: 'rust-guard.md',
    rules: [
      'Utilize Axum for routing and Tokio for asynchronous tasks.',
      'Exhaustive error handling is mandatory. Never call unwrap().',
      'Use tracing macros for audit logging across thread bounds.',
    ],
  },
}

const FAQs = [
  {
    q: 'Why do I need AGENT.md when I already have custom GPT instructions?',
    a: 'Custom instructions are bound to a specific user profile or browser session. AGENT.md stays inside your repository at the root folder: any developer, Cursor editor, Claude Code terminal, or Copilot extension opening the workspace instantly inherits the identical specifications.',
  },
  {
    q: 'Does this app store or upload my project details?',
    a: 'Absolutely not. This is a fully client-side application. All answers stay in your local browser cache, and configuration keys are coded into pure client-side URLs. Zero project metrics are shipped to external servers or databases.',
  },
  {
    q: 'How does the AI assistant discover and read the AGENT.md file?',
    a: 'Modern AI tools crawl, parse, and index codebase files. By adding an AGENT.md (or pointing your Claude Code/Cursor profiles directly to it), the LLM reads and respects the constraints as foundational context before writing code.',
  },
  {
    q: 'What makes a high-quality AGENT.md file?',
    a: 'A great prompt profile focuses on constraints over capabilities. It shouldn’t teach generic language syntax; instead, it specifies your concrete standards: architecture boundaries, naming syntax, and script workflows.',
  },
]

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [toolIndex, setToolIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Prompt Simulator States
  const [simTs, setSimTs] = useState(true)
  const [simNamed, setSimNamed] = useState(true)
  const [simTailwind, setSimTailwind] = useState(true)

  // Template Slider States
  const [activeTemplate, setActiveTemplate] = useState('nextjs')

  // FAQ states
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setToolIndex(i => (i + 1) % TOOLS.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  // Build the live simulated code output based on toggles
  function getSimulatedCode() {
    const headerComment = `// Reacting to prompt rules: TS=${simTs ? 'ON' : 'OFF'}, NAMED=${simNamed ? 'ON' : 'OFF'}, TW=${simTailwind ? 'ON' : 'OFF'}`

    let buttonInterface = ''
    if (simTs) {
      buttonInterface = `interface ButtonProps {
  onClick: () => void;
  className?: string;
}\n\n`
    }

    let signature = ''
    if (simNamed) {
      signature = `export function Button({ onClick, className }${simTs ? ': ButtonProps' : ''}) {`
    } else {
      signature = `export default function Button({ onClick, className }${simTs ? ': ButtonProps' : ''}) {`
    }

    let returnStmt = ''
    if (simTailwind) {
      returnStmt = `  return (
    <button
      onClick={onClick}
      className={cn('px-4 py-2 bg-cobalt text-white rounded-full hover:bg-cobalt-deep transition-all', className)}
    >
      Action
    </button>
  )`
    } else {
      returnStmt = `  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      Action
    </button>
  )`
    }

    const end = '}'

    return `${headerComment}\n\n${buttonInterface}${signature}\n${returnStmt}\n${end}`
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section className="px-14 pt-16 pb-12 max-w-[1100px] mx-auto">
        <div
          className={cn(
            'flex flex-col gap-7 transition-all duration-700',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute border border-rule bg-paper-soft px-3 py-1.5 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cobalt"></span>
              </span>
              For{' '}
              <span
                className="text-ink font-semibold inline-block min-w-[56px] transition-all duration-300"
                key={toolIndex}
              >
                {TOOLS[toolIndex]}
              </span>
              users
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-4 max-w-[840px]">
            <h1
              className="text-[72px] leading-[0.96] tracking-[-0.025em] text-ink"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Brief your AI.<br />
              Get <em className="text-cobalt italic">precision</em> output.
            </h1>
            <p className="text-[18px] text-ink-2 leading-[1.6] max-w-[560px] pt-1">
              Twelve questions. Four minutes. A production-grade{' '}
              <code className="font-mono text-[15.5px] bg-paper-deep px-1.5 py-0.5 rounded-[4px] text-cobalt-deep font-semibold">AGENT.md</code>{' '}
              your AI assistants read before generating code. Ensure they match{' '}
              <span className="italic font-medium">your</span> conventions, not their assumptions.
            </p>
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-4 pt-2">
            <button
              id="landing-start-btn"
              onClick={onStart}
              className="inline-flex items-center gap-3 px-7.5 py-4 bg-cobalt text-white font-mono text-[12.5px] uppercase tracking-[0.14em] rounded-full hover:bg-cobalt-deep hover:gap-4 transition-all group shadow-md cursor-pointer"
            >
              Generate your AGENT.md
              <RiArrowRightLine className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="https://github.com/Edwinfom00/agent-md-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-4 font-mono text-[12.5px] uppercase tracking-[0.14em] text-ink-mute border border-rule rounded-full hover:border-ink hover:text-ink transition-colors cursor-pointer"
            >
              <RiGithubLine className="w-4.5 h-4.5" />
              View source
            </a>
          </div>

          {/* Feature pills */}
          <div className="flex items-center flex-wrap gap-x-6 gap-y-3 pt-3 border-t border-rule/50">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-baseline gap-2">
                <span
                  className="text-[28px] leading-none tracking-[-0.02em] text-ink"
                  style={{ fontFamily: 'var(--font-instrument-serif)' }}
                >
                  {f.num}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">{f.label}</span>
              </div>
            ))}
            <span className="text-ink-mute font-mono text-[11px] hidden sm:inline">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute flex items-center gap-1.5">
              <RiCheckLine className="w-3.5 h-3.5 text-cobalt" />
              No account required
            </span>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE SIMULATOR (PROMPT SANDBOX) ────────────────── */}
      <section className="px-14 py-12 border-t border-rule/50 bg-paper-soft/30">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1 max-w-[620px]">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt font-semibold">
              Live Interactive Sandbox
            </span>
            <h2
              className="text-[38px] leading-tight tracking-[-0.015em] text-ink"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              See prompt guidelines <em className="text-cobalt italic">change</em> code in real-time
            </h2>
            <p className="font-mono text-[12px] text-ink-mute leading-relaxed mt-1">
              Toggle the rules in the left panel to watch how the AI adjusts its code structure dynamically based on the specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[310px]">
            {/* Rule Toggles (4 cols) */}
            <div className="md:col-span-4 border border-rule rounded-xl bg-white p-6.5 flex flex-col gap-4.5 shadow-sm justify-center">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink font-semibold flex items-center gap-1.5 pb-1 border-b border-rule">
                <RiFileSettingsLine className="w-4 h-4 text-cobalt" />
                Prompt Specifications
              </span>

              {/* TS Toggle */}
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-sans font-semibold text-ink">TypeScript Safety</span>
                  <span className="font-mono text-[10px] text-ink-mute">Strict interface mapping</span>
                </div>
                <button
                  onClick={() => setSimTs(v => !v)}
                  className={cn(
                    'w-11 h-6.5 rounded-full transition-colors relative cursor-pointer outline-none border border-rule-soft',
                    simTs ? 'bg-cobalt' : 'bg-paper-deep',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform shadow-sm',
                      simTs && 'translate-x-4.5',
                    )}
                  />
                </button>
              </div>

              {/* Named Toggle */}
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-sans font-semibold text-ink">Named Exports Only</span>
                  <span className="font-mono text-[10px] text-ink-mute">Ban default export exports</span>
                </div>
                <button
                  onClick={() => setSimNamed(v => !v)}
                  className={cn(
                    'w-11 h-6.5 rounded-full transition-colors relative cursor-pointer outline-none border border-rule-soft',
                    simNamed ? 'bg-cobalt' : 'bg-paper-deep',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform shadow-sm',
                      simNamed && 'translate-x-4.5',
                    )}
                  />
                </button>
              </div>

              {/* Tailwind Toggle */}
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-sans font-semibold text-ink">Tailwind Utility Classes</span>
                  <span className="font-mono text-[10px] text-ink-mute">Restrict raw inline style objects</span>
                </div>
                <button
                  onClick={() => setSimTailwind(v => !v)}
                  className={cn(
                    'w-11 h-6.5 rounded-full transition-colors relative cursor-pointer outline-none border border-rule-soft',
                    simTailwind ? 'bg-cobalt' : 'bg-paper-deep',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform shadow-sm',
                      simTailwind && 'translate-x-4.5',
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Code Output Visualizer (8 cols) */}
            <div className="md:col-span-8 border border-cobalt/25 rounded-xl bg-white shadow-md flex flex-col overflow-hidden">
              <div className="bg-paper-deep px-5 py-3 border-b border-rule flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="font-mono text-[11px] text-ink-mute ml-2">SimulatedAssistant.tsx</span>
                </div>
                <span className="font-mono text-[9px] bg-cobalt-soft text-cobalt-deep px-2 py-0.5 rounded uppercase tracking-wider font-semibold animate-pulse">
                  Conforming to AGENT.md
                </span>
              </div>
              <div className="p-5 flex-1 bg-white overflow-auto font-mono text-[11px] leading-[1.65] text-ink-2 select-text">
                <pre className="whitespace-pre">{getSimulatedCode()}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEFORE / AFTER ──────────────────────────────────────── */}
      <section className="px-14 py-12 transition-all duration-700">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
            The difference it makes
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BEFORE */}
            <div className="flex flex-col gap-0 rounded-[8px] overflow-hidden border border-rule shadow-sm bg-white">
              <div className="flex items-center justify-between px-5 py-3 bg-paper-deep border-b border-rule select-none">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-signal/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-ink-mute/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-ink-mute/20" />
                  </div>
                  <span className="font-mono text-[11px] text-ink-mute">Button.tsx</span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-signal/80 bg-signal/8 px-2.5 py-1 rounded-full">
                  <RiCloseLine className="w-3 h-3" />
                  Without AGENT.md
                </span>
              </div>
              <div className="px-5 py-5 flex flex-col font-mono text-[11px] leading-[1.75] text-ink-2 whitespace-pre select-text">
                <div className="text-ink-mute">// AI has zero context about your project</div>
                <div className="text-ink-mute">// It guesses conventions — and guesses wrong</div>
                <div className="text-transparent select-none">&nbsp;</div>
                <div><span className="text-cobalt">export default function</span> Button({'{'} onClick {'}'}) {'{'}</div>
                <div className="text-ink-mute">  // default export → wrong for this project</div>
                <div className="text-ink-mute">  // no TypeScript → strict mode violation</div>
                <div>  return &lt;<span className="text-cobalt">button</span> onClick={'{'}onClick{'}'}&gt;Click&lt;/<span className="text-cobalt">button</span>&gt;</div>
                <div>{'}'}</div>
                <div className="text-transparent select-none">&nbsp;</div>
                <div className="text-ink-mute">// Installed lodash without asking</div>
                <div className="text-ink-mute">// Added inline styles instead of Tailwind</div>
              </div>
            </div>

            {/* AFTER */}
            <div className="flex flex-col gap-0 rounded-[8px] overflow-hidden border border-cobalt/35 shadow-md bg-white">
              <div className="flex items-center justify-between px-5 py-3 bg-cobalt-soft border-b border-cobalt/20 select-none">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cobalt/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-cobalt/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-cobalt/20" />
                  </div>
                  <span className="font-mono text-[11px] text-cobalt-deep font-semibold">Button.tsx</span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cobalt-deep bg-cobalt/10 px-2.5 py-1 rounded-full font-bold">
                  <RiCheckLine className="w-3.5 h-3.5" />
                  With AGENT.md
                </span>
              </div>
              <div className="px-5 py-5 flex flex-col font-mono text-[11px] leading-[1.75] text-ink-2 whitespace-pre select-text">
                <div className="text-ink-mute">// AI read your AGENT.md before writing a line</div>
                <div className="text-ink-mute">// Named export · TypeScript · cn() · your patterns</div>
                <div className="text-transparent select-none">&nbsp;</div>
                <div><span className="text-cobalt-deep">import</span> {'{'} cn {'}'} <span className="text-cobalt-deep">from</span> <span className="text-ink">&apos;@/lib/cn&apos;</span></div>
                <div className="text-transparent select-none">&nbsp;</div>
                <div><span className="text-cobalt">interface</span> ButtonProps {'{'}</div>
                <div>  onClick: () =&gt; <span className="text-cobalt">void</span>;</div>
                <div>  className?: <span className="text-cobalt">string</span>;</div>
                <div>{'}'}</div>
                <div className="text-transparent select-none">&nbsp;</div>
                <div><span className="text-cobalt">export function</span> Button({'{'} onClick, className {'}'}: ButtonProps) {'{'}</div>
                <div>  return (</div>
                <div>    &lt;<span className="text-cobalt">button</span></div>
                <div>      onClick={'{'}onClick{'}'}</div>
                <div>      className={'{'}cn(<span className="text-ink">&apos;btn-base&apos;</span>, className){'}'}</div>
                <div>    /&gt;</div>
                <div>  )</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES CORE GRID (CAPABILITIES) ────────────────────── */}
      <section className="px-14 py-12 border-t border-rule/50 bg-paper-soft/20">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-1 max-w-[620px]">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt font-semibold">
              Engineered for developer workflows
            </span>
            <h2
              className="text-[38px] leading-tight tracking-[-0.015em] text-ink"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Align every <em className="text-cobalt italic">coding convention</em> under one specification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {CAPABILITIES.map((cap, i) => {
              const IconComp = cap.icon
              return (
                <div
                  key={i}
                  className="flex gap-4 p-6 border border-rule rounded-xl bg-white hover:border-cobalt/40 transition-all hover:scale-101 shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-full bg-cobalt-soft flex items-center justify-center shrink-0 group-hover:bg-cobalt group-hover:text-white transition-colors">
                    <IconComp className="w-5 h-5 text-cobalt-deep group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-sans text-[15px] font-bold text-ink">{cap.title}</h3>
                    <p className="font-mono text-[11.5px] text-ink-mute leading-[1.6]">{cap.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TEMPLATE PREVIEW SLIDER ──────────────────────────────── */}
      <section className="px-14 py-12 border-t border-rule/50">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-[580px]">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt font-semibold">
                Modular Blueprints
              </span>
              <h2
                className="text-[38px] leading-tight tracking-[-0.015em] text-ink"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                Inspect preset <em className="text-cobalt italic">archetypes</em>
              </h2>
            </div>
            
            {/* Slider Tabs */}
            <div className="flex items-center gap-1 bg-paper-deep rounded-full p-1 self-start select-none border border-rule">
              {Object.keys(TEMPLATE_PREVIEWS).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveTemplate(key)}
                  className={cn(
                    'px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] transition-all cursor-pointer border border-transparent',
                    activeTemplate === key
                      ? 'bg-white text-ink shadow-sm border-rule'
                      : 'text-ink-mute hover:text-ink',
                  )}
                >
                  {key === 'nextjs' ? 'React / Next.js' : key === 'python' ? 'Python CLI' : 'Rust Backend'}
                </button>
              ))}
            </div>
          </div>

          {/* Active Archetype Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 border border-rule rounded-xl bg-white shadow-sm overflow-hidden p-6">
            <div className="md:col-span-5 flex flex-col gap-3 justify-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cobalt font-bold">
                {TEMPLATE_PREVIEWS[activeTemplate].file}
              </span>
              <h3
                className="text-[28px] leading-none text-ink"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {TEMPLATE_PREVIEWS[activeTemplate].title}
              </h3>
              <p className="font-mono text-[12px] text-ink-mute leading-[1.65]">
                {TEMPLATE_PREVIEWS[activeTemplate].desc}
              </p>
            </div>

            <div className="md:col-span-7 bg-paper-soft border border-rule/60 rounded-lg p-5 flex flex-col gap-3 font-mono text-[11px] select-text">
              <span className="font-mono text-[10px] uppercase text-ink-mute tracking-wider border-b border-rule pb-2 flex items-center gap-1.5 select-none font-bold">
                <RiCheckLine className="w-4 h-4 text-emerald-500" />
                Configured Core Guidelines:
              </span>
              {TEMPLATE_PREVIEWS[activeTemplate].rules.map((rule, idx) => (
                <div key={idx} className="flex gap-2.5 items-baseline leading-[1.6]">
                  <span className="text-cobalt shrink-0 select-none">—</span>
                  <span className="text-ink-2 font-medium">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="px-14 py-12 border-t border-rule/50 bg-paper-soft/10">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Identity', desc: 'Specify project parameters, stack versions, and target deliverables.' },
            { step: '02', title: 'Tech Stack', desc: 'State languages, frameworks, UI styles, and AI provider selections.' },
            { step: '03', title: 'Architecture', desc: 'Outline the visual directory scheme and coding guidelines.' },
            { step: '04', title: 'Constraints', desc: 'Deploy hard boundaries, prohibited procedures, and workflows.' },
          ].map((s, i) => (
            <div key={s.step} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-cobalt font-bold">{s.step}</span>
                <span className="flex-1 h-px bg-rule" />
              </div>
              <span
                className="text-[22px] leading-tight tracking-[-0.01em] text-ink"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {s.title}
              </span>
              <p className="font-mono text-[11.5px] text-ink-mute leading-[1.6]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SLEEK FAQ SECTION ───────────────────────────────────── */}
      <section className="px-14 py-12 border-t border-rule/50">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Header left */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt font-semibold">
              FAQ
            </span>
            <h2
              className="text-[42px] leading-[1.02] tracking-[-0.015em] text-ink"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Common<br />
              <em className="text-cobalt italic">Questions</em>
            </h2>
            <p className="font-mono text-[12px] text-ink-mute leading-[1.6] mt-1">
              Have doubts about how AGENT.md works under the hood? Here are our straightforward replies.
            </p>
          </div>

          {/* Accordion right */}
          <div className="md:col-span-8 flex flex-col divide-y divide-rule border-b border-rule">
            {FAQs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div key={idx} className="py-4.5">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                  >
                    <span className="font-sans text-[15px] font-bold text-ink group-hover:text-cobalt transition-colors leading-snug">
                      {faq.q}
                    </span>
                    <span className="text-ink-mute shrink-0 transition-transform duration-200">
                      {isOpen ? (
                        <RiArrowUpSLine className="w-5 h-5 text-cobalt" />
                      ) : (
                        <RiArrowDownSLine className="w-5 h-5 group-hover:text-ink" />
                      )}
                    </span>
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out font-mono text-[12px] text-ink-2 leading-[1.65]',
                      isOpen ? 'max-h-[160px] mt-3 opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <p className="bg-paper-soft/40 border border-rule/30 rounded-lg p-3 text-ink-mute select-text">
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ──────────────────────────────────────────── */}
      <section className="px-14 py-14 border-t border-rule/50 bg-paper-soft/20">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h2
              className="text-[42px] leading-[1.02] tracking-[-0.015em] text-ink"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Ready to brief your <em className="text-cobalt italic">AI assistant</em>?
            </h2>
            <p className="font-mono text-[11px] text-ink-mute uppercase tracking-[0.14em] font-bold">
              Free · No account · Purely Client-Side
            </p>
          </div>
          <button
            onClick={onStart}
            className="shrink-0 inline-flex items-center gap-3 px-8 py-4.5 bg-ink text-paper font-mono text-[13px] uppercase tracking-[0.14em] rounded-full hover:bg-ink-2 hover:gap-4 transition-all group shadow-md cursor-pointer"
          >
            Start now — it&apos;s free
            <RiArrowRightLine className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </div>
  )
}
