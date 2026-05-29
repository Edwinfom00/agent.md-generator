import * as p from '@clack/prompts'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  QUESTIONS,
  TEMPLATES,
  OUTPUT_FORMATS,
  buildPrompt,
  buildUpdatePrompt,
  validateOutput,
  scoreOutput,
  buildShareUrl,
  isQuestionVisible,
} from '@agent-md/shared'
import type { WizardAnswers } from '@agent-md/shared'
import { detectProject } from './detect.js'
import { selectModel, MODELS } from './models.js'
import { callModel } from './generate.js'
import { saveToCliHistory, showHistory } from './history.js'
import { promptQuestion, reviewAnswers } from './prompts.js'

// ─── arg parsing ──────────────────────────────────────────────────────────────

function parseArgs(): {
  templateId?: string
  update: boolean
  history: boolean
  yes: boolean
  init: boolean
} {
  const args = process.argv.slice(2)
  const result = { update: false, history: false, yes: false, init: false, templateId: undefined as string | undefined }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--update') result.update = true
    else if (args[i] === '--history') result.history = true
    else if (args[i] === '--yes') result.yes = true
    else if (args[i] === '--init') result.init = true
    else if (args[i] === '--template' && args[i + 1]) {
      result.templateId = args[i + 1]
      i++
    }
  }

  return result
}

// ─── .env.local loader ────────────────────────────────────────────────────────

function loadEnvLocal(cwd: string): Record<string, string> {
  const envPath = resolve(cwd, '.env.local')
  const env: Record<string, string> = {}
  if (!existsSync(envPath)) return env
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '')
    env[key] = val
    if (!process.env[key]) process.env[key] = val
  }
  return env
}

// ─── update mode ──────────────────────────────────────────────────────────────

async function runUpdateMode(cwd: string): Promise<void> {
  let agentMdPath = resolve(cwd, 'AGENT.md')

  if (!existsSync(agentMdPath)) {
    const entered = await p.text({
      message: 'Path to AGENT.md to update:',
      validate: (v) => {
        if (!v.trim()) return 'Required.'
        if (!existsSync(v.trim())) return `File not found: ${v}`
      },
    })
    if (p.isCancel(entered)) { p.cancel('Cancelled.'); process.exit(0) }
    agentMdPath = entered.trim()
  }

  const existingContent = readFileSync(agentMdPath, 'utf-8')
  p.log.success(`AGENT.md loaded (${existingContent.split('\n').length} lines)`)

  const change = await p.text({
    message: 'What do you want to change or add?',
    placeholder: 'e.g. Add a Testing section with Jest. Update the tech stack with Drizzle.',
    validate: (v) => (!v.trim() ? 'Required.' : undefined),
  })
  if (p.isCancel(change)) { p.cancel('Cancelled.'); process.exit(0) }

  const { config, apiKey } = await selectModel(cwd)

  console.log('\n')
  p.log.step(`Updating with ${config.label}...`)
  console.log('─'.repeat(60))

  const prompt = buildUpdatePrompt(existingContent, change)
  let content = ''

  try {
    content = await callModel(config, apiKey, prompt, (chunk) => {
      process.stdout.write(chunk)
    })
  } catch (err) {
    console.log('\n')
    p.cancel(err instanceof Error ? err.message : 'Unknown error')
    process.exit(1)
  }

  console.log('\n' + '─'.repeat(60) + '\n')

  writeFileSync(agentMdPath, content, 'utf-8')
  p.outro(`✓ AGENT.md updated → ${agentMdPath}`)
}

// ─── split multi-file output (ROADMAP + PROMPTS) ──────────────────────────────

function splitInitOutput(raw: string): { agent: string; roadmap?: string; prompts?: string } {
  if (!raw.includes('===AGENT_MD===')) return { agent: raw }
  const agentMatch = raw.match(/===AGENT_MD===([\s\S]*?)(?:===ROADMAP_MD===|$)/)
  const roadmapMatch = raw.match(/===ROADMAP_MD===([\s\S]*?)(?:===PROMPTS_MD===|$)/)
  const promptsMatch = raw.match(/===PROMPTS_MD===([\s\S]*)$/)
  return {
    agent: agentMatch?.[1]?.trim() ?? raw,
    roadmap: roadmapMatch?.[1]?.trim(),
    prompts: promptsMatch?.[1]?.trim(),
  }
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const cwd = process.cwd()
  const loadedEnv = loadEnvLocal(cwd)

  const args = parseArgs()

  console.clear()
  p.intro('  agent-md-generator  ')

  // ── --history ────────────────────────────────────────────────────────────
  if (args.history) {
    await showHistory()
    process.exit(0)
  }

  // ── --update ─────────────────────────────────────────────────────────────
  if (args.update) {
    await runUpdateMode(cwd)
    process.exit(0)
  }

  // ── --init ───────────────────────────────────────────────────────────────
  if (args.init) {
    p.log.step('Running automatic non-interactive initialization...')
    const detected = await detectProject(cwd)

    const env = { ...loadedEnv, ...process.env }
    let selectedConfig = MODELS[0]
    let apiKey: string | null = null

    if (env.DEEPSEEK_API_KEY) {
      selectedConfig = MODELS.find(m => m.modelId === 'deepseek-chat')!
      apiKey = env.DEEPSEEK_API_KEY
    } else if (env.GOOGLE_GENERATIVE_AI_API_KEY) {
      selectedConfig = MODELS.find(m => m.modelId === 'gemini-2.0-flash')!
      apiKey = env.GOOGLE_GENERATIVE_AI_API_KEY
    } else if (env.XAI_API_KEY) {
      selectedConfig = MODELS.find(m => m.modelId === 'grok-3-mini')!
      apiKey = env.XAI_API_KEY
    } else {
      selectedConfig = MODELS.find(m => m.modelId === 'llama3.2')!
      apiKey = null
      p.log.info('No API keys found in environment, falling back to local Llama 3.2 Ollama.')
    }

    const answers: WizardAnswers = {
      project_name: detected.projectName || 'Untitled Project',
      project_type: detected.manifestType === 'unknown' ? 'web_app' : detected.manifestType === 'npm' ? 'web_app' : 'other',
      project_description: detected.description || 'A software application project.',
      tech_stack: detected.techStack.length ? detected.techStack : ['typescript'],
      ai_features: 'no',
      folder_structure: detected.tree,
      coding_conventions: ['no_any', 'small_files', 'named_exports'],
      dev_philosophy: 'production_grade',
      constraints: ['no_telemetry'],
      initialize_project: 'no'
    }

    p.log.step(`Generating AGENT.md using ${selectedConfig.label}...`)
    const prompt = buildPrompt(answers)
    let rawContent = ''

    try {
      rawContent = await callModel(selectedConfig, apiKey, prompt, (chunk) => {
        process.stdout.write(chunk)
      })
    } catch (err) {
      console.log('\n')
      p.cancel(err instanceof Error ? err.message : 'Generation error')
      process.exit(1)
    }

    console.log('\n' + '─'.repeat(60) + '\n')

    const { agent: agentContent } = splitInitOutput(rawContent)

    const agentPath = resolve(detected.rootPath, 'AGENT.md')
    const claudePath = resolve(detected.rootPath, 'CLAUDE.md')

    writeFileSync(agentPath, agentContent, 'utf-8')
    writeFileSync(claudePath, agentContent, 'utf-8')

    saveToCliHistory(answers, agentContent, selectedConfig.label)

    p.outro(`✓ Done! Initialization complete:\n  → ${agentPath}\n  → ${claudePath}`)
    process.exit(0)
  }

  // ── 1. DÉTECTION DU PROJET ───────────────────────────────────────────────
  p.log.step('Analyzing project...')
  const detected = await detectProject(cwd)

  const prefillSummary: string[] = []
  if (detected.projectName) prefillSummary.push(`Name: ${detected.projectName}`)
  if (detected.techStack.length) prefillSummary.push(`Tech stack: ${detected.techStack.join(', ')}`)
  prefillSummary.push(`Structure read from: ${detected.rootPath}`)

  p.log.success(`Project detected (${detected.manifestType})\n  ${prefillSummary.join('\n  ')}`)

  // ── 2. SÉLECTION DU MODÈLE ───────────────────────────────────────────────
  const { config: modelConfig, apiKey } = await selectModel(cwd)

  // ── 3. TEMPLATE ──────────────────────────────────────────────────────────
  let answers: WizardAnswers = {}

  if (args.templateId) {
    const template = TEMPLATES.find(t => t.id === args.templateId)
    if (template) {
      answers = { ...template.answers } as WizardAnswers
      p.log.success(`Template "${template.name}" applied`)
    } else {
      p.log.warn(`Template "${args.templateId}" not found. Starting from scratch.`)
    }
  } else {
    const useTemplate = await p.select({
      message: 'Start from a template?',
      options: [
        { value: '__none__', label: 'Start from scratch' },
        ...TEMPLATES.map(t => ({ value: t.id, label: t.name, hint: t.stack })),
      ],
    })

    if (p.isCancel(useTemplate)) { p.cancel('Cancelled.'); process.exit(0) }

    if (useTemplate !== '__none__') {
      const template = TEMPLATES.find(t => t.id === useTemplate)!
      answers = { ...template.answers } as WizardAnswers
      p.log.success(`Template "${template.name}" loaded`)
    }
  }

  // Injecter les pré-remplissages de la détection
  if (detected.projectName && !answers['project_name']) {
    answers['project_name'] = detected.projectName
  }
  if (detected.description && !answers['project_description']) {
    answers['project_description'] = detected.description
  }
  if (detected.techStack.length && !answers['tech_stack']) {
    answers['tech_stack'] = detected.techStack
  }

  // ── 4. QUESTIONS ─────────────────────────────────────────────────────────
  for (const question of QUESTIONS) {
    if (!isQuestionVisible(question, answers)) continue

    // folder_structure → injecté automatiquement depuis la détection
    if (question.id === 'folder_structure') {
      answers['folder_structure'] = detected.tree
      p.log.success('Project structure auto-injected')
      continue
    }

    // Si la question est déjà pré-remplie (template ou détection), la proposer comme défaut
    const prefill = answers[question.id]

    const value = await promptQuestion(question, prefill)
    if (p.isCancel(value)) { p.cancel('Cancelled.'); process.exit(0) }
    if (value !== undefined && (typeof value !== 'string' || value !== '')) {
      answers[question.id] = value as string | string[]
    }
  }

  // ── 5. REVIEW ────────────────────────────────────────────────────────────
  p.log.step('Summary of your answers:')
  reviewAnswers(answers)

  const confirmed = await p.confirm({
    message: 'Generate AGENT.md now?',
    initialValue: true,
  })
  if (p.isCancel(confirmed) || !confirmed) { p.cancel('Cancelled.'); process.exit(0) }

  // ── 6. GÉNÉRATION (STREAMING LIVE) ───────────────────────────────────────
  console.log('\n')
  p.log.step(`Generating with ${modelConfig.label}...`)
  console.log('─'.repeat(60))

  const prompt = buildPrompt(answers)
  let rawContent = ''

  try {
    rawContent = await callModel(modelConfig, apiKey, prompt, (chunk) => {
      process.stdout.write(chunk)
    })
  } catch (err) {
    console.log('\n')
    p.cancel(err instanceof Error ? err.message : 'Generation error')
    process.exit(1)
  }

  console.log('\n' + '─'.repeat(60) + '\n')

  // ── 7. VALIDATION + SCORE ────────────────────────────────────────────────
  const { agent: agentContent, roadmap: roadmapContent, prompts: promptsContent } = splitInitOutput(rawContent)

  const { warnings } = validateOutput(agentContent)
  const score = scoreOutput(agentContent)

  p.log.step(`Validating generated content`)

  const lines = agentContent.split('\n').length
  p.log.success(`${lines} lines generated`)

  if (warnings.length > 0) {
    for (const w of warnings) p.log.warn(w)
  }

  const scoreLabel = `${score.found}/${score.total} sections covered`
  if (score.found >= 8) {
    p.log.success(`Completeness score: ${scoreLabel}`)
  } else {
    p.log.warn(`Completeness score: ${scoreLabel}`)
  }

  const missingSections = score.sections.filter(s => !s.present).map(s => s.label)
  if (missingSections.length) {
    p.log.info(`Missing sections: ${missingSections.join(', ')}`)
  }

  // ── 8. SÉLECTION DES FICHIERS DE SORTIE ──────────────────────────────────
  const formatOptions = OUTPUT_FORMATS.map(f => ({
    value: f.filename,
    label: `${f.filename}  (${f.tool})`,
  }))

  const selectedFormats = await p.multiselect({
    message: 'Which files do you want to generate?',
    options: formatOptions,
    initialValues: ['AGENT.md', 'CLAUDE.md'],
    required: true,
  })
  if (p.isCancel(selectedFormats)) { p.cancel('Cancelled.'); process.exit(0) }

  // ── 9. ÉCRITURE DES FICHIERS ─────────────────────────────────────────────
  const writtenFiles: string[] = []

  for (const filename of selectedFormats as string[]) {
    const outputPath = resolve(detected.rootPath, filename)
    writeFileSync(outputPath, agentContent, 'utf-8')
    writtenFiles.push(outputPath)
  }

  if (roadmapContent) {
    const roadmapPath = resolve(detected.rootPath, 'ROADMAP.md')
    writeFileSync(roadmapPath, roadmapContent, 'utf-8')
    writtenFiles.push(roadmapPath)
    p.log.success('ROADMAP.md generated')
  }

  if (promptsContent) {
    const promptsPath = resolve(detected.rootPath, 'PROMPTS.md')
    writeFileSync(promptsPath, promptsContent, 'utf-8')
    writtenFiles.push(promptsPath)
    p.log.success('PROMPTS.md generated')
  }

  // ── 10. HISTORIQUE + LIEN ─────────────────────────────────────────────────
  saveToCliHistory(answers, agentContent, modelConfig.label)

  const shareUrl = buildShareUrl(answers)
  p.log.info(`Share your config:\n  ${shareUrl}`)

  // ── 11. OUTRO ─────────────────────────────────────────────────────────────
  p.outro(
    `✓ Done! Files written:\n${writtenFiles.map(f => `  → ${f}`).join('\n')}`,
  )
}

main()
