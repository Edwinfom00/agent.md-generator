'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { TEMPLATES, type Template } from '@/lib/templates'
import type { WizardAnswers } from '@/types'
import {
  RiArrowRightLine,
  RiRefreshLine,
  RiUploadLine,
  RiReactjsFill,
  RiServerLine,
  RiSmartphoneLine,
  RiStackLine,
  RiTerminalBoxLine,
} from 'react-icons/ri'
import type { IconType } from 'react-icons'

interface TemplatePickerScreenProps {
  onSelect: (answers: Partial<WizardAnswers>) => void
  onStartFresh: () => void
  onUpdate: () => void
}

const TEMPLATE_META: Record<string, { Icon: IconType; iconColor: string; badge?: string; accent: string; highlights: string[] }> = {
  nextjs_saas: {
    Icon: RiReactjsFill,
    iconColor: 'text-sky-500',
    badge: 'Most popular',
    accent: 'from-blue-500/8 to-indigo-500/5',
    highlights: ['TypeScript strict mode', 'Named exports only', 'Tailwind utility classes'],
  },
  api_backend: {
    Icon: RiServerLine,
    iconColor: 'text-emerald-600',
    accent: 'from-emerald-500/8 to-teal-500/5',
    highlights: ['Zod schema validation', 'Error handling required', 'No new deps without review'],
  },
  mobile_rn: {
    Icon: RiSmartphoneLine,
    iconColor: 'text-orange-500',
    accent: 'from-orange-500/8 to-amber-500/5',
    highlights: ['Expo managed workflow', 'Mobile-first UI patterns', 'MVP-first philosophy'],
  },
  fullstack_monorepo: {
    Icon: RiStackLine,
    iconColor: 'text-violet-600',
    badge: 'Advanced',
    accent: 'from-violet-500/8 to-purple-500/5',
    highlights: ['Shared TypeScript types', 'Frontend + backend in one', 'Prisma ORM'],
  },
  cli_tool: {
    Icon: RiTerminalBoxLine,
    iconColor: 'text-stone-600',
    accent: 'from-stone-500/8 to-zinc-500/5',
    highlights: ['npm publishable', 'Offline-first constraint', 'Lightweight bundle'],
  },
}

export function TemplatePickerScreen({ onSelect, onStartFresh, onUpdate }: TemplatePickerScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto px-14 py-10">
      <div className="max-w-[960px] mx-auto flex flex-col gap-10">
        {/* Header */}
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
            <RiRefreshLine className="w-4 h-4" />
            Start fresh
          </button>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {TEMPLATES.map(template => (
            <TemplateCard key={template.id} template={template} onSelect={onSelect} />
          ))}
        </div>

        {/* Update existing divider */}
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
            <RiUploadLine className="w-4 h-4" />
            Update existing
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
  const [hovered, setHovered] = useState(false)
  const meta = TEMPLATE_META[template.id]

  return (
    <button
      type="button"
      onClick={() => onSelect(template.answers)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'text-left border border-rule rounded-[8px] p-6 flex flex-col gap-3 bg-paper-soft',
        'hover:border-ink hover:bg-white hover:shadow-md transition-all group relative overflow-hidden',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt',
      )}
    >
      {/* Gradient accent background */}
      {meta?.accent && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
            meta.accent,
          )}
        />
      )}

      {/* Badge */}
      {meta?.badge && (
        <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.16em] px-2 py-1 bg-cobalt text-white rounded-full font-bold">
          {meta.badge}
        </span>
      )}

      <div className="flex items-start gap-3 relative">
        {/* Icon */}
        {meta?.Icon && (
          <div className={cn(
            'w-9 h-9 rounded-lg border border-rule bg-white flex items-center justify-center shrink-0 mt-0.5',
            'transition-all duration-200 group-hover:scale-110 group-hover:border-rule-soft shadow-sm',
          )}>
            <meta.Icon className={cn('w-5 h-5', meta.iconColor)} />
          </div>
        )}

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span
            className="text-[22px] leading-tight tracking-[-0.01em] text-ink"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            {template.name}
          </span>
          <p className="text-[13px] text-ink-2 leading-[1.5]">{template.description}</p>
          <span className="font-mono text-[11px] text-ink-mute mt-0.5">{template.stack}</span>
        </div>

        <RiArrowRightLine className="w-4 h-4 text-ink-mute group-hover:text-cobalt group-hover:translate-x-0.5 transition-all shrink-0 mt-2 relative" />
      </div>

      {/* Hover preview: highlights */}
      {meta?.highlights && (
        <div
          className={cn(
            'flex flex-col gap-1 pt-3 border-t border-rule/60 relative transition-all duration-200',
            hovered ? 'opacity-100 max-h-[100px]' : 'opacity-0 max-h-0 overflow-hidden pt-0 border-t-0',
          )}
        >
          {meta.highlights.map(h => (
            <span key={h} className="font-mono text-[11px] text-ink-mute flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-cobalt shrink-0" />
              {h}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
