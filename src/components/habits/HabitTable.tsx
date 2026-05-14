import { useState } from 'react'
import { MoreVertical, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Habit, Category } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface HabitTableProps {
  habits: Habit[]
  categories: Category[]
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onToggleActive: (habit: Habit) => void
}

function ActionMenu({ habit, onEdit, onDelete, onToggleActive }: { habit: Habit; onEdit: () => void; onDelete: () => void; onToggleActive: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-1.5 rounded text-text-muted hover:text-text hover:bg-white/5 transition-colors">
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-bg-elevated border border-white/10 rounded-lg py-1 w-40 shadow-xl">
            <button onClick={() => { onEdit(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text hover:bg-white/5 transition-colors">
              <Pencil size={12} /> Edit
            </button>
            <button onClick={() => { onToggleActive(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text hover:bg-white/5 transition-colors">
              {habit.is_active ? <ToggleLeft size={12} /> : <ToggleRight size={12} />}
              {habit.is_active ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => { onDelete(); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-red hover:bg-brand-red/5 transition-colors">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function HabitTable({ habits, categories, onEdit, onDelete, onToggleActive }: HabitTableProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-16 text-text-subtle">
        <p className="text-sm">No habits found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08]">
            {['Label', 'Category', 'Time', 'Order', 'Status', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-text-muted">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {habits.map((habit) => {
            const cat = categories.find((c) => c.id === habit.category)
            return (
              <tr key={habit.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-text font-medium">{habit.label}</td>
                <td className="px-4 py-3">
                  {cat && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-text-muted">{cat.name}</span>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-text-muted tabular-nums">{habit.time || '—'}</td>
                <td className="px-4 py-3 text-text-muted tabular-nums">{habit.order}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={habit.is_active ? 'Active' : 'Inactive'}
                    color={habit.is_active ? '#1e8c5a' : '#6B7280'}
                  />
                </td>
                <td className="px-4 py-3">
                  <ActionMenu habit={habit} onEdit={() => onEdit(habit)} onDelete={() => onDelete(habit)} onToggleActive={() => onToggleActive(habit)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
