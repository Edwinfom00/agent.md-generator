import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import * as p from '@clack/prompts'
import type { WizardAnswers } from '@agent-md/shared'

const HISTORY_DIR = join(homedir(), '.agent-md-generator')
const HISTORY_FILE = join(HISTORY_DIR, 'history.json')
const MAX_ENTRIES = 5

export interface CliHistoryEntry {
  id: string
  timestamp: number
  projectName: string
  modelLabel: string
  contentLength: number
  content: string
}

export function saveToCliHistory(
  answers: WizardAnswers,
  content: string,
  modelLabel: string,
 ): void {
  const entry: CliHistoryEntry = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    projectName: (answers['project_name'] as string) || 'Untitled',
    modelLabel,
    contentLength: content.length,
    content,
  }

  const existing = loadCliHistory()
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES)

  try {
    if (!existsSync(HISTORY_DIR)) {
      mkdirSync(HISTORY_DIR, { recursive: true })
    }
    writeFileSync(HISTORY_FILE, JSON.stringify(updated, null, 2), 'utf-8')
  } catch {
    // silently ignore write errors
  }
}

export function loadCliHistory(): CliHistoryEntry[] {
  try {
    if (!existsSync(HISTORY_FILE)) return []
    const raw = readFileSync(HISTORY_FILE, 'utf-8')
    return JSON.parse(raw) as CliHistoryEntry[]
  } catch {
    return []
  }
}

export async function showHistory(): Promise<void> {
  const entries = loadCliHistory()

  if (entries.length === 0) {
    p.log.info('No generation history found.')
    return
  }

  p.log.info(`Latest ${entries.length} generation(s):\n`)

  for (const entry of entries) {
    const date = new Date(entry.timestamp).toLocaleString('en-US')
    const lines = entry.content.split('\n').length
    p.log.message(
      `  ${entry.projectName}  ·  ${entry.modelLabel}  ·  ${lines} lines\n  ${date}\n`,
    )
  }

  const chosen = await p.select({
    message: 'What would you like to do?',
    options: [
      { value: 'view', label: 'View the latest generation' },
      { value: 'exit', label: 'Exit' },
    ],
  })

  if (p.isCancel(chosen) || chosen === 'exit') return

  if (chosen === 'view' && entries[0]) {
    console.log('\n' + '─'.repeat(60))
    console.log(entries[0].content)
    console.log('─'.repeat(60) + '\n')
  }
}
