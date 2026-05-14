import { useState } from 'react'
import { Plus, RefreshCw, ListChecks } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useHabits, useCreateHabit, useUpdateHabit, useDeleteHabit, useSeedHabits } from '@/hooks/useHabits'
import { useCategories } from '@/hooks/useCategories'
import { HabitTable } from '@/components/habits/HabitTable'
import { HabitModal, type HabitFormOutput } from '@/components/habits/HabitModal'
import { HabitFilters } from '@/components/habits/HabitFilters'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Habit } from '@/types'

function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.non_field_errors) return data.non_field_errors[0]
    if (data?.detail) return data.detail
    const first = Object.values(data ?? {})[0]
    if (Array.isArray(first)) return first[0]
  }
  return 'Something went wrong'
}

export default function HabitsPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [activeOnly, setActiveOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>()
  const [deletingHabit, setDeletingHabit] = useState<Habit | undefined>()

  const filters = {
    ...(categoryId !== undefined && { category: categoryId }),
    ...(activeOnly && { is_active: true }),
    ...(search && { search }),
  }
  const { data: habits, isLoading } = useHabits(filters)
  const { data: categories = [] } = useCategories()

  const createMutation = useCreateHabit()
  const updateMutation = useUpdateHabit()
  const deleteMutation = useDeleteHabit()
  const seedMutation = useSeedHabits()

  const openCreate = () => {
    setEditingHabit(undefined)
    setModalOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setModalOpen(true)
  }

  const handleSubmit = async (data: HabitFormOutput) => {
    try {
      if (editingHabit) {
        await updateMutation.mutateAsync({ id: editingHabit.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(extractApiError(error))
    }
  }

  const handleDelete = async () => {
    if (!deletingHabit) return
    try {
      await deleteMutation.mutateAsync(deletingHabit.id)
      setDeletingHabit(undefined)
    } catch {
      toast.error('Failed to delete habit')
    }
  }

  const handleToggleActive = (habit: Habit) => {
    updateMutation.mutate(
      { id: habit.id, data: { is_active: !habit.is_active } },
      { onError: () => toast.error('Failed to update habit') }
    )
  }

  const isEmpty = !isLoading && (habits?.length ?? 0) === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-widest text-text">Habits</h1>
          <p className="text-sm text-text-muted mt-1">
            {isLoading ? 'Loading…' : `${habits?.length ?? 0} habit${habits?.length !== 1 ? 's' : ''} configured`}
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => seedMutation.mutate()}
            loading={seedMutation.isPending}
          >
            <RefreshCw size={14} />
            Seed Defaults
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} />
            New Habit
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <HabitFilters
          search={search}
          onSearchChange={setSearch}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          activeOnly={activeOnly}
          onActiveOnlyChange={setActiveOnly}
          categories={categories}
        />
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
              <ListChecks size={24} className="text-brand-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text mb-1">No habits found</p>
              <p className="text-xs text-text-muted">
                {search || categoryId || activeOnly
                  ? 'Try adjusting your filters.'
                  : 'Seed the default habits or create your own to get started.'}
              </p>
            </div>
            {!search && !categoryId && !activeOnly && (
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={() => seedMutation.mutate()} loading={seedMutation.isPending}>
                  <RefreshCw size={13} /> Seed Defaults
                </Button>
                <Button size="sm" onClick={openCreate}>
                  <Plus size={13} /> New Habit
                </Button>
              </div>
            )}
          </div>
        ) : (
          <HabitTable
            habits={habits ?? []}
            categories={categories}
            onEdit={openEdit}
            onDelete={setDeletingHabit}
            onToggleActive={handleToggleActive}
          />
        )}
      </Card>

      {/* Create / Edit Modal */}
      <HabitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingHabit}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <Modal
        open={!!deletingHabit}
        onClose={() => setDeletingHabit(undefined)}
        title="Delete Habit"
      >
        <p className="text-sm text-text-muted mb-6">
          Are you sure you want to delete{' '}
          <strong className="text-text">"{deletingHabit?.label}"</strong>?{' '}
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeletingHabit(undefined)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
