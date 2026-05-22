export interface ChatResult {
  content: string
  error?: string
}

export async function refineChatMessage(
  currentContent: string,
  instruction: string,
): Promise<ChatResult> {
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'update',
        existingContent: currentContent,
        changeDescription: instruction,
      }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      return { content: '', error: data.error ?? 'Generation failed' }
    }

    return { content: data.content }
  } catch (err) {
    return {
      content: '',
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
