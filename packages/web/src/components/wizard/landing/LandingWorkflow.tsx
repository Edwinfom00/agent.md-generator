'use client'

export function LandingWorkflow() {
  const steps = [
    { step: '01', title: 'Identity', desc: 'Specify project parameters, stack versions, and target deliverables.' },
    { step: '02', title: 'Tech Stack', desc: 'State languages, frameworks, UI styles, and AI provider selections.' },
    { step: '03', title: 'Architecture', desc: 'Outline the visual directory scheme and coding guidelines.' },
    { step: '04', title: 'Constraints', desc: 'Deploy hard boundaries, prohibited procedures, and workflows.' },
  ]

  return (
    <section className="px-14 py-12 border-t border-rule/50 bg-paper-soft/10">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-cobalt font-bold">{s.step}</span>
              <span className="flex-1 h-px bg-rule" />
            </div>
            <span
              className="text-[22px] leading-tight tracking-[-0.01em] text-ink"
              style={{ fontFamily: 'var(--font-instrument-serif)' }}
            >
              {s.title}
            </span>
            <p className="font-mono text-[11.5px] text-ink-mute leading-[1.6]">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
