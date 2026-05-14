import { ProgressBar } from '@/components/ui/ProgressBar'
import { Card } from '@/components/ui/Card'
import type { DashboardCategory } from '@/types'

interface CategoryRowProps { categories: DashboardCategory[] }

export function CategoryRow({ categories }: CategoryRowProps) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-widest text-text-muted mb-4">Category Progress</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-bg-surface rounded-lg p-3 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-xs font-semibold text-text truncate">{cat.name}</span>
            </div>
            <p className="text-lg font-black text-text tabular-nums">{cat.done}<span className="text-xs text-text-muted font-normal">/{cat.total}</span></p>
            <ProgressBar value={cat.percentage} color={cat.color} className="mt-2" />
          </div>
        ))}
      </div>
    </Card>
  )
}
