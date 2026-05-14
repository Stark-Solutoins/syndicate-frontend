import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-bg-surface border rounded-lg px-4 py-2.5 text-text placeholder-text-subtle text-sm',
            'focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold/50',
            'transition-colors duration-150',
            error ? 'border-brand-red' : 'border-white/10',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-brand-red">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
