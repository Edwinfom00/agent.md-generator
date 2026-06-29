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

    if (!res.ok) {
      let errorMsg = `Generation failed (Status ${res.status})`
      try {
        const errData = await res.clone().json()
        if (errData.error) errorMsg = errData.error
      } catch {
        try {
          const text = await res.text()
          if (text) errorMsg = `${errorMsg}: ${text.slice(0, 100)}`
        } catch {}
      }
      return { content: '', error: errorMsg }
    }

    const data = await res.json()
    if (data.error) {
      return { content: '', error: data.error }
    }

    return { content: data.content }
  } catch (err) {
    return {
      content: '',
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
