import * as p from '@clack/prompts'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildPrompt } from '../src/lib/buildPrompt'
import { QUESTIONS, isQuestionVisible } from '../src/lib/questions'
import type { WizardAnswers } from '../src/types'
import { callDeepSeek } from './generate'
import { promptQuestion } from './prompts'

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

async function main(): Promise<void> {
  loadEnvLocal()

  console.clear()
  p.intro('  agent-md-generator  ')

  let apiKey = process.env['DEEPSEEK_API_KEY']

  if (!apiKey) {
    const entered = await p.password({
      message: 'Enter your DeepSeek API key (get one at platform.deepseek.com)',
      validate: (v) => (!v.trim() ? 'API key is required.' : undefined),
    })
    if (p.isCancel(entered)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }
    apiKey = entered

    const save = await p.confirm({
      message: 'Save this key to .env.local for future runs?',
      initialValue: true,
    })
    if (!p.isCancel(save) && save) {
      const envPath = resolve(process.cwd(), '.env.local')
      const existing = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : ''
      const line = `DEEPSEEK_API_KEY=${apiKey}\n`
      writeFileSync(envPath, existing.endsWith('\n') || existing === '' ? existing + line : existing + '\n' + line, 'utf-8')
      p.log.success('.env.local updated.')
    }
  }

  const answers: WizardAnswers = {}

  for (const question of QUESTIONS) {
    if (!isQuestionVisible(question, answers)) continue
    const value = await promptQuestion(question)
    if (p.isCancel(value)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }
    if (value !== undefined && (typeof value !== 'string' || value !== '')) {
      answers[question.id] = value as string | string[]
    }
  }

  const s = p.spinner()
  s.start('Generating your AGENT.md with DeepSeek...')

  try {
    const content = await callDeepSeek(apiKey, buildPrompt(answers))
    const outputPath = resolve(process.cwd(), 'AGENT.md')
    writeFileSync(outputPath, content, 'utf-8')
    s.stop('Done!')
    p.outro(`AGENT.md written to ${outputPath}`)
  } catch (err) {
    s.stop('Generation failed.')
    p.cancel(err instanceof Error ? err.message : 'Unknown error')
    process.exit(1)
  }
}

main()
