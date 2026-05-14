import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useCurrentUser, useUpdateProfile, useLogout } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { format, parseISO } from 'date-fns'

interface ProfileForm {
  first_name: string
  last_name: string
  username: string
}

export default function SettingsPage() {
  const { data: user } = useCurrentUser()
  const updateMutation = useUpdateProfile()
  const logoutMutation = useLogout()

  const { register, handleSubmit, reset } = useForm<ProfileForm>()

  useEffect(() => {
    if (user) reset({ first_name: user.first_name, last_name: user.last_name, username: user.username })
  }, [user, reset])

  const onSubmit = (data: ProfileForm) => updateMutation.mutate(data)

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-black uppercase tracking-widest text-text">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your account.</p>
      </div>

      <Card>
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="Tony" {...register('first_name')} />
            <Input label="Last Name" placeholder="Soprano" {...register('last_name')} />
          </div>
          <Input label="Username" placeholder="tony_soprano" {...register('username')} />
          {user?.email && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1.5">Email</p>
              <p className="text-sm text-text-subtle bg-bg-surface border border-white/10 rounded-lg px-4 py-2.5">{user.email}</p>
            </div>
          )}
          <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Account</h2>
        {user?.date_joined && (
          <p className="text-sm text-text-muted mb-6">
            Member since{' '}
            <span className="text-text">{format(parseISO(user.date_joined), 'MMMM d, yyyy')}</span>
          </p>
        )}
        <Button variant="danger" onClick={() => logoutMutation.mutate()} loading={logoutMutation.isPending}>
          Sign Out
        </Button>
      </Card>
    </div>
  )
}
