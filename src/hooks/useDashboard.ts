import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics'

export function useDashboard(date: string) {
  return useQuery({
    queryKey: ['dashboard', date],
    queryFn: () => analyticsService.dailyDashboard(date),
    staleTime: 30 * 1000,
  })
}
