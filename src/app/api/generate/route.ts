import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/buildPrompt'
import type { GenerateRequest } from '@/types'

export async function POST(req: NextRequest) {
  const apiKey = process.env['DEEPSEEK_API_KEY']

  if (!apiKey) {
    return NextResponse.json({ error: 'DEEPSEEK_API_KEY is not configured.' }, { status: 500 })
  }

  let body: GenerateRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.answers || typeof body.answers !== 'object') {
    return NextResponse.json({ error: 'Missing answers in request body.' }, { status: 400 })
  }

  const prompt = buildPrompt(body.answers)

  const deepseek = createDeepSeek({ apiKey })

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      prompt,
      temperature: 0.3,
      maxOutputTokens: 8000,
    })

    return NextResponse.json({ content: text })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Generation failed: ${message}` }, { status: 500 })
  }
}
