import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useRegister } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import axios from 'axios'

interface RegisterForm {
  username: string
  email: string
  password: string
  password_confirm: string
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const registerMutation = useRegister()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errs = error.response?.data
        if (errs?.non_field_errors) toast.error(errs.non_field_errors[0])
        else if (errs?.detail) toast.error(errs.detail)
        else if (errs?.username) toast.error(errs.username[0])
        else if (errs?.email) toast.error(errs.email[0])
        else if (errs?.password) toast.error(errs.password[0])
        else toast.error('Registration failed.')
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
          <p className="text-text-muted text-sm mt-4 italic">"Earn your place in the family."</p>
        </div>

        <div className="bg-bg-card border border-white/[0.08] rounded-xl p-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Create Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              placeholder="tony_soprano"
              error={errors.username?.message}
              {...register('username', { required: 'Username is required' })}
            />
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
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.password_confirm?.message}
              {...register('password_confirm', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            <Button type="submit" size="lg" loading={registerMutation.isPending} className="w-full mt-2">
              Join the Family
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already a member?{' '}
          <Link to="/login" className="text-brand-gold hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
