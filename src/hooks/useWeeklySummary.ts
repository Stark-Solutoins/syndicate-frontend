import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics'

export function useWeeklySummary(weekStart?: string) {
  return useQuery({
    queryKey: ['weekly-summary', weekStart ?? 'current'],
    queryFn: () => analyticsService.weeklySummary(weekStart),
    staleTime: 60 * 1000,
  })
}
