import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Smile, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { statsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function StatsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const monthString = format(currentMonth, 'yyyy-MM')

  // Fetch monthly stats
  const { data: monthlyData } = useQuery({
    queryKey: ['monthly', monthString],
    queryFn: () => statsApi.monthly(monthString).then((res) => res.data),
  })

  // Fetch weekly stats for the summary
  const { data: weeklyData } = useQuery({
    queryKey: ['weekly'],
    queryFn: () => statsApi.weekly().then((res) => res.data),
  })

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    if (next <= new Date()) {
      setCurrentMonth(next)
    }
  }

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get workout dates as a Set for quick lookup
  const workoutDates = new Set(monthlyData?.calendar?.map((w: any) => w.date) || [])

  // Calculate stats
  const summary = monthlyData?.summary || {}

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Thống kê</h1>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.total_workouts || 0}</p>
                <p className="text-xs text-muted-foreground">Buổi tập</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.total_duration || 0}</p>
                <p className="text-xs text-muted-foreground">Phút</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.workout_days || 0}</p>
                <p className="text-xs text-muted-foreground">Ngày tập</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Smile className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {summary.avg_feeling ? `${summary.avg_feeling}/3` : '-'}
                </p>
                <p className="text-xs text-muted-foreground">Cảm giác TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {format(currentMonth, 'MMMM yyyy', { locale: vi })}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              disabled={currentMonth >= new Date()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month start */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {days.map((day) => {
              const dateString = format(day, 'yyyy-MM-dd')
              const hasWorkout = workoutDates.has(dateString)
              const isTodayDate = isToday(day)
              const isFuture = day > new Date()

              return (
                <div
                  key={dateString}
                  className={cn(
                    'aspect-square flex items-center justify-center rounded-full text-sm transition-colors',
                    hasWorkout && 'bg-primary text-primary-foreground font-semibold',
                    isTodayDate && !hasWorkout && 'border-2 border-primary',
                    isFuture && 'text-muted-foreground/30',
                    !hasWorkout && !isTodayDate && !isFuture && 'hover:bg-muted'
                  )}
                >
                  {format(day, 'd')}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-muted-foreground">Đã tập</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full border-2 border-primary" />
              <span className="text-muted-foreground">Hôm nay</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Comparison */}
      {weeklyData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">So sánh tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Tuần này</p>
                <p className="text-2xl font-bold">{weeklyData.this_week?.count || 0} buổi</p>
                <p className="text-sm text-muted-foreground">
                  {weeklyData.this_week?.total_duration || 0} phút
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Tuần trước</p>
                <p className="text-2xl font-bold">{weeklyData.last_week?.count || 0} buổi</p>
                <p className="text-sm text-muted-foreground">
                  {weeklyData.last_week?.total_duration || 0} phút
                </p>
              </div>
            </div>
            {weeklyData.comparison && (
              <p className="text-center mt-4 text-sm">{weeklyData.comparison}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
