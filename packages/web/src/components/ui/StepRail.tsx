'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { STEP_LABELS, TOTAL_STEPS } from '@/lib/questions'
import { RiCheckLine } from 'react-icons/ri'

const STEP_META: Record<number, { questions: number; time: string }> = {
  1: { questions: 3, time: '≈60s' },
  2: { questions: 4, time: '≈45s' },
  3: { questions: 3, time: '≈90s' },
  4: { questions: 2, time: '≈60s' },
}

interface StepRailProps {
  current: number
}

export function StepRail({ current }: StepRailProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <nav
      className="grid border-b border-rule bg-paper-soft"
      style={{ gridTemplateColumns: `repeat(${TOTAL_STEPS}, 1fr)` }}
    >
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map(i => {
        const isDone = i < current
        const isCurrent = i === current
        const isHovered = hovered === i
        const meta = STEP_META[i + 1]

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'relative px-14 py-[22px] pb-[18px] border-r border-dashed border-rule-soft last:border-r-0',
              'transition-colors duration-200',
              isCurrent &&
                'after:absolute after:left-0 after:right-4 after:bottom-[-1px] after:h-[2px] after:bg-cobalt',
              isHovered && !isCurrent && 'bg-paper-deep/30',
            )}
          >
            {/* Step number */}
            <div
              className={cn(
                'font-mono text-[11px] uppercase tracking-[0.18em] flex items-center gap-1.5',
                isCurrent ? 'text-cobalt' : 'text-ink-mute',
                isDone && 'text-ink',
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Step title */}
            <div
              className={cn(
                'text-[28px] leading-none mt-2 transition-colors duration-200',
                isDone || isCurrent ? 'text-ink' : 'text-ink-mute',
              )}
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {STEP_LABELS[i + 1]}
            </div>

            {/* Status indicator */}
            <span
              className={cn(
                'absolute right-4 top-[22px] transition-all duration-300',
                isDone
                  ? 'opacity-100'
                  : 'opacity-0 pointer-events-none',
              )}
            >
              <span className="w-5 h-5 rounded-full bg-cobalt flex items-center justify-center">
                <RiCheckLine className="w-3 h-3 text-white animate-check-pop" />
              </span>
            </span>

            {/* In-progress indicator */}
            {isCurrent && !isDone && (
              <span className="absolute right-4 top-[24px] font-mono text-[10px] text-cobalt uppercase tracking-[0.14em] font-semibold">
                active
              </span>
            )}

            {/* Tooltip on hover: questions count + time */}
            {isHovered && meta && (
              <div
                className={cn(
                  'absolute left-14 top-full mt-1.5 z-20',
                  'bg-ink text-paper font-mono text-[10px] px-3 py-2 rounded-[4px] shadow-lg',
                  'flex items-center gap-2 whitespace-nowrap pointer-events-none animate-fade-up',
                )}
              >
                <span className="text-cobalt-soft">{meta.questions} questions</span>
                <span className="text-ink-mute">·</span>
                <span className="text-paper/70">{meta.time}</span>
                {isDone && (
                  <>
                    <span className="text-ink-mute">·</span>
                    <span className="text-emerald-400 font-semibold">Completed</span>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
