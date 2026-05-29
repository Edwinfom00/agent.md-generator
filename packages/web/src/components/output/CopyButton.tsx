'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { RiFileCopyLine, RiCheckLine } from 'react-icons/ri'

interface CopyButtonProps {
  content: string
}

export function CopyButton({ content }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      icon={copied ? <RiCheckLine className="w-4 h-4 text-[var(--success)]" /> : <RiFileCopyLine className="w-4 h-4" />}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}
