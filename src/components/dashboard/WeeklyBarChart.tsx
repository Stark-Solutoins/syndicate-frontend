import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card } from '@/components/ui/Card'
import { percentageToRank } from '@/lib/utils'
import type { WeeklySummary } from '@/types'

interface WeeklyBarChartProps {
  data: WeeklySummary
  onDayClick?: (date: string) => void
  selectedDate?: string
}

export function WeeklyBarChart({ data, onDayClick, selectedDate }: WeeklyBarChartProps) {
  const chartData = data.days.map((d) => ({
    name: d.day_short,
    value: d.percentage,
    date: d.date,
    isToday: d.is_today,
    done: d.done,
    total: d.total,
  }))

  return (
    <Card>
      <p className="text-xs uppercase tracking-widest text-text-muted mb-4">This Week</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={chartData} barSize={28} onClick={(e) => { const ap = (e as unknown as { activePayload?: Array<{ payload: { date: string } }> })?.activePayload; if (ap) onDayClick?.(ap[0].payload.date) }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
          <YAxis hide domain={[0, 100]} />
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
              const rankColor = entry.value > 0 ? percentageToRank(entry.value).color : '#374151'
              const isSelected = entry.date === selectedDate
              return (
                <Cell
                  key={i}
                  fill={rankColor}
                  opacity={isSelected || entry.isToday ? 1 : 0.55}
                  style={{ cursor: 'pointer', filter: (isSelected || entry.isToday) ? `drop-shadow(0 0 6px ${rankColor}88)` : 'none' }}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
