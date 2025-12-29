import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar, Trash2, Loader2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { workoutsApi } from '@/lib/api'
import { WORKOUT_TYPES } from '@/stores/workoutStore'

export default function HistoryPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch workouts
  const { data, isLoading } = useQuery({
    queryKey: ['workouts', selectedType],
    queryFn: () =>
      workoutsApi
        .list({ type: selectedType || undefined, limit: 50 })
        .then((res) => res.data),
  })

  // Delete workout
  const deleteMutation = useMutation({
    mutationFn: (id: number) => workoutsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      queryClient.invalidateQueries({ queryKey: ['streak'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast({
        title: 'Đã xóa buổi tập',
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa buổi tập',
      })
    },
  })

  // Group workouts by date
  const groupedWorkouts = data?.workouts?.reduce(
    (groups: Record<string, any[]>, workout: any) => {
      const date = workout.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(workout)
      return groups
    },
    {}
  )

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lịch sử tập luyện</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {data?.workouts?.length || 0} buổi tập
          </span>
        </div>
      </div>

      {/* Filter by type */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedType === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType(null)}
        >
          <Filter className="h-4 w-4 mr-1" />
          Tất cả
        </Button>
        {WORKOUT_TYPES.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!data?.workouts || data.workouts.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-muted-foreground">
              {selectedType
                ? 'Không có buổi tập nào với bộ lọc này'
                : 'Bạn chưa có buổi tập nào'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Workout list grouped by date */}
      {groupedWorkouts &&
        (Object.entries(groupedWorkouts) as [string, any[]][]).map(([date, workouts]) => (
          <Card key={date}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: vi })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workouts.map((workout: any) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{workout.feeling_emoji}</span>
                    <div>
                      <p className="font-semibold">{workout.workout_type_label}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.duration} phút • {workout.feeling_label}
                      </p>
                      {workout.note && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          "{workout.note}"
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa buổi tập này?')) {
                        deleteMutation.mutate(workout.id)
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
