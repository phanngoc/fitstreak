import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckInModal } from '@/components/CheckInModal'
import { StreakCard, WeekProgress, ComparisonCard } from '@/components/StreakCard'
import { statsApi, authApi, workoutsApi } from '@/lib/api'
import { useWorkoutStore } from '@/stores/workoutStore'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [showCheckIn, setShowCheckIn] = useState(false)
  const { setTodayCompleted, todayCompleted } = useWorkoutStore()

  // Fetch user stats
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.me().then((res) => res.data),
  })

  // Fetch streak
  const { data: streakData } = useQuery({
    queryKey: ['streak'],
    queryFn: () => statsApi.streak().then((res) => res.data),
  })

  // Fetch weekly stats
  const { data: weeklyData } = useQuery({
    queryKey: ['weekly'],
    queryFn: () => statsApi.weekly().then((res) => res.data),
  })

  // Fetch comparison
  const { data: comparisonData } = useQuery({
    queryKey: ['comparison'],
    queryFn: () => statsApi.comparison().then((res) => res.data),
  })

  // Check if today is completed
  const { data: todayWorkouts } = useQuery({
    queryKey: ['workouts', 'today'],
    queryFn: () => workoutsApi.list({ limit: 1 }).then((res) => {
      const hasToday = res.data.meta?.today_completed
      setTodayCompleted(hasToday)
      return res.data
    }),
  })

  return (
    <div className="space-y-6 pb-20">
      {/* Main Check-in Button */}
      <Card className={cn(
        'overflow-hidden transition-all',
        todayCompleted 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200'
          : 'bg-gradient-to-br from-primary/5 to-primary/10'
      )}>
        <CardContent className="p-8 text-center">
          {todayCompleted ? (
            <>
              <div className="text-5xl mb-4 animate-check-in">✅</div>
              <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                Hôm nay bạn đã tập rồi!
              </h2>
              <p className="text-muted-foreground mb-4">
                Tuyệt vời! Hẹn gặp lại ngày mai 💪
              </p>
              <Button variant="outline" onClick={() => setShowCheckIn(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm buổi tập khác
              </Button>
            </>
          ) : (
            <>
              <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Hôm nay tập chưa? 🤔</h2>
              <p className="text-muted-foreground mb-6">
                Check-in buổi tập chỉ mất 15 giây!
              </p>
              <Button
                size="xl"
                className="animate-pulse-glow"
                onClick={() => setShowCheckIn(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Đã tập hôm nay!
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Streak Card */}
      {streakData && userData && (
        <StreakCard
          currentStreak={streakData.current_streak}
          longestStreak={streakData.longest_streak}
          totalWorkouts={userData.stats?.total_workouts || 0}
          message={streakData.streak_message}
        />
      )}

      {/* Week Progress */}
      {weeklyData?.days && <WeekProgress days={weeklyData.days} />}

      {/* Comparison Card */}
      {comparisonData && (
        <ComparisonCard
          percentage={comparisonData.percentage_change}
          message={comparisonData.message}
          insight={comparisonData.insight}
        />
      )}

      {/* Recent Workouts Preview */}
      {todayWorkouts?.workouts?.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Buổi tập gần nhất</h3>
            <div className="space-y-3">
              {todayWorkouts.workouts.slice(0, 3).map((workout: any) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{workout.feeling_emoji}</span>
                    <div>
                      <p className="font-medium">{workout.workout_type_label}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.formatted_date} • {workout.duration} phút
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check-in Modal */}
      <CheckInModal open={showCheckIn} onOpenChange={setShowCheckIn} />
    </div>
  )
}
