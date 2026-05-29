import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'agent.md generator — brief your AI coding assistant'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#F1ECE2',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(20,20,19,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,19,0.06) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 80px',
            width: '100%',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: '#2536D6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 20, height: 20, background: '#F1ECE2', borderRadius: 2 }} />
            </div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 14,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6B665B',
              }}
            >
              agent.md generator · v1.0 · 2026
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                fontSize: 96,
                lineHeight: 0.92,
                letterSpacing: '-0.025em',
                color: '#141413',
                fontStyle: 'italic',
              }}
            >
              A{' '}
              <span style={{ color: '#2536D6' }}>brief</span>
              <br />
              for your{' '}
              <span style={{ color: '#2536D6' }}>agent</span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 18,
                  verticalAlign: 'super',
                  color: '#2536D6',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontStyle: 'normal',
                  marginLeft: 6,
                }}
              >
                .md
              </span>
            </div>

            <p
              style={{
                fontSize: 22,
                color: '#2E2C28',
                lineHeight: 1.45,
                maxWidth: 680,
                margin: 0,
                fontStyle: 'normal',
              }}
            >
              Twelve questions. Four minutes. A production-grade{' '}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 18,
                  background: '#E6E8FA',
                  color: '#1A28A8',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                AGENT.md
              </span>{' '}
              your AI assistants will read before every keystroke.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[
              { label: 'questions', value: '12' },
              { label: 'avg. time', value: '3:48' },
              { label: 'server storage', value: '0 bytes' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#6B665B',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 32,
                    letterSpacing: '-0.01em',
                    color: '#141413',
                    fontStyle: 'italic',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: '#6B665B',
                  letterSpacing: '0.1em',
                }}
              >
                by Edwin Fom
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
