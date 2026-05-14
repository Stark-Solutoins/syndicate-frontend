import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { completionsService } from '@/services/completions'
import { recalculateScore } from '@/lib/utils'
import type { DailyDashboard } from '@/types'

export function useToggleHabit(date: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId }: { habitId: number }) =>
      completionsService.toggle(habitId, date),

    onMutate: async ({ habitId }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard', date] })
      const previous = queryClient.getQueryData<DailyDashboard>(['dashboard', date])

      if (previous) {
        const newScore = recalculateScore(previous.habits, habitId)
        queryClient.setQueryData<DailyDashboard>(['dashboard', date], {
          ...previous,
          habits: previous.habits.map((h) =>
            h.id === habitId ? { ...h, completed: !h.completed } : h
          ),
          score: { ...previous.score, ...newScore },
        })
      }
      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['dashboard', date], context.previous)
      }
      toast.error('Failed to update habit')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', date] })
      queryClient.invalidateQueries({ queryKey: ['weekly-summary'] })
    },
  })
}
