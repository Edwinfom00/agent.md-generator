import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

const BASE_URL = process.env['NEXT_PUBLIC_BASE_URL'] ?? 'https://agentmd.edwinfom.dev'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'agent.md generator — brief your AI coding assistant',
    template: '%s · agent.md generator',
  },
  description:
    'Twelve questions. Four minutes. A production-grade AGENT.md your AI assistants will read before every keystroke — so they write code that matches your conventions, not theirs.',
  keywords: [
    'AGENT.md',
    'CLAUDE.md',
    'AI coding assistant',
    'Cursor',
    'Kiro',
    'Claude',
    'Copilot',
    'project spec',
    'developer tools',
    'DeepSeek',
    'coding conventions',
  ],
  authors: [{ name: 'Edwin Fom', url: 'https://github.com/Edwinfom00' }],
  creator: 'Edwin Fom',
  publisher: 'Edwin Fom',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'agent.md generator',
    title: 'agent.md generator — brief your AI coding assistant',
    description:
      'Twelve questions. Four minutes. A production-grade AGENT.md your AI assistants will read before every keystroke.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'agent.md generator — brief your AI coding assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'agent.md generator — brief your AI coding assistant',
    description:
      'Twelve questions. Four minutes. A production-grade AGENT.md your AI assistants will read before every keystroke.',
    images: ['/og.png'],
    creator: '@edwinfom00',
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: '#F1ECE2',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        {children}
      </body>
    </html>
  )
}
