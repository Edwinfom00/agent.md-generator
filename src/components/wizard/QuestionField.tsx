'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { Question, WizardAnswers } from '@/types'
import { RiCloseLine, RiLightbulbLine } from 'react-icons/ri'
import { ManifestDropZone } from './ManifestDropZone'

interface QuestionFieldProps {
  question: Question
  answers: WizardAnswers
  onChange: (id: string, value: string | string[]) => void
  index: number
}

function charQuality(len: number): { label: string; color: string } {
  if (len === 0) return { label: '', color: '' }
  if (len < 40) return { label: 'brief', color: 'text-signal' }
  if (len < 120) return { label: 'good', color: 'text-amber-600' }
  return { label: 'rich', color: 'text-emerald-600' }
}

export function QuestionField({ question, answers, onChange, index }: QuestionFieldProps) {
  const value = answers[question.id]
  const [focused, setFocused] = useState(false)
  const [coachDismissed, setCoachDismissed] = useState(false)

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

  const textLen = question.type === 'textarea' ? ((value as string) ?? '').length : 0
  const quality = charQuality(textLen)
  const multiSelected = question.type === 'multiselect' ? ((value as string[]) ?? []) : []
  const showCoach = Boolean(question.coaching) && !coachDismissed

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
          {/* Quality Coach */}
          {showCoach && (
            <div className="mt-2 flex items-start gap-2.5 bg-cobalt-soft/40 border border-cobalt/15 rounded-[6px] px-3.5 py-2.5 max-w-[680px] animate-slide-in-up">
              <RiLightbulbLine className="w-3.5 h-3.5 text-cobalt shrink-0 mt-0.5" />
              <p className="font-mono text-[11px] text-cobalt-deep leading-[1.6] flex-1">
                {question.coaching}
              </p>
              <button
                type="button"
                onClick={() => setCoachDismissed(true)}
                className="text-cobalt/40 hover:text-cobalt transition-colors shrink-0 cursor-pointer"
                aria-label="Dismiss"
              >
                <RiCloseLine className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Text input ── */}
        {question.type === 'text' && (
          <input
            type="text"
            value={(value as string) ?? ''}
            onChange={e => onChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            autoFocus={index === 1}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              'bg-paper-soft border border-rule rounded-[4px] px-[18px] py-4 font-sans text-[16px] text-ink',
              'placeholder:text-ink-mute placeholder:italic min-h-[56px]',
              'focus:outline-none focus:bg-white focus:border-ink',
              'focus:shadow-[0_0_0_4px_rgba(20,20,19,0.07),inset_0_-2px_0_#2536D6] transition-all',
              focused && 'border-ink/40',
            )}
          />
        )}

        {/* ── Textarea ── */}
        {question.type === 'textarea' && (
          <div className="flex flex-col gap-1">
            <div
              className={cn(
                'relative rounded-[4px] border transition-all',
                focused ? 'border-ink/60 shadow-[0_0_0_3px_rgba(37,54,214,0.08)]' : 'border-rule',
              )}
            >
              <textarea
                value={(value as string) ?? ''}
                onChange={e => onChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                rows={6}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-paper-soft rounded-[4px] px-[18px] py-4 font-mono text-[13px] leading-[1.6] text-ink placeholder:text-ink-mute placeholder:not-italic placeholder:font-sans placeholder:text-[14px] min-h-[140px] resize-y focus:outline-none focus:bg-white transition-all"
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute px-1">
              <span>markdown supported</span>
              <span className="flex items-center gap-2">
                {quality.label && (
                  <span className={cn('font-semibold transition-colors', quality.color)}>
                    {quality.label}
                  </span>
                )}
                <span>{textLen} / 600</span>
              </span>
            </div>
          </div>
        )}

        {/* ── Select ── */}
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
                  <span
                    className={cn(
                      'w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all',
                      checked ? 'bg-cobalt border-cobalt' : 'bg-white border-rule',
                    )}
                  >
                    {checked && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <b className="font-medium text-[15px] tracking-[-0.005em] text-ink">
                      {opt.label}
                    </b>
                    {opt.description && (
                      <span className="font-mono text-[12px] text-ink-mute">{opt.description}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'font-mono text-[10px] uppercase tracking-[0.16em]',
                      checked ? 'text-cobalt' : 'text-ink-mute',
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Multiselect ── */}
        {question.type === 'multiselect' && (
          <>
            {/* Selected badges summary */}
            {multiSelected.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3 bg-cobalt-soft/40 border border-cobalt/15 rounded-[6px] animate-fade-up">
                {multiSelected.map(v => {
                  const label = question.options?.find(o => o.value === v)?.label ?? v
                  return (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-cobalt/20 text-cobalt-deep rounded-full font-mono text-[11px] font-semibold group"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => handleMulti(v)}
                        className="text-cobalt/50 hover:text-signal transition-colors cursor-pointer"
                        aria-label={`Remove ${label}`}
                      >
                        <RiCloseLine className="w-3 h-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {question.options?.map(opt => {
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
                        ? 'bg-ink border-ink text-paper scale-[1.02]'
                        : 'bg-paper-soft border-rule text-ink hover:border-ink hover:bg-white',
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full border-[1.5px] shrink-0 transition-all',
                        checked ? 'bg-cobalt border-cobalt' : 'bg-transparent border-rule',
                      )}
                    />
                    {opt.label}
                  </button>
                )
              })}
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
              {multiSelected.length > 0
                ? `${multiSelected.length} selected`
                : 'Select all that apply'}
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
