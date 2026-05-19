'use client'

import { cn } from '@/lib/cn'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      )}
      {hint && (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      )}
      <input
        className={cn(
          'w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4',
          'text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
          'transition-colors duration-200',
          'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
          'hover:border-[var(--border-hover)]',
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
