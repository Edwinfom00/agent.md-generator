import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'

export async function callDeepSeek(apiKey: string, prompt: string): Promise<string> {
  const deepseek = createDeepSeek({ apiKey })
  const { text } = await generateText({
    model: deepseek('deepseek-chat'),
    prompt,
    temperature: 0.3,
    maxOutputTokens: 8000,
  })
  return text
}
