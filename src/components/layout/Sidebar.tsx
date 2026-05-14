import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart3, ListChecks, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/habits', icon: ListChecks, label: 'Habits' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { user } = useAuthStore()
  const logout = useLogout()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bg-surface border-r border-white/[0.08] flex flex-col z-40">
      <div className="px-6 py-8 border-b border-white/[0.08]">
        <p className="text-[10px] font-bold tracking-[0.3em] text-text-subtle uppercase">The</p>
        <h1 className="text-xl font-black tracking-[0.15em] uppercase text-brand-gold leading-tight">Syndicate</h1>
        <p className="text-[10px] font-bold tracking-[0.3em] text-text-subtle uppercase">Protocol</p>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            <span className="tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/[0.08]">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
              <span className="text-xs font-bold text-brand-gold">
                {(user.first_name || user.username).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text truncate">
                {user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}
              </p>
              <p className="text-xs text-text-subtle truncate">{user.username}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout.mutate()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all duration-150"
        >
          <LogOut size={14} />
          <span className="tracking-wide font-medium uppercase">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
