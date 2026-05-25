'use client'

import {
  RiShieldKeyholeLine,
  RiCodeSSlashLine,
  RiNodeTree,
  RiTerminalBoxLine,
  RiSparklingLine,
  RiTerminalLine,
  RiFileSettingsLine,
} from 'react-icons/ri'

const CAPABILITIES = [
  {
    icon: RiShieldKeyholeLine,
    title: 'Hard Guard Constraints',
    desc: 'Specify strict boundaries: forbid structural code changes, external packages, or configuration edits without consent.',
  },
  {
    icon: RiCodeSSlashLine,
    title: 'Stack-Aware Conventions',
    desc: 'Align your assistant on named exports, strict type safety, Tailwind CSS utility patterns, and error handling guidelines.',
  },
  {
    icon: RiNodeTree,
    title: 'Workspace Architecture',
    desc: 'Provide clear visual directory schemes and folder descriptions so the LLM understands exactly where to write new files.',
  },
  {
    icon: RiTerminalBoxLine,
    title: 'Workflow & Commands',
    desc: 'Embed correct script targets (e.g. build, lint, database migrations, and testing) to prevent runtime syntax hallucinations.',
  },
  {
    icon: RiSparklingLine,
    title: 'Technical Roadmap & Prompt Blueprints',
    desc: 'Opt-in to generate ROADMAP.md files for your agent and PROMPTS.md containing session-optimized instructions that save token context.',
  },
  {
    icon: RiFileSettingsLine,
    title: 'Multi-Agent Config Bundle',
    desc: 'Automatically package AGENT.md, CLAUDE.md, Cursor rules, Claude settings, and professional setup scripts stripped of emojis.',
  },
  {
    icon: RiTerminalLine,
    title: 'IDE File Tree Sandbox',
    desc: 'Explore, inspect, and edit all your workspace rules and configurations in real-time inside a sleek sidebar layout.',
  },
]

export function LandingCapabilities() {
  return (
    <section className="px-14 py-12 border-t border-rule/50 bg-paper-soft/20">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1 max-w-[620px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cobalt font-semibold">
            Engineered for modern workflows
          </span>
          <h2
            className="text-[38px] leading-tight tracking-[-0.015em] text-ink"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Align every <em className="text-cobalt italic">coding convention</em> under one specification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {CAPABILITIES.map((cap, i) => {
            const IconComp = cap.icon
            return (
              <div
                key={i}
                className="flex gap-4 p-6 border border-rule rounded-xl bg-white hover:border-cobalt/40 transition-all hover:scale-101 shadow-sm group"
              >
                <div className="w-10 h-10 rounded-full bg-cobalt-soft flex items-center justify-center shrink-0 group-hover:bg-cobalt group-hover:text-white transition-colors">
                  <IconComp className="w-5 h-5 text-cobalt-deep group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-sans text-[15px] font-bold text-ink">{cap.title}</h3>
                  <p className="font-mono text-[11.5px] text-ink-mute leading-[1.6]">{cap.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
