import { cn } from '@/lib/cn'
import { STEP_LABELS, TOTAL_STEPS } from '@/lib/questions'
import { RiCheckLine } from 'react-icons/ri'

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 w-full max-w-lg mx-auto">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step, index) => {
        const isDone = step < currentStep
        const isActive = step === currentStep
        const isUpcoming = step > currentStep

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                  isDone && 'bg-[var(--accent)] text-white',
                  isActive && 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent-dim)]',
                  isUpcoming && 'bg-[var(--surface-3)] text-[var(--text-muted)] border border-[var(--border)]',
                )}
              >
                {isDone ? <RiCheckLine className="w-4 h-4" /> : step}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap transition-colors duration-300',
                  isActive && 'text-[var(--accent)]',
                  isDone && 'text-[var(--text-secondary)]',
                  isUpcoming && 'text-[var(--text-muted)]',
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>

            {index < TOTAL_STEPS - 1 && (
              <div
                className={cn(
                  'flex-1 h-px mx-2 mb-5 transition-all duration-500',
                  step < currentStep ? 'bg-[var(--accent)]' : 'bg-[var(--border)]',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
