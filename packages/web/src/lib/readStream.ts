export async function readStream(
  res: Response,
  onChunk?: (text: string) => void,
): Promise<string> {
  const reader = res.body?.getReader()
  if (!reader) {
    throw new Error('Response body is not readable')
  }

  const decoder = new TextDecoder()
  let content = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      content += chunk
      if (onChunk) onChunk(chunk)
    }
  } finally {
    reader.releaseLock()
  }

  return content
}
