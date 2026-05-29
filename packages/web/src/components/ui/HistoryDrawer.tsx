'use client'

import { RiCloseLine, RiDownloadLine, RiTimeLine } from 'react-icons/ri'
import type { HistoryEntry } from '@/lib/history'

interface HistoryDrawerProps {
  entries: HistoryEntry[]
  onClose: () => void
}

function downloadEntry(content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'AGENT.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function HistoryDrawer({ entries, onClose }: HistoryDrawerProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-ink/20 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-paper border-l border-rule z-50 flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-rule shrink-0">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute flex items-center gap-2">
            <RiTimeLine className="w-3.5 h-3.5" />
            Recent generations
          </span>
          <button
            onClick={onClose}
            className="text-ink-mute hover:text-ink transition-colors"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4">
          {entries.length === 0 ? (
            <p className="text-[13px] text-ink-mute text-center mt-12">
              No past generations yet.
            </p>
          ) : (
            entries.map(entry => (
              <div
                key={entry.id}
                className="border border-rule rounded-md p-5 flex flex-col gap-3 bg-paper-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium text-ink">{entry.projectName}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute mt-0.5">
                      {formatDate(entry.timestamp)} · {entry.content.split('\n').length} lines
                    </p>
                  </div>
                  <button
                    onClick={() => downloadEntry(entry.content)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
                  >
                    <RiDownloadLine className="w-3 h-3" />
                    Download
                  </button>
                </div>
                <div className="border border-rule rounded-[3px] bg-paper overflow-hidden">
                  <pre className="font-mono text-[11px] leading-[1.6] text-ink-2 p-3 overflow-hidden max-h-[100px]">
                    {entry.content.slice(0, 350)}
                    {entry.content.length > 350 ? '…' : ''}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
