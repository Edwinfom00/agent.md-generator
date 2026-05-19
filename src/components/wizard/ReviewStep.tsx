import { QUESTIONS } from '@/lib/questions'
import type { WizardAnswers } from '@/types'

interface ReviewStepProps {
  answers: WizardAnswers
}

function getDisplayValue(questionId: string, value: string | string[]): string {
  const q = QUESTIONS.find(q => q.id === questionId)
  if (!q?.options) return Array.isArray(value) ? value.join(', ') : value
  if (Array.isArray(value)) {
    return value.map(v => q.options?.find(o => o.value === v)?.label ?? v).join(', ')
  }
  return q.options.find(o => o.value === value)?.label ?? value
}

export function ReviewStep({ answers }: ReviewStepProps) {
  const filled = QUESTIONS.filter(q => {
    const v = answers[q.id]
    if (!v) return false
    if (Array.isArray(v)) return v.length > 0
    return (v as string).trim() !== ''
  })

  const grouped = filled.reduce<Record<string, typeof filled>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = []
    acc[q.category].push(q)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      <div>
        <h2
          className="text-[52px] leading-[1.02] tracking-[-0.015em]"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Review your <em className="text-cobalt italic">brief</em>
        </h2>
        <p className="text-[14px] text-ink-mute mt-1">
          Check everything looks right before generating your AGENT.md
        </p>
      </div>

      {Object.entries(grouped).map(([category, questions]) => (
        <div key={category} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
              {category}
            </span>
            <div className="flex-1 h-px bg-rule" />
          </div>

          <div className="flex flex-col gap-2">
            {questions.map(q => {
              const v = answers[q.id]
              const isMulti = Array.isArray(v)
              const isLong = typeof v === 'string' && v.length > 80

              return (
                <div key={q.id} className="rounded-[4px] border border-rule bg-paper-soft p-3.5 flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
                    {q.question}
                  </span>

                  {isMulti ? (
                    <div className="flex flex-wrap gap-1.5">
                      {(v as string[]).map(val => {
                        const label = q.options?.find(o => o.value === val)?.label ?? val
                        return (
                          <span
                            key={val}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-cobalt-soft text-cobalt-deep font-mono text-[11px]"
                          >
                            {label}
                          </span>
                        )
                      })}
                    </div>
                  ) : isLong ? (
                    <pre className="font-mono text-[12px] text-ink-2 whitespace-pre-wrap leading-relaxed bg-white rounded-[4px] p-2.5 overflow-auto max-h-32">
                      {v as string}
                    </pre>
                  ) : (
                    <span className="text-[15px] font-medium text-ink">
                      {getDisplayValue(q.id, v)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
