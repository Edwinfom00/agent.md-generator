'use client'

import { RiCheckLine, RiCloseLine } from 'react-icons/ri'

export function LandingBeforeAfter() {
  return (
    <section className="px-14 py-12 transition-all duration-700">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
          The difference it makes
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BEFORE */}
          <div className="flex flex-col gap-0 rounded-[8px] overflow-hidden border border-rule shadow-sm bg-white">
            <div className="flex items-center justify-between px-5 py-3 bg-paper-deep border-b border-rule select-none">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-signal/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-ink-mute/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-ink-mute/20" />
                </div>
                <span className="font-mono text-[11px] text-ink-mute">Button.tsx</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-signal/80 bg-signal/8 px-2.5 py-1 rounded-full">
                <RiCloseLine className="w-3 h-3" />
                Without AGENT.md
              </span>
            </div>
            <div className="px-5 py-5 flex flex-col font-mono text-[11px] leading-[1.75] text-ink-2 whitespace-pre select-text">
              <div className="text-ink-mute">// AI has zero context about your project</div>
              <div className="text-ink-mute">// It guesses conventions — and guesses wrong</div>
              <div className="text-transparent select-none">&nbsp;</div>
              <div><span className="text-cobalt">export default function</span> Button({'{'} onClick {'}'}) {'{'}</div>
              <div className="text-ink-mute">  // default export → wrong for this project</div>
              <div className="text-ink-mute">  // no TypeScript → strict mode violation</div>
              <div>  return &lt;<span className="text-cobalt">button</span> onClick={'{'}onClick{'}'}&gt;Click&lt;/<span className="text-cobalt">button</span>&gt;</div>
              <div>{'}'}</div>
              <div className="text-transparent select-none">&nbsp;</div>
              <div className="text-ink-mute">// Installed lodash without asking</div>
              <div className="text-ink-mute">// Added inline styles instead of Tailwind</div>
            </div>
          </div>

          {/* AFTER */}
          <div className="flex flex-col gap-0 rounded-[8px] overflow-hidden border border-cobalt/35 shadow-md bg-white">
            <div className="flex items-center justify-between px-5 py-3 bg-cobalt-soft border-b border-cobalt/20 select-none">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cobalt/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cobalt/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cobalt/20" />
                </div>
                <span className="font-mono text-[11px] text-cobalt-deep font-semibold">Button.tsx</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cobalt-deep bg-cobalt/10 px-2.5 py-1 rounded-full font-bold">
                <RiCheckLine className="w-3.5 h-3.5" />
                With AGENT.md
              </span>
            </div>
            <div className="px-5 py-5 flex flex-col font-mono text-[11px] leading-[1.75] text-ink-2 whitespace-pre select-text">
              <div className="text-ink-mute">// AI read your AGENT.md before writing a line</div>
              <div className="text-ink-mute">// Named export · TypeScript · cn() · your patterns</div>
              <div className="text-transparent select-none">&nbsp;</div>
              <div><span className="text-cobalt-deep">import</span> {'{'} cn {'}'} <span className="text-cobalt-deep">from</span> <span className="text-ink">&apos;@/lib/cn&apos;</span></div>
              <div className="text-transparent select-none">&nbsp;</div>
              <div><span className="text-cobalt">interface</span> ButtonProps {'{'}</div>
              <div>  onClick: () =&gt; <span className="text-cobalt">void</span>;</div>
              <div>  className?: <span className="text-cobalt">string</span>;</div>
              <div>{'}'}</div>
              <div className="text-transparent select-none">&nbsp;</div>
              <div><span className="text-cobalt">export function</span> Button({'{'} onClick, className {'}'}: ButtonProps) {'{'}</div>
              <div>  return (</div>
              <div>    &lt;<span className="text-cobalt">button</span></div>
              <div>      onClick={'{'}onClick{'}'}</div>
              <div>      className={'{'}cn(<span className="text-ink">&apos;btn-base&apos;</span>, className){'}'}</div>
              <div>    /&gt;</div>
              <div>  )</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
