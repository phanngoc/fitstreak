import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Home, History, BarChart3, LogOut, User, Flame } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/lib/api'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const { data: streakData } = useQuery({
    queryKey: ['streak'],
    queryFn: () => statsApi.streak().then((res) => res.data),
    refetchInterval: 60000, // Refetch every minute
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500 animate-fire" />
            <span className="font-bold text-lg">FitStreak</span>
            {streakData?.current_streak > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full text-sm font-semibold">
                🔥 {streakData.current_streak} ngày
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user?.name}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="flex items-center justify-around h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 text-xs ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Home className="h-5 w-5" />
            <span>Trang chủ</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 text-xs ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <History className="h-5 w-5" />
            <span>Lịch sử</span>
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 text-xs ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <BarChart3 className="h-5 w-5" />
            <span>Thống kê</span>
          </NavLink>
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-2 bg-background border rounded-full shadow-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">Trang chủ</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`
            }
          >
            <History className="h-4 w-4" />
            <span className="text-sm">Lịch sử</span>
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`
            }
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Thống kê</span>
          </NavLink>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-20 md:h-24" />
    </div>
  )
}
