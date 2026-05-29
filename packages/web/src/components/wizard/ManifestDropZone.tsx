'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { parseManifest } from '@/lib/parseManifest'
import { RiUploadCloud2Line, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri'

interface ManifestDropZoneProps {
  currentValues: string[]
  onDetected: (merged: string[]) => void
}

export function ManifestDropZone({ currentValues, onDetected }: ManifestDropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const [detected, setDetected] = useState<string[]>([])
  const [noMatch, setNoMatch] = useState(false)

  function processFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      const found = parseManifest(file.name, text)
      setDetected(found)
      setNoMatch(found.length === 0)
      if (found.length > 0) {
        onDetected(Array.from(new Set([...currentValues, ...found])))
      }
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'relative border border-dashed rounded-[4px] px-5 py-4 flex items-center gap-4 transition-all',
        dragging ? 'border-cobalt bg-cobalt/5' : 'border-rule hover:border-ink-mute',
      )}
    >
      <input
        type="file"
        accept=".json,.txt"
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />

      {detected.length > 0 ? (
        <RiCheckLine className="w-5 h-5 text-cobalt shrink-0" />
      ) : noMatch ? (
        <RiErrorWarningLine className="w-5 h-5 text-ink-mute shrink-0" />
      ) : (
        <RiUploadCloud2Line className="w-5 h-5 text-ink-mute shrink-0" />
      )}

      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] text-ink font-medium">
          Drop{' '}
          <code className="font-mono text-[12px] bg-paper-deep px-1 py-0.5 rounded-[2px]">package.json</code>
          {' '}or{' '}
          <code className="font-mono text-[12px] bg-paper-deep px-1 py-0.5 rounded-[2px]">requirements.txt</code>
          {' '}to auto-fill
        </span>
        {detected.length > 0 && (
          <span className="font-mono text-[11px] text-cobalt">
            {detected.length} package{detected.length !== 1 ? 's' : ''} detected and pre-selected
          </span>
        )}
        {noMatch && (
          <span className="font-mono text-[11px] text-ink-mute">no known packages found — try editing manually</span>
        )}
        {!detected.length && !noMatch && (
          <span className="font-mono text-[11px] text-ink-mute">click or drag to import</span>
        )}
      </div>
    </div>
  )
}
