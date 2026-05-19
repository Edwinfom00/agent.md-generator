'use client'

import { cn } from '@/lib/cn'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({ label, hint, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      )}
      {hint && (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      )}
      <textarea
        className={cn(
          'w-full min-h-[120px] rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3',
          'text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
          'resize-y transition-colors duration-200',
          'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
          'hover:border-[var(--border-hover)]',
          'code-block',
          error && 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--error)]">{error}</p>
      )}
    </div>
  )
}
