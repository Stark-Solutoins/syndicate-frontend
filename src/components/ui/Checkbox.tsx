import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  color?: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, color = '#C9A84C', disabled = false }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
        'hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'border-0 animate-check-pop' : 'border-white/20 hover:border-white/40'
      )}
      style={checked ? { backgroundColor: color, boxShadow: `0 0 12px ${color}66` } : {}}
    >
      {checked && <Check size={14} color="#fff" strokeWidth={3} />}
    </button>
  )
}
