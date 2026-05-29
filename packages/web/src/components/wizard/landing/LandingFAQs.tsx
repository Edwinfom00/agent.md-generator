'use client'

import { useState } from 'react'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { cn } from '@/lib/cn'

const FAQs = [
  {
    q: 'Why do I need AGENT.md when I already have custom GPT instructions?',
    a: 'Custom instructions are bound to a specific user profile or browser session. AGENT.md stays inside your repository at the root folder: any developer, Cursor editor, Claude Code terminal, or Copilot extension opening the workspace instantly inherits the identical specifications.',
  },
  {
    q: 'Does this app store or upload my project details?',
    a: 'Absolutely not. This is a fully client-side application. All answers stay in your local local browser cache, and configuration keys are coded into pure client-side URLs. Zero project metrics are shipped to external servers or databases.',
  },
  {
    q: 'How does the AI assistant discover and read the AGENT.md file?',
    a: 'Modern AI tools crawl, parse, and index codebase files automatically. By adding an AGENT.md (or pointing your Claude Code/Cursor profiles directly to it), the LLM reads and respects the constraints as foundational context before writing code.',
  },
  {
    q: 'What makes a high-quality AGENT.md file?',
    a: 'A great prompt profile focuses on constraints over capabilities. It shouldn’t teach generic language syntax; instead, it specifies your concrete standards: architecture boundaries, naming syntax, and script workflows.',
  },
]

export function LandingFAQs() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  return (
    <section className="px-14 py-12 border-t border-rule/50">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Header left */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt font-semibold">
            FAQ
          </span>
          <h2
            className="text-[42px] leading-[1.02] tracking-[-0.015em] text-ink"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Common<br />
            <em className="text-cobalt italic">Questions</em>
          </h2>
          <p className="font-mono text-[12px] text-ink-mute leading-[1.6] mt-1">
            Have doubts about how AGENT.md works under the hood? Here are our straightforward replies.
          </p>
        </div>

        {/* Accordion right */}
        <div className="md:col-span-8 flex flex-col divide-y divide-rule border-b border-rule">
          {FAQs.map((faq, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div key={idx} className="py-4.5">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none border-none bg-transparent"
                >
                  <span className="font-sans text-[15px] font-bold text-ink group-hover:text-cobalt transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <span className="text-ink-mute shrink-0 transition-transform duration-200">
                    {isOpen ? (
                      <RiArrowUpSLine className="w-5 h-5 text-cobalt" />
                    ) : (
                      <RiArrowDownSLine className="w-5 h-5 group-hover:text-ink" />
                    )}
                  </span>
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out font-mono text-[12px] text-ink-2 leading-[1.65]',
                    isOpen ? 'max-h-[160px] mt-3 opacity-100' : 'max-h-0 opacity-0',
                  )}
                >
                  <p className="bg-paper-soft/40 border border-rule/30 rounded-lg p-3 text-ink-mute select-text">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
