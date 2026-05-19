import type { WizardAnswers } from '@/types'

const HISTORY_KEY = 'agent-md-generator:history'
const MAX_ENTRIES = 3

export interface HistoryEntry {
  id: string
  timestamp: number
  projectName: string
  content: string
}

export function saveToHistory(answers: WizardAnswers, content: string): void {
  const entry: HistoryEntry = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    projectName: (answers['project_name'] as string) || 'Untitled',
    content,
  }
  const existing = loadHistory()
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // ignore quota/unavailable errors
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}
