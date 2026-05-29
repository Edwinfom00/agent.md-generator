'use client'

import { Button } from '@/components/ui/Button'
import { RiDownloadLine } from 'react-icons/ri'

interface DownloadButtonProps {
  content: string
  filename?: string
}

export function DownloadButton({ content, filename = 'AGENT.md' }: DownloadButtonProps) {
  function handleDownload() {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      onClick={handleDownload}
      icon={<RiDownloadLine className="w-4 h-4" />}
      size="sm"
    >
      Download AGENT.md
    </Button>
  )
}
