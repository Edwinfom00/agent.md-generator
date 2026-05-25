'use client'

import { useState, useEffect } from 'react'
import { RiArrowRightLine, RiGithubLine, RiCheckLine } from 'react-icons/ri'
import { cn } from '@/lib/cn'

interface LandingHeroProps {
  onStart: () => void
}

const TOOLS = ['Claude', 'Cursor', 'Kiro', 'Copilot', 'Windsurf']

const FEATURES = [
  { num: '12', label: 'Targeted questions' },
  { num: '4 min', label: 'Average completion' },
  { num: '600+', label: 'Lines generated' },
  { num: '5', label: 'AI tools supported' },
]

export function LandingHero({ onStart }: LandingHeroProps) {
  const [toolIndex, setToolIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setToolIndex(i => (i + 1) % TOOLS.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
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
            className="inline-flex items-center gap-3 px-7.5 py-4 bg-cobalt text-white font-mono text-[12.5px] uppercase tracking-[0.14em] rounded-full hover:bg-cobalt-deep hover:gap-4 transition-all group shadow-md cursor-pointer border border-transparent"
          >
            Generate your AGENT.md
            <RiArrowRightLine className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="https://github.com/Edwinfom00/agent.md-generator"
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
  )
}
