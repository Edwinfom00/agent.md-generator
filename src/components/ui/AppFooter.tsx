'use client'

import { cn } from '@/lib/cn'
import { RiArrowLeftLine, RiArrowRightLine, RiSparklingLine } from 'react-icons/ri'

interface AppFooterProps {
  step: number
  total: number
  primaryLabel?: string
  isGenerate?: boolean
  loading?: boolean
  canContinue?: boolean
  onBack?: () => void
  onContinue?: () => void
}

export function AppFooter({
  step,
  total,
  primaryLabel = 'Continue',
  isGenerate = false,
  loading = false,
  canContinue = true,
  onBack,
  onContinue,
}: AppFooterProps) {
  return (
    <footer className="flex items-center justify-between px-14 py-[18px] border-t border-ink bg-paper">
      <div className="flex items-center gap-[14px]">
        <button
          onClick={onBack}
          disabled={step === 0}
          className="inline-flex items-center gap-2.5 px-[22px] py-[14px] font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RiArrowLeftLine className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
        step <b className="text-ink font-medium">{String(step + 1).padStart(2, '0')}</b> of{' '}
        {String(total).padStart(2, '0')} ·{' '}
        <b className="text-ink font-medium">autosaved</b> in browser
      </div>

      <div className="flex items-center gap-[14px]">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute hidden sm:block">
          ⌘ + ↵ to continue
        </span>
        <button
          onClick={onContinue}
          disabled={!canContinue || loading}
          className={cn(
            'inline-flex items-center gap-2.5 px-[22px] py-[14px] font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
            isGenerate
              ? 'bg-cobalt border-cobalt text-white hover:bg-cobalt-deep'
              : 'bg-ink border-ink text-paper hover:bg-ink-2',
          )}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-slow" />
          ) : isGenerate ? (
            <RiSparklingLine className="w-4 h-4" />
          ) : null}
          {primaryLabel}
          {!loading && !isGenerate && <RiArrowRightLine className="w-4 h-4" />}
        </button>
      </div>
    </footer>
  )
}
