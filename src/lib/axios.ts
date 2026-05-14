import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        )
        useAuthStore.getState().setTokens(data.access, data.refresh ?? refreshToken)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
