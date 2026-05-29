'use client'

import { useState } from 'react'
import { RiFileSettingsLine } from 'react-icons/ri'
import { cn } from '@/lib/cn'

export function LandingSandbox() {
  const [simTs, setSimTs] = useState(true)
  const [simNamed, setSimNamed] = useState(true)
  const [simTailwind, setSimTailwind] = useState(true)

  function getSimulatedCode() {
    const headerComment = `// Reacting to prompt rules: TS=${simTs ? 'ON' : 'OFF'}, NAMED=${simNamed ? 'ON' : 'OFF'}, TW=${simTailwind ? 'ON' : 'OFF'}`

    let buttonInterface = ''
    if (simTs) {
      buttonInterface = `interface ButtonProps {\n  onClick: () => void;\n  className?: string;\n}\n\n`
    }

    let signature = ''
    if (simNamed) {
      signature = `export function Button({ onClick, className }${simTs ? ': ButtonProps' : ''}) {`
    } else {
      signature = `export default function Button({ onClick, className }${simTs ? ': ButtonProps' : ''}) {`
    }

    let returnStmt = ''
    if (simTailwind) {
      returnStmt = `  return (\n    <button\n      onClick={onClick}\n      className={cn('px-4 py-2 bg-cobalt text-white rounded-full hover:bg-cobalt-deep transition-all', className)}\n    >\n      Action\n    </button>\n  )`
    } else {
      returnStmt = `  return (\n    <button\n      onClick={onClick}\n      style={{\n        padding: '8px 16px',\n        backgroundColor: '#4f46e5',\n        color: '#ffffff',\n        borderRadius: '9999px',\n        border: 'none',\n        cursor: 'pointer'\n      }}\n    >\n      Action\n    </button>\n  )`
    }

    const end = '}'

    return `${headerComment}\n\n${buttonInterface}${signature}\n${returnStmt}\n${end}`
  }

  return (
    <section className="px-14 py-12 border-t border-rule/50 bg-paper-soft/30">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1 max-w-[620px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt font-semibold">
            Live Interactive Sandbox
          </span>
          <h2
            className="text-[38px] leading-tight tracking-[-0.015em] text-ink"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            See prompt guidelines <em className="text-cobalt italic">change</em> code in real-time
          </h2>
          <p className="font-mono text-[12px] text-ink-mute leading-relaxed mt-1">
            Toggle the rules in the left panel to watch how the AI adjusts its code structure dynamically based on the specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[310px]">
          {/* Rule Toggles (4 cols) */}
          <div className="md:col-span-4 border border-rule rounded-xl bg-white p-6.5 flex flex-col gap-4.5 shadow-sm justify-center">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink font-semibold flex items-center gap-1.5 pb-1 border-b border-rule">
              <RiFileSettingsLine className="w-4 h-4 text-cobalt" />
              Prompt Specifications
            </span>

            <div className="flex flex-col gap-3">
              {[
                {
                  id: 'ts',
                  label: 'Strict TypeScript props',
                  desc: 'Requires explicit button properties typing.',
                  val: simTs,
                  setter: setSimTs,
                },
                {
                  id: 'named',
                  label: 'Named Exports only',
                  desc: 'Prohibits default exports to safeguard imports.',
                  val: simNamed,
                  setter: setSimNamed,
                },
                {
                  id: 'tw',
                  label: 'Enforce Tailwind CSS utilities',
                  desc: 'Forbids raw CSS styles, prefers dynamic tailwind classes.',
                  val: simTailwind,
                  setter: setSimTailwind,
                },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => opt.setter(!opt.val)}
                  className={cn(
                    'flex flex-col gap-0.5 p-3 rounded-lg border text-left transition-all cursor-pointer border-transparent',
                    opt.val
                      ? 'bg-cobalt-soft/45 border-cobalt/20 text-ink'
                      : 'hover:bg-paper-deep/30 text-ink-mute',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] shrink-0 border font-mono transition-all',
                        opt.val
                          ? 'bg-cobalt border-cobalt text-white'
                          : 'bg-white border-rule text-transparent',
                      )}
                    >
                      {opt.val && '✓'}
                    </span>
                    <span className="font-sans text-[13.5px] font-bold text-ink">{opt.label}</span>
                  </div>
                  <p className="font-mono text-[11px] text-ink-mute pl-5.5 leading-snug mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Output (8 cols) */}
          <div className="md:col-span-8 flex flex-col rounded-xl border border-rule shadow-sm overflow-hidden min-h-[280px]">
            <div className="flex items-center justify-between px-5.5 py-3.5 bg-paper-deep border-b border-rule select-none">
              <span className="font-mono text-[11px] text-ink-mute">Button.tsx</span>
              <span className="font-mono text-[9px] bg-cobalt-soft text-cobalt-deep px-2 py-0.5 rounded uppercase tracking-wider font-semibold animate-pulse">
                Conforming to AGENT.md
              </span>
            </div>
            <div className="p-5 flex-1 bg-white overflow-auto font-mono text-[11px] leading-[1.65] text-ink-2 select-text">
              <pre className="whitespace-pre">{getSimulatedCode()}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
