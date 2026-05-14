import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Category, Habit } from '@/types'

interface HabitForm {
  label: string
  slug: string
  category: string  // kept as string for select compatibility, converted on submit
  time: string
  order: number
  is_active: boolean
}

export interface HabitFormOutput {
  label: string
  slug: string
  category: number
  time: string
  order: number
  is_active: boolean
}

interface HabitModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: HabitFormOutput) => void
  categories: Category[]
  initialData?: Habit
  loading?: boolean
}

export function HabitModal({ open, onClose, onSubmit, categories, initialData, loading }: HabitModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<HabitForm>({
    defaultValues: {
      label: '',
      slug: '',
      category: '',
      time: '',
      order: 10,
      is_active: true,
    },
  })

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? { ...initialData, category: String(initialData.category) }
          : { label: '', slug: '', category: '', time: '', order: 10, is_active: true }
      )
    }
  }, [open, initialData, reset])

  const handleFormSubmit = (data: HabitForm) => {
    onSubmit({ ...data, category: Number(data.category), order: Number(data.order) })
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Habit' : 'New Habit'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Label"
          placeholder="e.g. Morning run"
          error={errors.label?.message}
          {...register('label', { required: 'Label is required' })}
        />
        <Input
          label="Slug"
          placeholder="e.g. morning_run"
          error={errors.slug?.message}
          {...register('slug', {
            required: 'Slug is required',
            pattern: { value: /^[a-z0-9_]+$/, message: 'Lowercase letters, numbers, underscores only' },
          })}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="bg-bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:border-brand-gold/50 transition-colors"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-brand-red">{errors.category.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Time" placeholder="5:00 AM" {...register('time')} />
          <Input label="Order" type="number" {...register('order', { valueAsNumber: true })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-text cursor-pointer select-none">
          <input type="checkbox" {...register('is_active')} className="accent-brand-gold w-4 h-4" />
          Active
        </label>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">{initialData ? 'Save Changes' : 'Create Habit'}</Button>
        </div>
      </form>
    </Modal>
  )
}
