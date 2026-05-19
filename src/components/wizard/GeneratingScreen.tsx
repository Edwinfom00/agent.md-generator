export function GeneratingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-paper">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl border-2 border-cobalt/20 animate-spin-slow" />
          <div className="absolute inset-2 rounded-xl bg-cobalt-soft flex items-center justify-center">
            <span
              className="text-cobalt text-[28px] leading-none"
              style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}
            >
              ▤
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p
            className="text-[32px] leading-[1.05] tracking-[-0.015em] text-ink"
            style={{ fontFamily: 'var(--font-instrument-serif)' }}
          >
            Writing your <em className="text-cobalt italic">AGENT.md</em>
          </p>
          <p className="text-[15px] text-ink-mute max-w-sm leading-relaxed">
            Our agent is analyzing your brief and writing a complete engineering spec...
          </p>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cobalt"
              style={{ animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
