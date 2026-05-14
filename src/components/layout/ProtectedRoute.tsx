import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { refreshToken } = useAuthStore()
  if (!refreshToken) return <Navigate to="/login" replace />
  return <>{children}</>
}
