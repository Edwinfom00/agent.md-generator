'use client'

import { cn } from '@/lib/cn'

interface SessionBannerProps {
  onResume: () => void
  onDiscard: () => void
}

export function SessionBanner({ onResume, onDiscard }: SessionBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        'px-6 py-3 border-b border-ink/10 bg-cobalt/5',
      )}
    >
      <p className="text-[13px] text-ink-mute font-mono">
        You have an unsaved session. Resume where you left off?
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onDiscard}
          className="text-[12px] font-mono text-ink-mute hover:text-ink transition-colors underline underline-offset-2"
        >
          Start fresh
        </button>
        <button
          onClick={onResume}
          className={cn(
            'px-4 py-1.5 rounded-[4px] text-[12px] font-mono font-medium',
            'bg-cobalt text-white hover:bg-cobalt/90 transition-colors',
          )}
        >
          Resume
        </button>
      </div>
    </div>
  )
}
