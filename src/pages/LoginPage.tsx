import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLogin } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import axios from 'axios'

interface LoginForm { email: string; password: string }

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const login = useLogin()

  const onSubmit = async (data: LoginForm) => {
    try {
      await login.mutateAsync(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errs = error.response?.data
        if (errs?.non_field_errors) toast.error(errs.non_field_errors[0])
        else if (errs?.detail) toast.error(errs.detail)
        else toast.error('Login failed. Check your credentials.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold tracking-[0.4em] text-text-subtle uppercase mb-1">The</p>
          <h1 className="text-4xl font-black tracking-[0.15em] uppercase text-brand-gold">Syndicate</h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-text-subtle uppercase mt-1">Protocol</p>
          <p className="text-text-muted text-sm mt-4 italic">"Discipline is the real don."</p>
        </div>

        <div className="bg-bg-card border border-white/[0.08] rounded-xl p-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Sign In</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tony@soprano.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />
            <Button type="submit" size="lg" loading={login.isPending} className="w-full mt-2">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          New to the family?{' '}
          <Link to="/register" className="text-brand-gold hover:underline font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
