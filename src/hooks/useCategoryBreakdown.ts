import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics'

export function useCategoryBreakdown(date?: string) {
  return useQuery({
    queryKey: ['category-breakdown', date ?? 'today'],
    queryFn: () => analyticsService.categoryBreakdown(date),
    staleTime: 30 * 1000,
  })
}
