'use client'

import { useState, useRef } from 'react'
import { RiUploadLine, RiArrowRightLine, RiArrowLeftLine, RiFileTextLine } from 'react-icons/ri'
import { cn } from '@/lib/cn'

interface UpdateModeScreenProps {
  onGenerate: (existingContent: string, changeDescription: string) => void
  onBack: () => void
  loading?: boolean
  error?: string
}

export function UpdateModeScreen({ onGenerate, onBack, loading, error }: UpdateModeScreenProps) {
  const [existingContent, setExistingContent] = useState('')
  const [changeDescription, setChangeDescription] = useState('')
  const [filename, setFilename] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileLoad(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      setExistingContent((e.target?.result as string) ?? '')
      setFilename(file.name)
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileLoad(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFileLoad(file)
  }

  const canGenerate = existingContent.trim().length > 0 && changeDescription.trim().length > 0

  return (
    <div className="flex-1 overflow-y-auto px-14 py-10">
      <div className="max-w-[900px] mx-auto flex flex-col gap-10">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              Update mode
            </span>
            <h2
              className="text-[52px] leading-[1.02] tracking-[-0.015em]"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              Update your <em className="text-cobalt italic">AGENT.md</em>
            </h2>
            <p className="text-[15px] text-ink-2 leading-normal max-w-[480px]">
              Upload your existing file and describe what you want to change. The AI applies your changes while keeping everything else intact.
            </p>
          </div>
          <button
            onClick={onBack}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full border border-rule text-ink-mute hover:border-ink hover:text-ink transition-colors"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              Existing AGENT.md
            </label>

            {existingContent ? (
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-ink-mute">
                    <RiFileTextLine className="w-3.5 h-3.5" />
                    {filename || 'pasted content'}
                    <span>· {existingContent.split('\n').length} lines</span>
                  </div>
                  <button
                    onClick={() => { setExistingContent(''); setFilename('') }}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute hover:text-signal transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  value={existingContent}
                  onChange={e => setExistingContent(e.target.value)}
                  className="h-[320px] w-full border border-rule rounded-[6px] px-4 py-3 font-mono text-[12px] leading-[1.6] text-ink bg-white resize-none outline-none focus:border-ink transition-colors"
                  spellCheck={false}
                />
              </div>
            ) : (
              <>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-[6px] p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors',
                    dragOver
                      ? 'border-cobalt bg-cobalt/5'
                      : 'border-rule hover:border-ink/40 bg-paper-soft',
                  )}
                >
                  <RiUploadLine className="w-6 h-6 text-ink-mute" />
                  <p className="text-[14px] text-ink-2 text-center leading-relaxed">
                    Drop your{' '}
                    <code className="font-mono text-[12px] bg-paper-deep px-1.5 py-0.5 rounded-[3px]">
                      AGENT.md
                    </code>{' '}
                    here
                  </p>
                  <p className="text-[12px] text-ink-mute">or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-mute">
                    Or paste content
                  </span>
                  <textarea
                    placeholder="Paste your existing AGENT.md content here..."
                    onChange={e => setExistingContent(e.target.value)}
                    className="h-[140px] w-full border border-rule rounded-[6px] px-4 py-3 font-mono text-[12px] leading-[1.6] text-ink bg-paper-soft resize-none outline-none focus:border-ink focus:bg-white transition-colors placeholder:text-ink-mute"
                    spellCheck={false}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              What do you want to change?
            </label>
            <textarea
              value={changeDescription}
              onChange={e => setChangeDescription(e.target.value)}
              placeholder={'Examples:\n— Add a comprehensive testing section with Jest setup\n— Update the tech stack to replace Prisma with Drizzle ORM\n— Add strict TypeScript rules with ✅/❌ examples\n— Add a new section about deployment and CI/CD'}
              className="flex-1 min-h-[240px] w-full border border-rule rounded-[6px] px-4 py-3 text-[14px] leading-[1.65] text-ink bg-paper-soft resize-none outline-none focus:border-ink focus:bg-white transition-colors placeholder:text-ink-mute/70 placeholder:text-[13px]"
            />
            <p className="text-[12px] text-ink-mute leading-[1.6]">
              Be specific. Sections not mentioned will be kept as-is.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-[4px] border border-signal/30 bg-signal/10 px-4 py-3">
            <p className="text-[14px] text-signal font-mono">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => { if (canGenerate && !loading) onGenerate(existingContent, changeDescription) }}
            disabled={!canGenerate || loading}
            className={cn(
              'inline-flex items-center gap-2.5 px-7 py-4 font-mono text-[12px] uppercase tracking-[0.14em] rounded-full transition-all',
              canGenerate && !loading
                ? 'bg-cobalt border border-cobalt text-white hover:bg-cobalt-deep cursor-pointer'
                : 'bg-paper-deep border border-rule text-ink-mute cursor-not-allowed',
            )}
          >
            {loading ? 'Generating...' : 'Apply changes'}
            {!loading && <RiArrowRightLine className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
