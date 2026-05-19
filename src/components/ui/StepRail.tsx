import { cn } from '@/lib/cn'
import { STEP_LABELS, TOTAL_STEPS } from '@/lib/questions'

interface StepRailProps {
  current: number
}

export function StepRail({ current }: StepRailProps) {
  return (
    <nav className="grid border-b border-rule bg-paper-soft" style={{ gridTemplateColumns: `repeat(${TOTAL_STEPS}, 1fr)` }}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map((i) => {
        const isDone = i < current
        const isCurrent = i === current
        return (
          <div
            key={i}
            className={cn(
              'relative px-14 py-[22px] pb-[18px] border-r border-dashed border-rule-soft last:border-r-0',
              isCurrent && 'after:absolute after:left-0 after:right-4 after:bottom-[-1px] after:h-[2px] after:bg-cobalt',
            )}
          >
            <div className={cn(
              'font-mono text-[11px] uppercase tracking-[0.18em]',
              isCurrent ? 'text-cobalt' : 'text-ink-mute',
              isDone && 'text-ink',
            )}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div
              className={cn(
                'text-[28px] leading-none mt-2',
                isDone || isCurrent ? 'text-ink' : 'text-ink-mute',
              )}
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {STEP_LABELS[i + 1]}
            </div>
            <span className={cn(
              'absolute right-4 top-[22px] font-mono text-[10px] text-ink-mute',
              isDone && 'text-cobalt',
            )}>
              {isDone ? '✓ done' : isCurrent ? 'in progress' : '—'}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
