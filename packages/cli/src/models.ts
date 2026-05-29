import * as p from '@clack/prompts'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type Provider = 'deepseek' | 'google' | 'xai' | 'ollama'

export interface ModelConfig {
  provider: Provider
  modelId: string
  label: string
  envKey: string | null
  hint: string
}

export const MODELS: ModelConfig[] = [
  {
    provider: 'deepseek',
    modelId: 'deepseek-chat',
    label: 'DeepSeek Chat',
    envKey: 'DEEPSEEK_API_KEY',
    hint: 'Fast · Cheap · Recommended — platform.deepseek.com',
  },
  {
    provider: 'deepseek',
    modelId: 'deepseek-reasoner',
    label: 'DeepSeek Reasoner (R1)',
    envKey: 'DEEPSEEK_API_KEY',
    hint: 'Slower · Best for complex reasoning',
  },
  {
    provider: 'google',
    modelId: 'gemini-2.0-flash',
    label: 'Gemini 2.0 Flash',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    hint: 'Fast · Multimodal — aistudio.google.com',
  },
  {
    provider: 'google',
    modelId: 'gemini-1.5-pro',
    label: 'Gemini 1.5 Pro',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
    hint: 'Long context (2M tokens) · High quality',
  },
  {
    provider: 'xai',
    modelId: 'grok-beta',
    label: 'Grok Beta',
    envKey: 'XAI_API_KEY',
    hint: 'xAI · Recent knowledge — console.x.ai',
  },
  {
    provider: 'xai',
    modelId: 'grok-3-mini',
    label: 'Grok 3 Mini',
    envKey: 'XAI_API_KEY',
    hint: 'xAI · Fast · Cost-effective',
  },
  {
    provider: 'ollama',
    modelId: 'llama3.2',
    label: 'Llama 3.2 (Local Ollama)',
    envKey: null,
    hint: 'Local · Free · No API key required — ollama.com',
  },
  {
    provider: 'ollama',
    modelId: 'mistral',
    label: 'Mistral (Local Ollama)',
    envKey: null,
    hint: 'Local · Free · Good for coding',
  },
]

function loadEnv(cwd: string): Record<string, string> {
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
  }
  return env
}

function saveKeyToEnvLocal(cwd: string, key: string, value: string): void {
  const envPath = resolve(cwd, '.env.local')
  const existing = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : ''
  const line = `${key}=${value}\n`
  const updated = existing.endsWith('\n') || existing === '' ? existing + line : existing + '\n' + line
  writeFileSync(envPath, updated, 'utf-8')
}

async function checkOllamaRunning(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    const res = await fetch('http://localhost:11434/api/tags', { signal: controller.signal })
    clearTimeout(timeout)
    return res.ok
  } catch {
    return false
  }
}

export async function selectModel(cwd: string): Promise<{ config: ModelConfig; apiKey: string | null }> {
  const env = { ...loadEnv(cwd), ...process.env }

  const options = MODELS.map(m => {
    const hasKey = m.envKey === null || Boolean(env[m.envKey])
    return {
      value: m.modelId,
      label: `${m.label}${hasKey ? '  ✓' : ''}`,
      hint: hasKey && m.envKey ? 'API key found' : m.hint,
    }
  })

  const chosen = await p.select({
    message: 'Which model do you want to use for generation?',
    options,
  })

  if (p.isCancel(chosen)) {
    p.cancel('Cancelled.')
    process.exit(0)
  }

  const config = MODELS.find(m => m.modelId === chosen)!

  if (config.provider === 'ollama') {
    const running = await checkOllamaRunning()
    if (!running) {
      p.log.warn(
        'Ollama does not seem to be running on localhost:11434.\nStart it with: ollama serve\nThen in another terminal run: ollama pull ' + config.modelId,
      )
      const cont = await p.confirm({ message: 'Continue anyway?', initialValue: false })
      if (p.isCancel(cont) || !cont) {
        p.cancel('Cancelled.')
        process.exit(0)
      }
    } else {
      p.log.success(`Ollama detected on localhost:11434`)
    }
    return { config, apiKey: null }
  }

  const envKeyName = config.envKey!
  let apiKey = env[envKeyName]

  if (!apiKey) {
    const entered = await p.password({
      message: `Enter your API key for ${config.label} (${envKeyName})`,
      validate: (v) => (!v.trim() ? 'API key is required.' : undefined),
    })
    if (p.isCancel(entered)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }
    apiKey = entered

    const save = await p.confirm({
      message: `Save ${envKeyName} to .env.local for future use?`,
      initialValue: true,
    })
    if (!p.isCancel(save) && save) {
      saveKeyToEnvLocal(cwd, envKeyName, apiKey)
      p.log.success(`.env.local updated with ${envKeyName}`)
    }
  } else {
    p.log.success(`API key ${envKeyName} found in the environment`)
  }

  return { config, apiKey }
}
