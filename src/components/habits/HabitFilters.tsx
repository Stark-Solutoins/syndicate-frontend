import { Search } from 'lucide-react'
import type { Category } from '@/types'

interface HabitFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  categoryId: number | undefined
  onCategoryChange: (v: number | undefined) => void
  activeOnly: boolean
  onActiveOnlyChange: (v: boolean) => void
  categories: Category[]
}

export function HabitFilters({ search, onSearchChange, categoryId, onCategoryChange, activeOnly, onActiveOnlyChange, categories }: HabitFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
        <input
          type="text"
          placeholder="Search habits…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-bg-surface border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-text placeholder-text-subtle focus:outline-none focus:border-brand-gold/50 w-48 transition-colors"
        />
      </div>
      <select
        value={categoryId ?? ''}
        onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : undefined)}
        className="bg-bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-brand-gold/50 transition-colors"
      >
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer select-none">
        <input
          type="checkbox"
          checked={activeOnly}
          onChange={(e) => onActiveOnlyChange(e.target.checked)}
          className="accent-brand-gold"
        />
        Active only
      </label>
    </div>
  )
}
