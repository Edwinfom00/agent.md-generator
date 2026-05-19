'use client'

import { cn } from '@/lib/cn'
import type { Question, WizardAnswers } from '@/types'
import { RiCheckLine } from 'react-icons/ri'
import { ManifestDropZone } from './ManifestDropZone'

interface QuestionFieldProps {
  question: Question
  answers: WizardAnswers
  onChange: (id: string, value: string | string[]) => void
  index: number
}

export function QuestionField({ question, answers, onChange, index }: QuestionFieldProps) {
  const value = answers[question.id]

  function handleSelect(v: string) {
    onChange(question.id, v)
  }

  function handleMulti(v: string) {
    const cur = (value as string[]) ?? []
    onChange(question.id, cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v])
  }

  function isChecked(v: string) {
    if (question.type === 'multiselect') return ((value as string[]) ?? []).includes(v)
    return value === v
  }

  return (
    <div className="grid gap-6 py-6 border-t border-rule" style={{ gridTemplateColumns: '60px 1fr' }}>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute pt-1.5">
        Q.{String(index).padStart(2, '0')}
      </div>

      <div className="flex flex-col gap-3.5">
        <div>
          <div
            className="text-[30px] leading-[1.05] tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            {question.question}
            {question.required && (
              <span className="font-mono text-[14px] text-cobalt align-super ml-0.5">*</span>
            )}
          </div>
          {question.hint && (
            <p className="text-[14px] text-ink-mute leading-[1.45] mt-1 max-w-[680px]">
              {question.hint}
            </p>
          )}
        </div>

        {question.type === 'text' && (
          <input
            type="text"
            value={(value as string) ?? ''}
            onChange={e => onChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            autoFocus={index === 1}
            className="bg-paper-soft border border-rule rounded-[4px] px-[18px] py-4 font-sans text-[16px] text-ink placeholder:text-ink-mute placeholder:italic min-h-[56px] focus:outline-none focus:bg-white focus:border-ink focus:shadow-[0_0_0_4px_rgba(20,20,19,0.07),inset_0_-2px_0_#2536D6] transition-all"
          />
        )}

        {question.type === 'textarea' && (
          <div className="flex flex-col gap-1">
            <textarea
              value={(value as string) ?? ''}
              onChange={e => onChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              rows={6}
              className="bg-paper-soft border border-rule rounded-[4px] px-[18px] py-4 font-mono text-[13px] leading-[1.6] text-ink placeholder:text-ink-mute placeholder:not-italic placeholder:font-sans placeholder:text-[14px] min-h-[140px] resize-y focus:outline-none focus:bg-white focus:border-ink transition-all"
            />
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
              <span>markdown supported</span>
              <span>{((value as string) ?? '').length} / 600</span>
            </div>
          </div>
        )}

        {question.type === 'select' && (
          <div className="grid grid-cols-2 gap-2.5">
            {question.options?.map((opt, i) => {
              const checked = isChecked(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'grid gap-3.5 items-center rounded-[4px] border p-4 text-left transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt',
                    checked
                      ? 'bg-white border-ink shadow-[inset_0_-2px_0_#2536D6]'
                      : 'bg-paper-soft border-rule hover:border-ink hover:bg-white',
                  )}
                  style={{ gridTemplateColumns: '22px 1fr auto' }}
                >
                  <span className={cn(
                    'w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0',
                    checked ? 'bg-cobalt border-cobalt' : 'bg-white border-rule',
                  )}>
                    {checked && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <b className="font-medium text-[15px] tracking-[-0.005em] text-ink">{opt.label}</b>
                    {opt.description && (
                      <span className="font-mono text-[12px] text-ink-mute">{opt.description}</span>
                    )}
                  </div>
                  <span className={cn(
                    'font-mono text-[10px] uppercase tracking-[0.16em]',
                    checked ? 'text-cobalt' : 'text-ink-mute',
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {question.type === 'multiselect' && (
          <>
            <div className="flex flex-wrap gap-2">
              {question.options?.map((opt) => {
                const checked = isChecked(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleMulti(opt.value)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-sans transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt',
                      checked
                        ? 'bg-ink border-ink text-paper'
                        : 'bg-paper-soft border-rule text-ink hover:border-ink',
                    )}
                  >
                    <span className={cn(
                      'w-2 h-2 rounded-full border-[1.5px] shrink-0',
                      checked ? 'bg-cobalt border-cobalt' : 'bg-transparent border-rule',
                    )} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
              {((value as string[]) ?? []).length} selected
            </p>
            {question.id === 'tech_stack' && (
              <ManifestDropZone
                currentValues={(value as string[]) ?? []}
                onDetected={merged => onChange(question.id, merged)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
