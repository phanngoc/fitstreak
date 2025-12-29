import { Flame, Trophy, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StreakCardProps {
  currentStreak: number
  longestStreak: number
  totalWorkouts: number
  message?: string
}

export function StreakCard({
  currentStreak,
  longestStreak,
  totalWorkouts,
  message,
}: StreakCardProps) {
  const isOnFire = currentStreak >= 7

  return (
    <Card className={cn(
      'overflow-hidden',
      isOnFire && 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950'
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-3 rounded-full',
              isOnFire 
                ? 'bg-gradient-to-br from-orange-400 to-red-500 animate-pulse-glow' 
                : 'bg-primary/10'
            )}>
              <Flame className={cn(
                'h-8 w-8',
                isOnFire ? 'text-white animate-fire' : 'text-primary'
              )} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  'text-4xl font-bold',
                  isOnFire && 'text-orange-600 dark:text-orange-400'
                )}>
                  {currentStreak}
                </span>
                <span className="text-muted-foreground">ngày liên tục</span>
              </div>
              {message && (
                <p className="text-sm text-muted-foreground mt-1">{message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">Kỷ lục</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">Tổng buổi tập</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface WeekProgressProps {
  days: Array<{
    date: string
    day_name: string
    completed: boolean
    is_today: boolean
    is_future: boolean
  }>
}

export function WeekProgress({ days }: WeekProgressProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Tuần này</h3>
        </div>
        
        <div className="flex justify-between">
          {days.map((day) => (
            <div
              key={day.date}
              className="flex flex-col items-center gap-2"
            >
              <span className={cn(
                'text-xs',
                day.is_today ? 'font-bold text-primary' : 'text-muted-foreground'
              )}>
                {day.day_name}
              </span>
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                  day.completed
                    ? 'bg-primary text-primary-foreground'
                    : day.is_today
                    ? 'border-2 border-primary border-dashed'
                    : day.is_future
                    ? 'bg-muted/30'
                    : 'bg-muted'
                )}
              >
                {day.completed && '✓'}
                {day.is_today && !day.completed && '?'}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ tuần này</span>
            <span className="font-semibold">
              {days.filter((d) => d.completed).length}/7 ngày
            </span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${(days.filter((d) => d.completed).length / 7) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ComparisonCardProps {
  percentage: number
  message: string
  insight?: string
}

export function ComparisonCard({ percentage, message, insight }: ComparisonCardProps) {
  const isPositive = percentage >= 0

  return (
    <Card className={cn(
      isPositive 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
        : 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950'
    )}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className={cn(
            'h-6 w-6',
            isPositive ? 'text-green-600' : 'text-yellow-600'
          )} />
          <span className={cn(
            'text-2xl font-bold',
            isPositive ? 'text-green-600' : 'text-yellow-600'
          )}>
            {isPositive ? '+' : ''}{percentage}%
          </span>
        </div>
        <p className="text-sm">{message}</p>
        {insight && (
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            💡 {insight}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
