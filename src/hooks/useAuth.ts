import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth'
import { habitsService } from '@/services/habits'
import { useAuthStore } from '@/stores/authStore'

export function useCurrentUser() {
  const { refreshToken } = useAuthStore()
  return useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
    enabled: !!refreshToken,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const { setTokens, setUser } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
      setUser(data.user)
      navigate('/dashboard')
    },
  })
}

export function useRegister() {
  const { setTokens, setUser } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      setTokens(data.access, data.refresh)
      setUser(data.user)
      try {
        await habitsService.seed()
      } catch {
        // non-fatal
      }
      navigate('/dashboard')
    },
  })
}

export function useLogout() {
  const { refreshToken, logout } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(refreshToken!),
    onSettled: () => {
      logout()
      queryClient.clear()
      navigate('/login')
      toast.success('Logged out successfully')
    },
  })
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.updateMe,
    onSuccess: (data) => {
      setUser(data)
      queryClient.setQueryData(['me'], data)
      toast.success('Profile updated')
    },
  })
}
