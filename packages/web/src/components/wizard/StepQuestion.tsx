'use client'

import { cn } from '@/lib/cn'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { Question, WizardAnswers } from '@/types'
import { RiCheckLine } from 'react-icons/ri'

interface StepQuestionProps {
  question: Question
  answers: WizardAnswers
  onChange: (questionId: string, value: string | string[]) => void
}

export function StepQuestion({ question, answers, onChange }: StepQuestionProps) {
  const currentValue = answers[question.id]

  function handleSelect(value: string) {
    onChange(question.id, value)
  }

  function handleMultiselect(value: string) {
    const current = (currentValue as string[]) ?? []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange(question.id, next)
  }

  function isSelected(value: string): boolean {
    if (question.type === 'multiselect') {
      return ((currentValue as string[]) ?? []).includes(value)
    }
    return currentValue === value
  }

  return (
    <div className="flex flex-col gap-4 fade-up">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
          {question.question}
          {question.required && (
            <span className="text-[var(--accent)] ml-1">*</span>
          )}
        </h2>
        {question.hint && (
          <p className="text-sm text-[var(--text-muted)]">{question.hint}</p>
        )}
      </div>

      {question.type === 'text' && (
        <Input
          value={(currentValue as string) ?? ''}
          onChange={e => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          autoFocus
        />
      )}

      {question.type === 'textarea' && (
        <Textarea
          value={(currentValue as string) ?? ''}
          onChange={e => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          rows={6}
        />
      )}

      {(question.type === 'select' || question.type === 'multiselect') && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options?.map(option => {
            const selected = isSelected(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  question.type === 'multiselect'
                    ? handleMultiselect(option.value)
                    : handleSelect(option.value)
                }
                className={cn(
                  'relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200',
                  'hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent-dim)]'
                    : 'border-[var(--border)] bg-[var(--surface)]',
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all duration-200',
                    question.type === 'multiselect' ? 'rounded' : 'rounded-full',
                    selected
                      ? 'bg-[var(--accent)] border-[var(--accent)]'
                      : 'border border-[var(--border)]',
                  )}
                >
                  {selected && <RiCheckLine className="w-2.5 h-2.5 text-white" />}
                </div>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className={cn(
                      'text-sm font-medium leading-tight',
                      selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
                    )}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-[var(--text-muted)] leading-snug">
                      {option.description}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'multiselect' && (
        <p className="text-xs text-[var(--text-muted)]">
          {((currentValue as string[]) ?? []).length} selected
        </p>
      )}
    </div>
  )
}
