'use client'

import { useEffect, useState } from 'react'
import { RiGithubLine, RiTimeLine } from 'react-icons/ri'
import { loadHistory } from '@/lib/history'
import { cn } from '@/lib/cn'

interface AppHeaderProps {
  onHistoryOpen?: () => void
  historyCount?: number
}

export function AppHeader({ onHistoryOpen, historyCount }: AppHeaderProps) {
  const [count, setCount] = useState(historyCount ?? 0)

  useEffect(() => {
    if (historyCount !== undefined) {
      setCount(historyCount)
      return
    }
    try {
      setCount(loadHistory().length)
    } catch {
      setCount(0)
    }
  }, [historyCount])

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
            className="relative inline-flex items-center gap-1.5 border border-rule bg-paper-soft px-[10px] py-[6px] rounded-full text-ink-mute hover:border-ink hover:text-ink transition-colors"
          >
            <RiTimeLine className="w-[13px] h-[13px]" />
            History
            {count > 0 && (
              <span
                className={cn(
                  'absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1',
                  'bg-cobalt text-white text-[9px] font-mono font-bold rounded-full',
                  'flex items-center justify-center border-2 border-paper',
                  'animate-check-pop',
                )}
              >
                {count}
              </span>
            )}
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
