import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { habitsService } from '@/services/habits'

interface HabitFilters {
  is_active?: boolean
  category?: number
  search?: string
}

export function useHabits(filters?: HabitFilters) {
  return useQuery({
    queryKey: ['habits', filters ?? {}],
    queryFn: () => habitsService.list(filters),
    staleTime: 60 * 1000,
  })
}

export function useSeedHabits() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsService.seed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Default habits seeded!')
    },
  })
}

export function useCreateHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Habit created')
    },
  })
}

export function useUpdateHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof habitsService.update>[1] }) =>
      habitsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Habit updated')
    },
  })
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: habitsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Habit deleted')
    },
  })
}
