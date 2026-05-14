import { cn } from '@/lib/utils'

interface CardProps { className?: string; children: React.ReactNode }

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('bg-bg-card border border-white/[0.08] rounded-xl p-6', className)}>
      {children}
    </div>
  )
}
