import api from '@/lib/axios'
import type { DailyDashboard, WeeklySummary, CategoryBreakdown } from '@/types'

export const analyticsService = {
  dailyDashboard: (date?: string) =>
    api.get<DailyDashboard>('/analytics/daily-dashboard/', { params: { date } }).then((r) => r.data),
  weeklySummary: (weekStart?: string) =>
    api.get<WeeklySummary>('/analytics/weekly-summary/', { params: { week_start: weekStart } }).then((r) => r.data),
  categoryBreakdown: (date?: string) =>
    api.get<CategoryBreakdown>('/analytics/category-breakdown/', { params: { date } }).then((r) => r.data),
}
