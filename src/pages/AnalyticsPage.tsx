import { WeeklyChart } from '@/components/analytics/WeeklyChart'
import { CategoryDonut } from '@/components/analytics/CategoryDonut'
import { useWeeklySummary } from '@/hooks/useWeeklySummary'
import { percentageToRank } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

export default function AnalyticsPage() {
  const { data: weekly } = useWeeklySummary()

  const rankDistribution = weekly?.days.reduce<Record<string, number>>((acc, day) => {
    if (day.total === 0) return acc
    const rank = percentageToRank(day.percentage).label
    acc[rank] = (acc[rank] ?? 0) + 1
    return acc
  }, {}) ?? {}

  const rankColors: Record<string, string> = {
    'Don Status': '#C9A84C',
    'Made Man': '#2563a8',
    'Associate': '#1e8c5a',
    'Back to Work': '#c0392b',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black uppercase tracking-widest text-text">Analytics</h1>
        <p className="text-sm text-text-muted mt-1">Track your performance over time.</p>
      </div>

      <WeeklyChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonut />

        <Card>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-4">Rank Distribution (This Week)</p>
          <div className="space-y-3">
            {Object.entries(rankColors).map(([label, color]) => {
              const days = rankDistribution[label] ?? 0
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider w-28 flex-shrink-0" style={{ color }}>{label}</span>
                  <div className="flex-1 h-6 bg-white/[0.05] rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-700"
                      style={{ width: `${(days / 7) * 100}%`, backgroundColor: color, opacity: 0.7 }}
                    />
                  </div>
                  <span className="text-xs text-text-muted tabular-nums w-12 text-right">{days} day{days !== 1 ? 's' : ''}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
