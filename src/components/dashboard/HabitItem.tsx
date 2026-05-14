import { Checkbox } from '@/components/ui/Checkbox'
import { cn } from '@/lib/utils'
import type { DashboardHabit } from '@/types'

interface HabitItemProps {
  habit: DashboardHabit
  onToggle: (id: number) => void
  disabled?: boolean
}

export function HabitItem({ habit, onToggle, disabled }: HabitItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent',
        'hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-150 group',
        habit.completed && 'opacity-60'
      )}
    >
      <Checkbox
        checked={habit.completed}
        onChange={() => onToggle(habit.id)}
        color={habit.category_color}
        disabled={disabled}
      />
      <div className="flex-1 min-w-0">
        <span className={cn('text-sm text-text transition-all duration-200', habit.completed && 'line-through text-text-subtle')}>
          {habit.label}
        </span>
      </div>
      {habit.time && (
        <span className="text-xs text-text-subtle tabular-nums flex-shrink-0">{habit.time}</span>
      )}
    </div>
  )
}
