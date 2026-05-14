import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  color: string
  className?: string
}

export function Badge({ label, color, className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border', className)}
      style={{ color, borderColor: color, backgroundColor: `${color}22` }}
    >
      {label}
    </span>
  )
}
