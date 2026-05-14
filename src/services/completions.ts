import api from '@/lib/axios'
import type { HabitCompletion, DayScore } from '@/types'

export const completionsService = {
  toggle: (habitId: number, date: string) =>
    api.post<HabitCompletion>('/completions/toggle/', { habit: habitId, date }).then((r) => r.data),
  dayScore: (date?: string) =>
    api.get<DayScore>('/completions/day-score/', { params: { date } }).then((r) => r.data),
}
