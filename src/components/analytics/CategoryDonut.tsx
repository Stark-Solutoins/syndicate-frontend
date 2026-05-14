import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useCategoryBreakdown } from '@/hooks/useCategoryBreakdown'
import { SkeletonCard } from '@/components/ui/LoadingSpinner'

interface CategoryDonutProps { date?: string }

export function CategoryDonut({ date }: CategoryDonutProps) {
  const { data, isLoading } = useCategoryBreakdown(date)

  if (isLoading) return <SkeletonCard />

  const cats = data?.categories ?? []

  return (
    <Card>
      <p className="text-xs uppercase tracking-widest text-text-muted mb-4">Category Breakdown</p>
      <div className="flex gap-4">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie data={cats} dataKey="percentage" cx="50%" cy="50%" innerRadius={35} outerRadius={55} strokeWidth={0}>
              {cats.map((c, i) => <Cell key={i} fill={c.color} />)}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="bg-bg-elevated border border-white/10 rounded-lg px-2 py-1">
                    <p className="text-xs text-text">{d.name}: {d.percentage}%</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2.5">
          {cats.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-text">{cat.name}</span>
                </div>
                <span className="text-xs text-text-muted tabular-nums">{cat.done}/{cat.total}</span>
              </div>
              <ProgressBar value={cat.percentage} color={cat.color} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
