'use client'

import { QUESTIONS } from '@/lib/questions'
import type { WizardAnswers } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface StepReviewProps {
  answers: WizardAnswers
}

function getDisplayValue(questionId: string, value: string | string[]): string {
  const question = QUESTIONS.find(q => q.id === questionId)
  if (!question?.options) {
    return Array.isArray(value) ? value.join(', ') : value
  }
  if (Array.isArray(value)) {
    return value
      .map(v => question.options?.find(o => o.value === v)?.label ?? v)
      .join(', ')
  }
  return question.options.find(o => o.value === value)?.label ?? value
}

export function StepReview({ answers }: StepReviewProps) {
  const filledQuestions = QUESTIONS.filter(q => {
    const val = answers[q.id]
    if (!val) return false
    if (Array.isArray(val)) return val.length > 0
    return val.trim() !== ''
  })

  const grouped = filledQuestions.reduce<Record<string, typeof filledQuestions>>(
    (acc, q) => {
      if (!acc[q.category]) acc[q.category] = []
      acc[q.category].push(q)
      return acc
    },
    {},
  )

  return (
    <div className="flex flex-col gap-6 fade-up">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Review your answers</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Check everything looks right before generating your AGENT.md
        </p>
      </div>

      {Object.entries(grouped).map(([category, questions]) => (
        <div key={category} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {category}
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="flex flex-col gap-2">
            {questions.map(q => {
              const value = answers[q.id]
              const isMulti = Array.isArray(value)
              const isLong = typeof value === 'string' && value.length > 80

              return (
                <div
                  key={q.id}
                  className="flex flex-col gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5"
                >
                  <span className="text-xs text-[var(--text-muted)]">{q.question}</span>

                  {isMulti ? (
                    <div className="flex flex-wrap gap-1.5">
                      {(value as string[]).map(v => (
                        <Badge key={v} variant="accent">
                          {QUESTIONS.find(q2 => q2.id === q.id)?.options?.find(o => o.value === v)?.label ?? v}
                        </Badge>
                      ))}
                    </div>
                  ) : isLong ? (
                    <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap font-mono leading-relaxed bg-[var(--surface-2)] rounded-lg p-2.5 overflow-auto max-h-32">
                      {value as string}
                    </pre>
                  ) : (
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {getDisplayValue(q.id, value)}
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
