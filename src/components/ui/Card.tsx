import { cn } from '@/lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  active?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = false, active = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border bg-[var(--surface)] border-[var(--border)] p-4',
        hover && 'cursor-pointer transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]',
        active && 'border-[var(--accent)] bg-[var(--accent-dim)] shadow-sm shadow-[var(--accent-border)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
