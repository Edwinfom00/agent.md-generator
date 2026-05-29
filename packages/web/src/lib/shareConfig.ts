import type { WizardAnswers } from '@/types'

export function encodeConfig(answers: WizardAnswers): string {
  const utf8 = encodeURIComponent(JSON.stringify(answers))
  return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function decodeConfig(encoded: string): WizardAnswers | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '=='.slice(0, (4 - (b64.length % 4)) % 4)
    return JSON.parse(decodeURIComponent(atob(padded))) as WizardAnswers
  } catch {
    return null
  }
}
