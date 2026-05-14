import { HabitItem } from './HabitItem'
import { Card } from '@/components/ui/Card'
import { useToggleHabit } from '@/hooks/useToggle'
import type { DashboardHabit } from '@/types'

interface HabitListProps {
  habits: DashboardHabit[]
  date: string
}

interface GroupedHabits {
  categoryName: string
  categoryColor: string
  habits: DashboardHabit[]
}

function groupHabitsByCategory(habits: DashboardHabit[]): GroupedHabits[] {
  const map = new Map<string, GroupedHabits>()
  for (const habit of habits) {
    if (!map.has(habit.category_name)) {
      map.set(habit.category_name, { categoryName: habit.category_name, categoryColor: habit.category_color, habits: [] })
    }
    map.get(habit.category_name)!.habits.push(habit)
  }
  return Array.from(map.values())
}

export function HabitList({ habits, date }: HabitListProps) {
  const { mutate: toggle, isPending } = useToggleHabit(date)
  const groups = groupHabitsByCategory(habits)

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.08]">
        <p className="text-xs uppercase tracking-widest text-text-muted">Daily Habits</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {groups.map((group) => {
          const done = group.habits.filter((h) => h.completed).length
          return (
            <div key={group.categoryName}>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.02]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.categoryColor }} />
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{group.categoryName}</span>
                <span className="text-xs text-text-subtle ml-auto tabular-nums">{done}/{group.habits.length}</span>
              </div>
              <div className="px-2 py-1">
                {group.habits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onToggle={(id) => toggle({ habitId: id })}
                    disabled={isPending}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
