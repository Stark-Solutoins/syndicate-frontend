interface ProgressBarProps {
  value: number
  color?: string
  className?: string
}

export function ProgressBar({ value, color = '#C9A84C', className = '' }: ProgressBarProps) {
  return (
    <div className={`h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  )
}
