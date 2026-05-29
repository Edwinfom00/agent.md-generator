'use client'

import { useState, useEffect } from 'react'
import { RiCheckLine } from 'react-icons/ri'
import { cn } from '@/lib/cn'

const STEPS = [
  { label: 'Analyzing project identity…', delay: 0 },
  { label: 'Mapping tech stack conventions…', delay: 2200 },
  { label: 'Building architecture guidelines…', delay: 4600 },
  { label: 'Encoding constraint rules…', delay: 7200 },
  { label: 'Formatting AGENT.md output…', delay: 9800 },
]

const QUOTES = [
  '"A great AGENT.md saves more time than it takes to write."',
  '"Describe your constraints clearly, and the AI will never guess wrong."',
  '"The best coding assistant is one that knows your project before you speak."',
  '"Rules aren\'t limitations — they\'re the blueprint for consistent, quality code."',
]

export function GeneratingScreen() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [quoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const [dotsCount, setDotsCount] = useState(1)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    STEPS.forEach((step, i) => {
      if (i === 0) {
        setActiveStep(0)
        return
      }
      const t = setTimeout(() => {
        setCompletedSteps(prev => [...prev, i - 1])
        setActiveStep(i)
      }, step.delay)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCount(d => (d % 3) + 1)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 bg-paper">
      <div className="w-full max-w-[500px] flex flex-col gap-10">

        {/* Top indicator */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cobalt font-semibold flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cobalt" />
            </span>
            Our agent is generating
          </span>
          <h2
            className="text-[42px] leading-[1.02] tracking-[-0.02em] text-ink"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Building your{' '}
            <em className="text-cobalt italic">AGENT.md</em>
            {'.' + '.'.repeat(dotsCount - 1)}
          </h2>
        </div>

        {/* Progress steps */}
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i)
            const isActive = activeStep === i && !isCompleted
            const isPending = i > activeStep

            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-4 py-3.5 border-b border-rule-soft last:border-b-0',
                  'transition-all duration-500',
                )}
              >
                {/* State icon */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-400',
                    isCompleted && 'bg-cobalt',
                    isActive && 'border-2 border-cobalt',
                    isPending && 'border border-rule bg-paper-soft',
                  )}
                >
                  {isCompleted && (
                    <RiCheckLine className="w-3.5 h-3.5 text-white animate-check-pop" />
                  )}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-cobalt animate-pulse-dot" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'font-mono text-[12.5px] transition-all duration-400',
                    isCompleted && 'text-ink-mute line-through',
                    isActive && 'text-ink font-semibold',
                    isPending && 'text-ink-mute opacity-40',
                  )}
                >
                  {step.label}
                </span>

                {/* Active shimmer bar */}
                {isActive && (
                  <div className="ml-auto w-24 h-1 rounded-full overflow-hidden bg-paper-deep shrink-0">
                    <div className="h-full w-full animate-shimmer rounded-full" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Quote */}
        <p className="font-mono text-[11.5px] text-ink-mute leading-[1.7] italic border-l-2 border-cobalt/30 pl-4 animate-fade-up">
          {QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  )
}
