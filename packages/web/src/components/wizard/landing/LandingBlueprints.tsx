'use client'

import { useState } from 'react'
import { RiCheckLine } from 'react-icons/ri'
import { cn } from '@/lib/cn'

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

export function LandingBlueprints() {
  const [activeTemplate, setActiveTemplate] = useState('nextjs')

  return (
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
  )
}
