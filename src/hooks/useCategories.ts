import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoriesService } from '@/services/categories'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.list,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created')
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof categoriesService.update>[1] }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoriesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted')
    },
  })
}
