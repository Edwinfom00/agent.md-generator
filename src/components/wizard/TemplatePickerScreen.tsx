'use client'

import { cn } from '@/lib/cn'
import { TEMPLATES, type Template } from '@/lib/templates'
import type { WizardAnswers } from '@/types'
import { RiArrowRightLine } from 'react-icons/ri'

interface TemplatePickerScreenProps {
  onSelect: (answers: Partial<WizardAnswers>) => void
  onStartFresh: () => void
  onUpdate: () => void
}

export function TemplatePickerScreen({ onSelect, onStartFresh, onUpdate }: TemplatePickerScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto px-14 py-10">
      <div className="max-w-[900px] mx-auto flex flex-col gap-10">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              step 00 of 04
            </span>
            <h2
              className="text-[52px] leading-[1.02] tracking-[-0.015em]"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Start from a <em className="text-cobalt italic">template</em>?
            </h2>
            <p className="text-[15px] text-ink-2 leading-normal max-w-[480px]">
              Pick a pre-filled starting point and edit as you go — or start blank.
            </p>
          </div>
          <button
            onClick={onStartFresh}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
          >
            Start fresh
            <RiArrowRightLine className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {TEMPLATES.map(template => (
            <TemplateCard key={template.id} template={template} onSelect={onSelect} />
          ))}
        </div>

        <div className="border-t border-rule pt-8 flex items-center justify-between gap-6">
          <div>
            <p className="text-[15px] font-medium text-ink">Already have an AGENT.md?</p>
            <p className="text-[13px] text-ink-mute mt-1">
              Upload it and describe your changes — the AI will apply them without rewriting everything.
            </p>
          </div>
          <button
            onClick={onUpdate}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
          >
            Update existing
            <RiArrowRightLine className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function TemplateCard({
  template,
  onSelect,
}: {
  template: Template
  onSelect: (answers: Partial<WizardAnswers>) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.answers)}
      className={cn(
        'text-left border border-rule rounded-[6px] p-6 flex flex-col gap-3 bg-paper-soft',
        'hover:border-ink hover:bg-white hover:shadow-sm transition-all group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="text-[22px] leading-tight tracking-[-0.01em] text-ink"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          {template.name}
        </span>
        <RiArrowRightLine className="w-4 h-4 text-ink-mute group-hover:text-cobalt group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>
      <p className="text-[13px] text-ink-2 leading-[1.5]">{template.description}</p>
      <span className="font-mono text-[11px] text-ink-mute">{template.stack}</span>
    </button>
  )
}
