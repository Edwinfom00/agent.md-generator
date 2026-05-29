'use client'

import { CopyButton } from './CopyButton'
import { DownloadButton } from './DownloadButton'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { RiRefreshLine, RiFileTextLine } from 'react-icons/ri'

interface OutputPanelProps {
  content: string
  onReset: () => void
}

export function OutputPanel({ content, onReset }: OutputPanelProps) {
  const lineCount = content.split('\n').length
  const charCount = content.length
  const wordCount = content.split(/\s+/).filter(Boolean).length

  return (
    <div className="flex flex-col gap-6 fade-up">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <RiFileTextLine className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your AGENT.md is ready</h2>
          <Badge variant="success">Generated</Badge>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Review the content below, then download or copy it to your project root.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <DownloadButton content={content} />
        <CopyButton content={content} />
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          icon={<RiRefreshLine className="w-4 h-4" />}
        >
          Start over
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="default">{lineCount} lines</Badge>
          <Badge variant="default">{wordCount} words</Badge>
          <Badge variant="default">{(charCount / 1000).toFixed(1)}k chars</Badge>
        </div>
      </div>

      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[var(--error)]/60" />
            <div className="w-3 h-3 rounded-full bg-[var(--warning)]/60" />
            <div className="w-3 h-3 rounded-full bg-[var(--success)]/60" />
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono ml-2">AGENT.md</span>
        </div>

        <pre className="code-block text-[var(--text-secondary)] p-6 overflow-auto max-h-[600px] leading-relaxed whitespace-pre-wrap">
          {content}
        </pre>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Place <code className="text-[var(--accent)] bg-[var(--accent-dim)] px-1 py-0.5 rounded text-xs">AGENT.md</code> at the root of your project.
          AI assistants like Kiro, Cursor, and Claude will automatically read it to understand your project conventions.
        </p>
      </div>
    </div>
  )
}
