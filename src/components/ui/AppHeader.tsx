'use client'

import { RiGithubLine, RiTimeLine } from 'react-icons/ri'

interface AppHeaderProps {
  onHistoryOpen?: () => void
}

export function AppHeader({ onHistoryOpen }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between px-14 py-[22px] border-b border-rule">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-cobalt rounded-[1px]" />
          agent
        </span>
        <span
          className="font-serif text-[26px] leading-none tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          <b className="not-italic font-normal">agent</b>
          <span className="text-cobalt">.</span>
          <i>md</i>
          {' '}generator
        </span>
      </div>

      <div className="flex items-center gap-[14px] font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
        <span>v1.0 · 2026</span>
        <span>
          Powered by <b className="text-ink font-medium tracking-[0.06em]">you</b>
          {' '}— built by Edwin&nbsp;Fom
        </span>
        {onHistoryOpen && (
          <button
            onClick={onHistoryOpen}
            className="inline-flex items-center gap-1.5 border border-rule bg-paper-soft px-[10px] py-[6px] rounded-full text-ink-mute hover:border-ink hover:text-ink transition-colors"
          >
            <RiTimeLine className="w-[13px] h-[13px]" />
            History
          </button>
        )}
        <a
          href="https://github.com/Edwinfom00"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-rule bg-paper-soft px-[10px] py-[6px] rounded-full text-ink hover:border-ink transition-colors"
        >
          <RiGithubLine className="w-[13px] h-[13px]" />
          edwinfom00
        </a>
      </div>
    </header>
  )
}
