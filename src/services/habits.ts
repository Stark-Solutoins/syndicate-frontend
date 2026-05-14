import api from '@/lib/axios'
import type { Habit } from '@/types'

interface HabitFilters {
  is_active?: boolean
  category?: number
  search?: string
  ordering?: string
}

interface HabitCreate {
  slug: string
  label: string
  category: number
  time: string
  order: number
  is_active: boolean
}

export const habitsService = {
  list: (params?: HabitFilters) => api.get<Habit[]>('/habits/', { params }).then((r) => r.data),
  seed: () => api.post<Habit[]>('/habits/seed/').then((r) => r.data),
  create: (data: HabitCreate) => api.post<Habit>('/habits/', data).then((r) => r.data),
  update: (id: number, data: Partial<HabitCreate>) => api.patch<Habit>(`/habits/${id}/`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/habits/${id}/`),
}
