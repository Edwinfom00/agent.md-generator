'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { WizardAnswers } from '@/types'
import { QUESTIONS } from '@/lib/questions'
import { OUTPUT_FORMATS } from '@/lib/formatOutput'
import { scoreOutput } from '@/lib/scoreOutput'
import { encodeConfig } from '@/lib/shareConfig'
import { refineChatMessage } from '@/lib/chatOutput'
import { computeLineDiff, getDiffHunks } from '@/lib/diff'
import type { DiffHunk } from '@/lib/diff'
import {
  RiDownloadLine,
  RiFileCopyLine,
  RiCheckLine,
  RiArrowLeftLine,
  RiCodeLine,
  RiEyeLine,
  RiArrowDownSLine,
  RiEditLine,
  RiShareLine,
  RiSendPlane2Line,
  RiLoaderLine,
  RiChatSmile2Line,
  RiCloseLine,
  RiSparklingLine,
  RiUser3Line,
  RiCheckDoubleLine,
  RiAlertLine,
} from 'react-icons/ri'
import { cn } from '@/lib/cn'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  error?: boolean
}

interface ResultScreenProps {
  content: string
  answers: WizardAnswers
  warnings?: string[]
  onReset: () => void
  onRegenerate?: () => void
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

export function ResultScreen({ content, answers, warnings, onReset, onRegenerate }: ResultScreenProps) {
  const [editedContent, setEditedContent] = useState(content)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [view, setView] = useState<'preview' | 'source'>('preview')
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [pendingContent, setPendingContent] = useState<string | null>(null)
  const [showFabTooltip, setShowFabTooltip] = useState(false)
  const [variantContent, setVariantContent] = useState<string | null>(null)
  const [variantLoading, setVariantLoading] = useState(false)
  const [abView, setAbView] = useState<'A' | 'B'>('A')
  
  const downloadMenuRef = useRef<HTMLDivElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  const lines = editedContent.split('\n')
  const lineCount = lines.length
  const byteCount = new TextEncoder().encode(editedContent).length
  const score = scoreOutput(editedContent)

  const hunks = pendingContent ? getDiffHunks(computeLineDiff(editedContent, pendingContent)) : []

  useEffect(() => {
    const code = codeRef.current
    const gutter = gutterRef.current
    if (!code || !gutter) return
    const onScroll = () => { gutter.scrollTop = code.scrollTop }
    code.addEventListener('scroll', onScroll, { passive: true })
    return () => code.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!showDownloadMenu) return
    function handleClick(e: MouseEvent) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showDownloadMenu])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatLoading])

  useEffect(() => {
    const show = setTimeout(() => setShowFabTooltip(true), 3000)
    const hide = setTimeout(() => setShowFabTooltip(false), 10000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  const handleChat = useCallback(async (instruction: string) => {
    if (!instruction.trim() || chatLoading || pendingContent) return
    const userMsg: ChatMessage = { role: 'user', text: instruction.trim() }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setChatLoading(true)

    const result = await refineChatMessage(editedContent, instruction.trim())
    setChatLoading(false)

    if (result.error || !result.content) {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: result.error ?? 'Something went wrong.', error: true },
      ])
    } else {
      setPendingContent(result.content)
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: '✨ I have prepared a draft update. Please review the proposed changes below and confirm them.' },
      ])
    }
  }, [editedContent, chatLoading, pendingContent])

  const handleApplyPending = useCallback(() => {
    if (!pendingContent) return
    setEditedContent(pendingContent)
    setPendingContent(null)
    setChatMessages(prev => [
      ...prev,
      { role: 'assistant', text: '✅ Proposed changes successfully applied!' }
    ])
  }, [pendingContent])

  const handleDiscardPending = useCallback(() => {
    setPendingContent(null)
    setChatMessages(prev => [
      ...prev,
      { role: 'assistant', text: '❌ Proposed changes discarded.' }
    ])
  }, [])

  function handleChatKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChat(chatInput)
    }
  }

  async function handleGenerateVariant() {
    if (variantLoading) return
    setVariantLoading(true)
    setVariantContent(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, variant: true }),
      })
      const data = await res.json() as { content?: string; error?: string }
      if (data.content) {
        setVariantContent(data.content)
        setAbView('B')
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setVariantLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(editedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    const url = `${window.location.origin}?config=${encodeConfig(answers)}`
    await navigator.clipboard.writeText(url)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {warnings && warnings.length > 0 && (
        <div className="shrink-0 border-b border-rule bg-ink/[0.025] px-8 py-3 flex items-center gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute shrink-0">
            Output warning
          </span>
          <div className="flex-1 flex flex-col gap-0.5">
            {warnings.map((w, i) => (
              <p key={i} className="text-[13px] text-ink-2">{w}</p>
            ))}
          </div>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
            >
              Regenerate
            </button>
          )}
        </div>
      )}

      <div className="flex-1 grid overflow-hidden min-h-0" style={{ gridTemplateColumns: '380px 1fr' }}>
      <aside className="border-r border-rule bg-paper flex flex-col gap-6 p-10 overflow-y-auto">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute flex items-center gap-2">
              <span className="text-cobalt" style={{ fontFamily: 'var(--font-instrument-serif)' }}>↳</span>
              generated
            </span>
            <h2
              className="text-[46px] leading-[0.98] tracking-[-0.02em] mt-2"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Your <em className="text-cobalt italic">AGENT.md</em><br />is ready.
            </h2>
            <p className="text-[13px] text-ink-2 leading-normal mt-3">
              {lineCount} lines · {(byteCount / 1000).toFixed(1)} kb
            </p>
          </div>

          {/* ── Export group (primary) ── */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-mute">Export</span>
            <div className="relative" ref={downloadMenuRef}>
              <button
                onClick={() => setShowDownloadMenu(v => !v)}
                className="inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full bg-cobalt border border-cobalt text-white hover:bg-cobalt-deep transition-colors w-full"
              >
                <RiDownloadLine className="w-4 h-4" />
                Download as...
                <RiArrowDownSLine className={cn('w-4 h-4 ml-auto transition-transform duration-150', showDownloadMenu && 'rotate-180')} />
              </button>
              {showDownloadMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-paper border border-rule rounded-md shadow-md z-10 overflow-hidden">
                  {OUTPUT_FORMATS.map(format => (
                    <button
                      key={format.filename}
                      onClick={() => {
                        download(editedContent, format.filename)
                        setShowDownloadMenu(false)
                      }}
                      className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-paper-soft transition-colors border-b border-rule last:border-b-0"
                    >
                      <span className="font-mono text-[12px] text-ink">{format.filename}</span>
                      <span className="font-mono text-[10px] text-ink-mute uppercase tracking-[0.1em]">{format.tool}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
            >
              {copied ? <RiCheckLine className="w-4 h-4 text-emerald-600" /> : <RiFileCopyLine className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>

          {/* ── More group (secondary) ── */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-mute">More</span>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
              >
                {shared ? <RiCheckLine className="w-3.5 h-3.5" /> : <RiShareLine className="w-3.5 h-3.5" />}
                {shared ? 'Copied' : 'Share link'}
              </button>
              <button
                onClick={onReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
              >
                <RiArrowLeftLine className="w-3.5 h-3.5" />
                Start over
              </button>
            </div>
          </div>

          {/* ── Coverage widget ── */}
          <div className="border border-rule bg-paper-soft rounded-md p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">Coverage</span>
              <span className={cn(
                'font-mono text-[12px] font-bold',
                score.found === score.total ? 'text-emerald-600' : score.found >= score.total * 0.7 ? 'text-amber-600' : 'text-signal',
              )}>
                {score.found}/{score.total}
              </span>
            </div>
            <div className="w-full h-1.5 bg-paper-deep rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  score.found === score.total ? 'bg-emerald-500' : score.found >= score.total * 0.7 ? 'bg-amber-500' : 'bg-cobalt',
                )}
                style={{ width: `${(score.found / score.total) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              {score.sections.map(s => (
                <span
                  key={s.label}
                  className={cn(
                    'font-mono text-[10px] px-2 py-1 rounded-[3px] flex items-center gap-1.5',
                    s.present
                      ? 'bg-cobalt/8 text-cobalt-deep'
                      : 'bg-paper-deep text-ink-mute',
                  )}
                >
                  {s.present
                    ? <RiCheckLine className="w-3 h-3 text-emerald-500 shrink-0" />
                    : <RiCloseLine className="w-3 h-3 text-ink-mute/50 shrink-0" />
                  }
                  <span className={cn(!s.present && 'line-through opacity-60')}>{s.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── Metadata grid ── */}
          <div className="border border-rule bg-paper-soft rounded-md p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { k: 'Name', v: name },
                { k: 'Type', v: type, tag: true },
                { k: 'Stack', v: stack.split(', ').slice(0, 3).join(' · ') },
                { k: 'AI', v: aiProviders },
                { k: 'Philosophy', v: philosophy },
                { k: 'Constraints', v: `${constraintCount} active` },
              ].map(({ k, v, tag }) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-mute">{k}</span>
                  {tag ? (
                    <span className="bg-cobalt-soft text-cobalt-deep px-1.5 py-0.5 rounded-[3px] font-mono text-[10px] self-start">{v || '—'}</span>
                  ) : (
                    <span className="font-medium text-ink text-[12px] truncate">{v || '—'}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── What's next tip ── */}
          <div className="border border-cobalt/20 bg-cobalt-soft/30 rounded-md p-4 flex flex-col gap-1.5 mt-auto">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cobalt-deep font-semibold">What's next?</span>
            <p className="font-mono text-[11px] text-ink-2 leading-[1.6]">
              Drop <code className="bg-white px-1 rounded text-cobalt-deep">AGENT.md</code> at your repo root — AI assistants read it automatically before writing code.
            </p>
          </div>

          <p className="font-mono text-[10px] text-ink-mute leading-relaxed">
            Nothing was sent to a server. All answers stayed in your browser.
          </p>
        </aside>


        <main className="bg-paper-soft flex flex-col gap-4 p-12 overflow-hidden relative">
          <div className="flex-1 bg-white border border-rule rounded-lg flex flex-col overflow-hidden min-h-0">
            <div className="flex items-center justify-between px-5.5 py-3.5 border-b border-rule bg-paper-soft shrink-0">
              <span className="font-mono text-[12px] text-ink flex items-center gap-2.5">
                <span className="text-cobalt">▤</span>
                AGENT.md
                {isEditing && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute bg-paper-deep px-2 py-0.5 rounded-[3px]">
                    editing
                  </span>
                )}
              </span>

              <div className="flex items-center gap-4">
                {/* A/B Compare toggle — shown when variant exists */}
                {variantContent && (
                  <div className="flex items-center gap-1 bg-paper-deep rounded-full p-1">
                    <button
                      onClick={() => setAbView('A')}
                      className={cn(
                        'px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
                        abView === 'A'
                          ? 'bg-white text-ink shadow-sm border border-rule'
                          : 'text-ink-mute hover:text-ink',
                      )}
                    >
                      A — Original
                    </button>
                    <button
                      onClick={() => setAbView('B')}
                      className={cn(
                        'px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
                        abView === 'B'
                          ? 'bg-cobalt text-white shadow-sm'
                          : 'text-ink-mute hover:text-ink',
                      )}
                    >
                      B — Variant
                    </button>
                  </div>
                )}

                {!isEditing && (
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
                )}

                <button
                  onClick={() => setIsEditing(v => !v)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
                    isEditing
                      ? 'bg-cobalt text-white'
                      : 'border border-rule text-ink-mute hover:text-ink',
                  )}
                >
                  <RiEditLine className="w-3 h-3" />
                  {isEditing ? 'Done' : 'Edit'}
                </button>

                {/* Generate variant button */}
                <button
                  onClick={handleGenerateVariant}
                  disabled={variantLoading}
                  title="Generate a creative variant (temperature 0.7)"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] transition-all border',
                    variantContent
                      ? 'border-cobalt/40 text-cobalt bg-cobalt-soft/40'
                      : 'border-rule text-ink-mute hover:text-ink hover:border-ink',
                    variantLoading && 'opacity-60 cursor-not-allowed',
                  )}
                >
                  {variantLoading
                    ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin-slow" />
                    : <RiSparklingLine className="w-3 h-3" />
                  }
                  {variantLoading ? 'Generating…' : variantContent ? 'Variant ready' : 'Generate variant'}
                </button>

                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute flex gap-3.5">
                  <span>{byteCount.toLocaleString()} bytes</span>
                  <span className="text-cobalt">● synced</span>
                </div>
              </div>
            </div>

            {(() => {
              const displayContent = abView === 'B' && variantContent ? variantContent : editedContent
              const displayLines = displayContent.split('\n')
              return isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  className="flex-1 w-full px-5.5 py-4.5 font-mono text-[12.5px] leading-[1.7] text-ink resize-none outline-none bg-white"
                  spellCheck={false}
                />
              ) : view === 'preview' ? (

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
                    {displayContent}
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
                  {displayLines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                <div
                  ref={codeRef}
                  className="flex-1 px-5.5 py-4.5 font-mono text-[12.5px] leading-[1.7] overflow-auto"
                >
                  {displayLines.map((line, i) => {
                    const isSection = line.startsWith('## ')
                    const sectionName = isSection ? line.replace(/^## /, '').trim() : ''
                    return (
                      <div
                        key={i}
                        className={cn(
                          lineClass(line),
                          isSection && 'group/section relative flex items-center gap-2 pr-2',
                        )}
                      >
                        <span className="flex-1">{line || ' '}</span>
                        {isSection && (
                          <button
                            title={`Improve "${sectionName}" section with AI`}
                            onClick={() => {
                              setChatInput(`Improve and enrich the ## ${sectionName} section with more specific, detailed content`)
                              setChatOpen(true)
                              setShowFabTooltip(false)
                            }}
                            className={cn(
                              'opacity-0 group-hover/section:opacity-100 transition-all duration-150',
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded border border-cobalt/30',
                              'bg-cobalt-soft text-cobalt-deep text-[10px] font-mono uppercase tracking-wider',
                              'hover:bg-cobalt hover:text-white hover:border-cobalt cursor-pointer shrink-0',
                            )}
                          >
                            <RiSparklingLine className="w-3 h-3" />
                            Boost
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>

          {/* ── Floating chat FAB + panel ─────────────────── */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3.5" style={{ zIndex: 20 }}>

            {/* Floating chat panel */}
            {chatOpen && (
              <div
                className="w-[360px] bg-paper/95 border border-cobalt/25 rounded-2xl shadow-[0_12px_42px_-4px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden animate-fade-up backdrop-blur-md transition-all duration-300"
                style={{ maxHeight: '520px' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4.5 py-3.5 bg-paper-deep border-b border-rule shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink font-bold">AI Co-Pilot</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-ink-mute select-none bg-paper-soft border border-rule px-1.5 py-0.5 rounded">
                      ↵ Send
                    </span>
                    <button
                      onClick={() => setChatOpen(false)}
                      className="text-ink-mute hover:text-ink hover:rotate-90 transition-transform duration-200"
                    >
                      <RiCloseLine className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick suggestion chips — shown only when no messages yet */}
                {chatMessages.length === 0 && score.sections.filter(s => !s.present).length > 0 && (
                  <div className="px-4.5 pt-3.5 pb-2.5 flex flex-wrap gap-1.5 shrink-0 border-b border-rule bg-paper/50">
                    <span className="font-mono text-[10px] text-ink-mute w-full mb-1">Add missing sections:</span>
                    {score.sections
                      .filter(s => !s.present)
                      .slice(0, 4)
                      .map(s => (
                        <button
                          key={s.label}
                          onClick={() => handleChat(`Add a ## ${s.label} section with detailed, project-specific content`)}
                          disabled={chatLoading || !!pendingContent}
                          className="inline-flex items-center gap-1 font-mono text-[10px] px-3 py-1.5 rounded-full border border-rule bg-white text-ink-mute hover:border-cobalt hover:text-cobalt hover:bg-cobalt-soft/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                        >
                          + {s.label}
                        </button>
                      ))}
                  </div>
                )}

                {/* Message history */}
                <div className="flex-1 px-4.5 py-4 flex flex-col gap-4 overflow-y-auto min-h-0 select-text">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col gap-2 p-3 rounded-xl border border-rule bg-paper-soft/40 font-mono text-[11px] text-ink-mute leading-[1.6]">
                      <div className="flex items-center gap-1.5 text-cobalt font-semibold">
                        <RiSparklingLine className="w-3.5 h-3.5" />
                        <span>Interactive Refinement</span>
                      </div>
                      Describe what you&apos;d like to add, remove, or modify. The AI will output a clean draft for your review and approval.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex gap-2.5 items-start',
                            msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                          )}
                        >
                          {/* Avatar */}
                          <div
                            className={cn(
                              'w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 shadow-sm border text-white',
                              msg.role === 'user'
                                ? 'bg-ink border-ink/10'
                                : msg.error
                                ? 'bg-signal border-signal/10'
                                : 'bg-gradient-to-tr from-cobalt to-indigo-600 border-cobalt/10',
                            )}
                          >
                            {msg.role === 'user' ? (
                              <RiUser3Line className="w-3.5 h-3.5" />
                            ) : (
                              <RiSparklingLine className="w-3.5 h-3.5" />
                            )}
                          </div>

                          {/* Bubble */}
                          <div
                            className={cn(
                              'rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm max-w-[80%]',
                              msg.role === 'user'
                                ? 'rounded-tr-none bg-cobalt text-white border border-cobalt/10'
                                : msg.error
                                ? 'rounded-tl-none bg-signal/8 text-signal border border-signal/20 font-mono text-[11.5px]'
                                : 'rounded-tl-none bg-paper-deep text-ink border border-rule/50',
                            )}
                          >
                            <p className={cn(msg.role === 'user' ? 'font-sans' : 'font-sans')}>
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {chatLoading && (
                    <div className="flex gap-2.5 items-start self-start animate-pulse">
                      <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-cobalt to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                        <RiSparklingLine className="w-3.5 h-3.5 animate-spin-slow" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-paper-deep text-ink border border-rule/50 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* 🚨 Proposed Draft Review Widget 🚨 */}
                  {pendingContent && (
                    <div className="border border-rule/70 rounded-xl bg-white overflow-hidden shadow-md flex flex-col border-l-4 border-l-emerald-500 animate-fade-in shrink-0">
                      <div className="bg-paper-deep px-3.5 py-2.5 border-b border-rule flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink font-semibold flex items-center gap-1.5">
                          <RiSparklingLine className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                          Proposed Update
                        </span>
                        <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          Review Draft
                        </span>
                      </div>
                      
                      <div className="max-h-[170px] overflow-y-auto bg-paper-soft font-mono text-[10px] leading-[1.6] p-3 divide-y divide-rule/20 select-text">
                        {hunks.length === 0 ? (
                          <div className="text-ink-mute italic py-3 text-center">
                            No major structural changes (formatting only).
                          </div>
                        ) : (
                          hunks.map((hunk, hunkIdx) => (
                            <div key={hunkIdx} className="py-2 first:pt-0 last:pb-0">
                              <div className="text-cobalt font-bold text-[9px] mb-1.5 tracking-wide bg-cobalt/5 px-2 py-0.5 rounded">
                                @@ -{hunk.oldStart},{hunk.oldLength} +{hunk.newStart},{hunk.newLength} @@
                              </div>
                              <div className="flex flex-col gap-0.5">
                                {hunk.lines.map((line, lineIdx) => (
                                  <div
                                    key={lineIdx}
                                    className={cn(
                                      "px-1.5 py-0.5 rounded-[3px] whitespace-pre-wrap flex gap-2 font-mono",
                                      line.type === 'added' && "bg-emerald-50/70 text-emerald-900 border-l-2 border-emerald-500",
                                      line.type === 'removed' && "bg-rose-50/70 text-rose-900 border-l-2 border-rose-500 line-through opacity-70",
                                      line.type === 'unchanged' && "text-ink-mute opacity-60 font-normal"
                                    )}
                                  >
                                    <span className="w-3 select-none opacity-40 shrink-0 text-right">
                                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                                    </span>
                                    <span className="break-all font-mono text-[10px]">{line.text || ' '}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="bg-paper-deep border-t border-rule p-3 flex items-center gap-2 shrink-0">
                        <button
                          onClick={handleApplyPending}
                          className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] uppercase tracking-wider font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RiCheckDoubleLine className="w-3.5 h-3.5" />
                          Apply Changes
                        </button>
                        <button
                          onClick={handleDiscardPending}
                          className="py-2.5 px-3 rounded-lg border border-rule bg-white hover:border-ink hover:bg-paper-soft text-ink-mute hover:text-ink font-mono text-[11px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Discard
                        </button>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input row or Block status */}
                {pendingContent ? (
                  <div className="shrink-0 py-3.5 px-4.5 border-t border-rule bg-paper-soft text-center font-mono text-[10px] text-cobalt flex items-center justify-center gap-1.5 select-none animate-pulse">
                    <RiAlertLine className="w-4 h-4 text-cobalt" />
                    Review and resolve proposed changes above.
                  </div>
                ) : (
                  <div className="shrink-0 flex items-end gap-2 px-3 py-3 border-t border-rule bg-paper">
                    <textarea
                      ref={chatInputRef}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={handleChatKeyDown}
                      disabled={chatLoading}
                      rows={1}
                      placeholder={chatLoading ? 'DeepSeek is thinking…' : 'Ask to add or edit sections…'}
                      className="flex-1 font-mono text-[12px] bg-transparent resize-none outline-none text-ink placeholder:text-ink-mute leading-[1.5] py-1 pl-2 disabled:opacity-50"
                      style={{ maxHeight: '80px', overflowY: 'auto' }}
                    />
                    <button
                      onClick={() => handleChat(chatInput)}
                      disabled={!chatInput.trim() || chatLoading}
                      className="shrink-0 p-2.5 rounded-full bg-cobalt text-white hover:bg-cobalt-deep transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {chatLoading ? (
                        <RiLoaderLine className="w-4 h-4 animate-spin-slow" />
                      ) : (
                        <RiSendPlane2Line className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Onboarding tooltip — shown once after 3s */}
            {showFabTooltip && !chatOpen && chatMessages.length === 0 && (
              <div className="animate-fade-up w-[220px] bg-ink text-paper rounded-xl px-4 py-3 shadow-2xl pointer-events-none">
                <p className="font-mono text-[11px] leading-[1.6] text-center">
                  <span className="text-cobalt-soft font-semibold">✨ AI Co-Pilot</span>
                  <br />
                  Ask me to add, remove, or rewrite any section of your AGENT.md
                </p>
                <div className="absolute bottom-[-6px] right-[22px] w-3 h-3 bg-ink rotate-45" />
              </div>
            )}

            {/* FAB */}
            <button
              id="result-chat-fab"
              onClick={() => { setChatOpen(v => !v); setShowFabTooltip(false) }}
              title={chatOpen ? 'Close chat' : 'Refine with AI'}
              className={cn(
                'w-13 h-13 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative group cursor-pointer border border-white/10 outline-none',
                chatOpen
                  ? 'bg-ink text-paper hover:bg-ink-2 rotate-[15deg] scale-95 shadow-lg'
                  : 'bg-cobalt text-white hover:bg-cobalt-deep hover:scale-108 hover:shadow-cobalt/35',
              )}
              style={{ width: '52px', height: '52px' }}
            >
              {chatOpen ? (
                <RiCloseLine className="w-5.5 h-5.5" />
              ) : (
                <>
                  <RiChatSmile2Line className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
                  {/* Subtle breathing outer ring */}
                  <span className="absolute inset-0 rounded-full border border-cobalt animate-ping opacity-25 group-hover:animate-none" />
                </>
              )}
              {chatMessages.length > 0 && !chatOpen && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-signal text-white text-[9.5px] font-mono rounded-full flex items-center justify-center border-2 border-paper animate-fade-in font-bold shadow-md">
                  {chatMessages.filter(m => m.role === 'assistant').length}
                </span>
              )}
            </button>
          </div>


        </main>
      </div>
    </div>
  )
}
