'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { WizardAnswers } from '@/types'
import { QUESTIONS } from '@/lib/questions'
import { RiDownloadLine, RiFileCopyLine, RiCheckLine, RiArrowLeftLine, RiCodeLine, RiEyeLine } from 'react-icons/ri'
import { cn } from '@/lib/cn'

interface ResultScreenProps {
  content: string
  answers: WizardAnswers
  onReset: () => void
}

function getLabel(questionId: string, value: string | string[]): string {
  const q = QUESTIONS.find(q => q.id === questionId)
  if (!q?.options) return Array.isArray(value) ? value.join(', ') : value
  if (Array.isArray(value)) {
    return value.map(v => q.options?.find(o => o.value === v)?.label ?? v).join(', ')
  }
  return q.options.find(o => o.value === value)?.label ?? value
}

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ResultScreen({ content, answers, onReset }: ResultScreenProps) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<'preview' | 'source'>('preview')
  const gutterRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  const lines = content.split('\n')
  const lineCount = lines.length
  const byteCount = new TextEncoder().encode(content).length

  useEffect(() => {
    const code = codeRef.current
    const gutter = gutterRef.current
    if (!code || !gutter) return
    const onScroll = () => { gutter.scrollTop = code.scrollTop }
    code.addEventListener('scroll', onScroll, { passive: true })
    return () => code.removeEventListener('scroll', onScroll)
  }, [])

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const name = (answers['project_name'] as string) || '—'
  const type = answers['project_type'] ? getLabel('project_type', answers['project_type']) : '—'
  const stack = answers['tech_stack'] ? getLabel('tech_stack', answers['tech_stack']) : '—'
  const aiProviders = answers['ai_providers'] ? getLabel('ai_providers', answers['ai_providers']) : '—'
  const philosophy = answers['dev_philosophy'] ? getLabel('dev_philosophy', answers['dev_philosophy']) : '—'
  const constraintCount = ((answers['constraints'] as string[]) ?? []).length

  function lineClass(line: string): string {
    if (line.startsWith('# ')) return 'text-ink font-semibold'
    if (line.startsWith('## ')) return 'text-cobalt-deep font-semibold'
    if (line.startsWith('### ')) return 'text-ink font-medium'
    if (line.startsWith('<!--')) return 'text-ink-mute'
    if (line.startsWith('```')) return 'text-signal'
    return 'text-ink-2'
  }

  return (
    <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: '380px 1fr' }}>
      <aside className="border-r border-rule bg-paper flex flex-col gap-7 p-12 overflow-y-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute flex items-center gap-2">
          <span className="text-cobalt" style={{ fontFamily: 'var(--font-instrument-serif)' }}>↳</span>
          generated
        </span>

        <h2
          className="text-[52px] leading-[0.98] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-instrument-serif)' }}
        >
          Your <em className="text-cobalt italic">AGENT.md</em><br />is ready.
        </h2>

        <p className="text-[15px] text-ink-2 leading-normal">
          {lineCount} lines · {(byteCount / 1000).toFixed(1)} kb. Drop this at the root of your repo as{' '}
          <code className="font-mono text-[13px] bg-paper-deep px-1.5 py-0.5 rounded-[3px]">AGENT.md</code>
          {' '}— your AI assistant will read it before every reply.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => download(content, 'AGENT.md')}
            className="inline-flex items-center gap-2.5 px-5.5 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full bg-cobalt border border-cobalt text-white hover:bg-cobalt-deep transition-colors"
          >
            <RiDownloadLine className="w-4 h-4" />
            Download AGENT.md
          </button>
          <button
            onClick={() => download(content, 'CLAUDE.md')}
            className="inline-flex items-center gap-2.5 px-5.5 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full bg-ink border border-ink text-paper hover:bg-ink-2 transition-colors"
          >
            <RiDownloadLine className="w-4 h-4" />
            Download CLAUDE.md
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2.5 px-5.5 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
          >
            {copied ? <RiCheckLine className="w-4 h-4" /> : <RiFileCopyLine className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy to clipboard'}
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2.5 px-5.5 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Start over
          </button>
        </div>

        <div className="border border-rule bg-paper-soft rounded-md p-5 flex flex-col gap-3">
          {[
            { k: 'Name', v: name },
            { k: 'Type', v: type, tag: true },
            { k: 'Stack', v: stack.split(', ').slice(0, 3).join(' · ') },
            { k: 'AI providers', v: aiProviders },
            { k: 'Philosophy', v: philosophy },
            { k: 'Constraints', v: `${constraintCount} active` },
          ].map(({ k, v, tag }) => (
            <div
              key={k}
              className="flex justify-between items-baseline gap-3 text-[13px] border-b border-dashed border-rule-soft pb-3 last:border-b-0 last:pb-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute shrink-0">{k}</span>
              {tag ? (
                <span className="bg-cobalt-soft text-cobalt-deep px-2 py-0.5 rounded-[3px] font-mono text-[11px]">{v}</span>
              ) : (
                <span className="font-medium text-ink text-right">{v}</span>
              )}
            </div>
          ))}
        </div>

        <p className="font-mono text-[11px] text-ink-mute leading-relaxed mt-auto">
          Nothing was sent to a server. All answers stayed in your browser.
        </p>
      </aside>

      <main className="bg-paper-soft flex flex-col gap-4 p-12 overflow-hidden">
        <div className="flex-1 bg-white border border-rule rounded-lg flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between px-5.5 py-3.5 border-b border-rule bg-paper-soft shrink-0">
            <span className="font-mono text-[12px] text-ink flex items-center gap-2.5">
              <span className="text-cobalt">▤</span>
              AGENT.md
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-paper-deep rounded-full p-1">
                <button
                  onClick={() => setView('preview')}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
                    view === 'preview'
                      ? 'bg-white text-ink shadow-sm border border-rule'
                      : 'text-ink-mute hover:text-ink',
                  )}
                >
                  <RiEyeLine className="w-3 h-3" />
                  Preview
                </button>
                <button
                  onClick={() => setView('source')}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
                    view === 'source'
                      ? 'bg-white text-ink shadow-sm border border-rule'
                      : 'text-ink-mute hover:text-ink',
                  )}
                >
                  <RiCodeLine className="w-3 h-3" />
                  Source
                </button>
              </div>

              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute flex gap-3.5">
                <span>{byteCount.toLocaleString()} bytes</span>
                <span className="text-cobalt">● synced</span>
              </div>
            </div>
          </div>

          {view === 'preview' ? (
            <div className="flex-1 overflow-auto px-10 py-8">
              <div className="max-w-[720px] mx-auto prose-agent">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1
                        className="text-[42px] leading-[1.02] tracking-[-0.02em] text-ink mb-4 mt-0"
                        style={{ fontFamily: 'var(--font-instrument-serif)', fontWeight: 400 }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt-deep font-medium mt-8 mb-3 flex items-center gap-2">
                        <span className="w-3 h-px bg-cobalt inline-block" />
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-sans text-[15px] font-semibold text-ink mt-5 mb-2 tracking-[-0.005em]">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[14px] text-ink-2 leading-[1.65] mb-3">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 space-y-1.5 pl-0 list-none">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 space-y-1.5 pl-0 list-none counter-reset-[item]">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-[14px] text-ink-2 leading-[1.65] flex gap-2.5 items-baseline">
                        <span className="text-cobalt shrink-0 mt-0.5">—</span>
                        <span>{children}</span>
                      </li>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-paper-soft border border-rule rounded-md px-4 py-3 overflow-x-auto my-4 font-mono text-[12px] leading-[1.7] text-ink-2 whitespace-pre">
                        {children}
                      </pre>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = Boolean(className?.includes('language-'))
                      if (isBlock) {
                        return <code className="font-mono text-[12px] leading-[1.7] text-ink-2">{children}</code>
                      }
                      return (
                        <code className="font-mono text-[12px] bg-paper-soft text-cobalt-deep px-1.5 py-0.5 rounded-[3px]">
                          {children}
                        </code>
                      )
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-cobalt pl-4 my-4 text-ink-mute italic">
                        {children}
                      </blockquote>
                    ),
                    hr: () => (
                      <hr className="border-none border-t border-rule my-6" />
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-ink">{children}</strong>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cobalt underline underline-offset-2 hover:text-cobalt-deep transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4 border border-rule rounded-md">
                        <table className="w-full border-collapse font-mono text-[12px]">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-paper-soft">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody>{children}</tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-rule last:border-b-0">{children}</tr>
                    ),
                    th: ({ children }) => (
                      <th className="text-left px-3 py-2 font-medium text-ink text-[11px] uppercase tracking-[0.1em] border-r border-rule last:border-r-0">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-ink-2 border-r border-rule last:border-r-0">{children}</td>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden min-h-0">
              <div
                ref={gutterRef}
                className="bg-paper-soft border-r border-rule px-3.5 py-4.5 font-mono text-[12.5px] leading-[1.7] text-ink-mute text-right select-none overflow-hidden shrink-0 w-14"
                style={{ scrollbarWidth: 'none' }}
              >
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <div
                ref={codeRef}
                className="flex-1 px-5.5 py-4.5 font-mono text-[12.5px] leading-[1.7] overflow-auto"
              >
                {lines.map((line, i) => (
                  <div key={i} className={lineClass(line)}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
