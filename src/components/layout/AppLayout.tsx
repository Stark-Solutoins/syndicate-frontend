import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
