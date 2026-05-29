'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import type { WizardAnswers } from '@/types'
import { QUESTIONS } from '@/lib/questions'

interface PreviewPaneProps {
  answers: WizardAnswers
  stage: number
}

function getLabel(questionId: string, value: string | string[]): string {
  const q = QUESTIONS.find(q => q.id === questionId)
  if (!q?.options) return Array.isArray(value) ? value.join(', ') : value
  if (Array.isArray(value)) {
    return value.map(v => q.options?.find(o => o.value === v)?.label ?? v).join(', ')
  }
  return q.options.find(o => o.value === value)?.label ?? value
}

const STEP_LABELS: Record<number, string> = {
  1: 'Identity',
  2: 'Tech Stack',
  3: 'Architecture',
  4: 'Constraints',
}

interface AnimatedBlockProps {
  visible: boolean
  children: React.ReactNode
  delay?: number
}

function AnimatedBlock({ visible, children, delay = 0 }: AnimatedBlockProps) {
  const [rendered, setRendered] = useState(false)
  const [animate, setAnimate] = useState(false)
  const prevVisibleRef = useRef(false)

  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      setRendered(true)
      const t = setTimeout(() => setAnimate(true), delay)
      return () => clearTimeout(t)
    }
    prevVisibleRef.current = visible
  }, [visible, delay])

  if (!rendered) return null

  return (
    <div
      className={cn(
        'transition-all duration-300',
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
      style={{ transitionDelay: animate ? '0ms' : `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function PreviewPane({ answers, stage }: PreviewPaneProps) {
  const name = (answers['project_name'] as string) || ''
  const type = answers['project_type'] ? getLabel('project_type', answers['project_type']) : ''
  const desc = (answers['project_description'] as string) || ''
  const stack = answers['tech_stack'] ? getLabel('tech_stack', answers['tech_stack']) : ''
  const aiProviders = answers['ai_providers'] ? getLabel('ai_providers', answers['ai_providers']) : ''
  const folder = (answers['folder_structure'] as string) || ''
  const conventions = answers['coding_conventions']
    ? getLabel('coding_conventions', answers['coding_conventions'])
    : ''
  const constraints = answers['constraints'] ? getLabel('constraints', answers['constraints']) : ''
  const philosophy = answers['dev_philosophy']
    ? getLabel('dev_philosophy', answers['dev_philosophy'])
    : ''

  const activeStepLabel = stage >= 1 && stage <= 4 ? STEP_LABELS[stage] : null

  return (
    <aside className="border-l border-rule bg-paper-soft flex flex-col gap-5 p-8 overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cobalt" />
          </span>
          Live preview
          {activeStepLabel && (
            <span className="text-cobalt font-semibold">· {activeStepLabel}</span>
          )}
        </span>
        <div className="flex gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
          <span className="px-2 py-1 border border-rule bg-white rounded-[3px]">⌘C copy</span>
          <span className="px-2 py-1 border border-rule bg-white rounded-[3px]">⌘↓ save</span>
        </div>
      </div>

      <div className="flex-1 bg-white border border-rule rounded-[6px] p-7 font-mono text-[12px] leading-[1.65] text-ink-2 overflow-hidden relative preview-fade">
        {/* Placeholder when nothing is answered yet */}
        {stage < 1 && (
          <p className="text-ink-mute">
            {'// answers will materialize here as you fill them in'}
            <span className="caret-blink" />
          </p>
        )}

        {/* Project name */}
        <AnimatedBlock visible={stage >= 1 && Boolean(name)}>
          <h1
            className="font-serif text-[34px] font-normal leading-[1.05] tracking-[-0.015em] mb-3.5"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            {name}
          </h1>
        </AnimatedBlock>

        {/* Project section */}
        <AnimatedBlock visible={stage >= 1} delay={60}>
          <p className="text-ink-mute mb-3">{'# Engineering spec for AI coding assistants'}</p>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt-deep font-medium mt-5 mb-2">
            {'// Project'}
          </h2>
          {type && (
            <p className="mb-2">
              <code className="bg-paper-soft px-1 py-0.5 rounded-[3px] text-[11px] text-cobalt-deep">
                {type}
              </code>
            </p>
          )}
          {desc && (
            <p className="mb-2 text-ink-2">
              {desc.slice(0, 120)}
              {desc.length > 120 ? '…' : ''}
            </p>
          )}
        </AnimatedBlock>

        {/* Tech stack section */}
        <AnimatedBlock visible={stage >= 2 && Boolean(stack)} delay={80}>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt-deep font-medium mt-5 mb-2">
            {'// Tech stack'}
          </h2>
          <ul className="list-disc list-inside mb-2 space-y-0.5">
            {stack.split(', ').slice(0, 5).map(s => (
              <li key={s} className="text-ink-2">
                {s}
              </li>
            ))}
          </ul>
          {aiProviders && (
            <>
              <h3 className="font-sans text-[14px] font-medium tracking-[-0.005em] mt-3.5 mb-1 text-ink">
                AI providers
              </h3>
              <p>{aiProviders}</p>
            </>
          )}
        </AnimatedBlock>

        {/* Architecture section */}
        <AnimatedBlock visible={stage >= 3 && Boolean(folder || conventions)} delay={80}>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt-deep font-medium mt-5 mb-2">
            {'// Architecture'}
          </h2>
          {folder && (
            <pre className="text-[11px] leading-[1.6] text-ink-2 whitespace-pre-wrap mb-2">
              {folder.slice(0, 200)}
            </pre>
          )}
          {conventions && (
            <ul className="list-disc list-inside space-y-0.5">
              {conventions.split(', ').slice(0, 4).map(c => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
        </AnimatedBlock>

        {/* Constraints section */}
        <AnimatedBlock visible={stage >= 4 && Boolean(constraints || philosophy)} delay={80}>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt-deep font-medium mt-5 mb-2">
            {'// Constraints'}
          </h2>
          {constraints && (
            <ul className="list-disc list-inside space-y-0.5 mb-2">
              {constraints.split(', ').slice(0, 4).map(c => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
          {philosophy && (
            <p>
              Philosophy: <b>{philosophy}</b>
            </p>
          )}
        </AnimatedBlock>
      </div>
    </aside>
  )
}
