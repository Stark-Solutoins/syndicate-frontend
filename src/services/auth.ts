import api from '@/lib/axios'
import type { AuthResponse, User } from '@/types'

export const authService = {
  register: (data: { username: string; email: string; password: string; password_confirm: string }) =>
    api.post<AuthResponse>('/auth/register/', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login/', data).then((r) => r.data),
  logout: (refresh: string) => api.post('/auth/logout/', { refresh }),
  me: () => api.get<User>('/auth/me/').then((r) => r.data),
  updateMe: (data: Partial<Pick<User, 'username' | 'first_name' | 'last_name'>>) =>
    api.patch<User>('/auth/me/update/', data).then((r) => r.data),
}
