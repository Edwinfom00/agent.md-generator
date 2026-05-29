'use client'

import { RiArrowRightLine } from 'react-icons/ri'

interface LandingFooterCTAProps {
  onStart: () => void
}

export function LandingFooterCTA({ onStart }: LandingFooterCTAProps) {
  return (
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
          className="shrink-0 inline-flex items-center gap-3 px-8 py-4.5 bg-ink text-paper font-mono text-[13px] uppercase tracking-[0.14em] rounded-full hover:bg-ink-2 hover:gap-4 transition-all group shadow-md cursor-pointer border border-transparent"
        >
          Start now — it&apos;s free
          <RiArrowRightLine className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  )
}
