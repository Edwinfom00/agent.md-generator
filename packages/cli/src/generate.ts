import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createXai } from '@ai-sdk/xai'
import { createOllama } from 'ollama-ai-provider'
import { streamText } from 'ai'
import type { ModelConfig } from './models.js'

function createLanguageModel(config: ModelConfig, apiKey: string | null) {
  switch (config.provider) {
    case 'deepseek': {
      const deepseek = createDeepSeek({ apiKey: apiKey! })
      return deepseek(config.modelId)
    }
    case 'google': {
      const google = createGoogleGenerativeAI({ apiKey: apiKey! })
      return google(config.modelId)
    }
    case 'xai': {
      const xai = createXai({ apiKey: apiKey! })
      return xai(config.modelId)
    }
    case 'ollama': {
      const ollama = createOllama({ baseURL: 'http://localhost:11434/api' })
      return ollama(config.modelId)
    }
  }
}

export async function callModel(
  config: ModelConfig,
  apiKey: string | null,
  prompt: string,
  onChunk: (chunk: string) => void,
): Promise<string> {
  const model = createLanguageModel(config, apiKey)

  const { textStream } = streamText({
    model,
    prompt,
    temperature: 0.3,
    maxOutputTokens: 8000,
  })

  let fullText = ''

  for await (const chunk of textStream) {
    fullText += chunk
    onChunk(chunk)
  }

  return fullText
}
