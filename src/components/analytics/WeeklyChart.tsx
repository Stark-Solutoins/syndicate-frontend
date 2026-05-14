import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { percentageToRank } from '@/lib/utils'
import { format, startOfWeek, addWeeks, subWeeks, parseISO } from 'date-fns'
import { useState } from 'react'
import { useWeeklySummary } from '@/hooks/useWeeklySummary'
import { SkeletonCard } from '@/components/ui/LoadingSpinner'

export function WeeklyChart() {
  const [weekStart, setWeekStart] = useState(() => format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'))
  const { data, isLoading } = useWeeklySummary(weekStart)

  const prev = () => setWeekStart(format(subWeeks(parseISO(weekStart), 1), 'yyyy-MM-dd'))
  const next = () => setWeekStart(format(addWeeks(parseISO(weekStart), 1), 'yyyy-MM-dd'))

  if (isLoading) return <SkeletonCard className="h-64" />

  const chartData = data?.days.map((d) => ({
    name: d.day_short,
    value: d.percentage,
    done: d.done,
    total: d.total,
    isToday: d.is_today,
  })) ?? []

  const weekEnd = format(addWeeks(parseISO(weekStart), 1), 'MMM d')
  const weekStartFmt = format(parseISO(weekStart), 'MMM d')

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs uppercase tracking-widest text-text-muted">Weekly Performance</p>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-1.5 rounded text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-text-muted min-w-[120px] text-center">{weekStartFmt} – {weekEnd}</span>
          <button onClick={next} className="p-1.5 rounded text-text-muted hover:text-text hover:bg-white/5 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            content={({ payload }) => {
              if (!payload?.length) return null
              const d = payload[0].payload
              return (
                <div className="bg-bg-elevated border border-white/10 rounded-lg px-3 py-2">
                  <p className="text-xs font-bold text-text">{d.name}: {d.value}%</p>
                  <p className="text-xs text-text-muted">{d.done}/{d.total} habits</p>
                </div>
              )
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => {
              const color = entry.value > 0 ? percentageToRank(entry.value).color : '#374151'
              return <Cell key={i} fill={color} opacity={entry.isToday ? 1 : 0.7} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
