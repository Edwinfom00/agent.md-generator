import type { WizardAnswers } from '../types/index.js'

export function encodeConfig(answers: WizardAnswers): string {
  const json = JSON.stringify(answers)
  return Buffer.from(json).toString('base64url')
}

export function decodeConfig(encoded: string): WizardAnswers | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf-8')
    return JSON.parse(json) as WizardAnswers
  } catch {
    return null
  }
}

export function buildShareUrl(answers: WizardAnswers, baseUrl = 'https://agent-md-generator.edwinfom.dev'): string {
  return `${baseUrl}?config=${encodeConfig(answers)}`
}
