import { createDeepSeek } from '@ai-sdk/deepseek'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/buildPrompt'
import { buildUpdatePrompt } from '@/lib/buildUpdatePrompt'
import { validateOutput } from '@/lib/validateOutput'
import type { GenerateRequest } from '@/types'

const ratelimit =
  process.env['UPSTASH_REDIS_REST_URL'] && process.env['UPSTASH_REDIS_REST_TOKEN']
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, '1 h'),
        analytics: false,
      })
    : null

export async function POST(req: NextRequest) {
  const apiKey = process.env['DEEPSEEK_API_KEY']

  if (!apiKey) {
    return NextResponse.json({ error: 'DEEPSEEK_API_KEY is not configured.' }, { status: 500 })
  }

  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Too many requests. You can generate up to 5 AGENT.md files per hour.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(reset),
          },
        }
      )
    }
  }

  let body: GenerateRequest

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  let prompt: string

  if (body.mode === 'update') {
    if (!body.existingContent || typeof body.existingContent !== 'string') {
      return NextResponse.json({ error: 'Missing existingContent.' }, { status: 400 })
    }
    if (!body.changeDescription || typeof body.changeDescription !== 'string') {
      return NextResponse.json({ error: 'Missing changeDescription.' }, { status: 400 })
    }
    prompt = buildUpdatePrompt(body.existingContent, body.changeDescription)
  } else {
    if (!body.answers || typeof body.answers !== 'object') {
      return NextResponse.json({ error: 'Missing answers in request body.' }, { status: 400 })
    }
    prompt = buildPrompt(body.answers)
  }

  const deepseek = createDeepSeek({ apiKey })

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      prompt,
      temperature: 0.3,
      maxOutputTokens: 8000,
    })

    const { warnings } = validateOutput(text)
    return NextResponse.json({ content: text, ...(warnings.length > 0 && { warnings }) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Generation failed: ${message}` }, { status: 500 })
  }
}
