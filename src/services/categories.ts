import api from '@/lib/axios'
import type { Category } from '@/types'

interface CategoryCreate { name: string; color: string; order: number }

export const categoriesService = {
  list: () => api.get<Category[]>('/categories/').then((r) => r.data),
  create: (data: CategoryCreate) => api.post<Category>('/categories/', data).then((r) => r.data),
  update: (id: number, data: Partial<CategoryCreate>) => api.patch<Category>(`/categories/${id}/`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/categories/${id}/`),
}
