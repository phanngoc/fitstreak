import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { workoutsApi } from '@/lib/api'
import {
  useWorkoutStore,
  WORKOUT_TYPES,
  DURATION_OPTIONS,
  FEELING_OPTIONS,
} from '@/stores/workoutStore'
import { cn } from '@/lib/utils'

interface CheckInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckInModal({ open, onOpenChange }: CheckInModalProps) {
  const [step, setStep] = useState(1)
  const [workoutType, setWorkoutType] = useState('')
  const [customWorkoutType, setCustomWorkoutType] = useState('')
  const [duration, setDuration] = useState(0)
  const [feeling, setFeeling] = useState(0)
  const [note, setNote] = useState('')
  
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { addWorkout, setTodayCompleted } = useWorkoutStore()

  const createWorkout = useMutation({
    mutationFn: () =>
      workoutsApi.create({
        workout_type: workoutType,
        duration,
        feeling,
        note: note || undefined,
        custom_workout_type: workoutType === 'other' ? customWorkoutType : undefined,
      }),
    onSuccess: (response) => {
      const workout = response.data.workout
      addWorkout(workout)
      setTodayCompleted(true)
      queryClient.invalidateQueries({ queryKey: ['streak'] })
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      
      toast({
        variant: 'success',
        title: '🎉 Tuyệt vời!',
        description: response.data.message,
      })
      
      // Reset and close
      resetForm()
      onOpenChange(false)
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể lưu buổi tập. Vui lòng thử lại.',
      })
    },
  })

  const resetForm = () => {
    setStep(1)
    setWorkoutType('')
    setCustomWorkoutType('')
    setDuration(0)
    setFeeling(0)
    setNote('')
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      createWorkout.mutate()
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        if (workoutType === 'other') {
          return customWorkoutType.trim() !== ''
        }
        return workoutType !== ''
      case 2:
        return duration > 0
      case 3:
        return feeling > 0
      case 4:
        return true // Note is optional
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {step === 1 && '🏋️ Bạn tập gì hôm nay?'}
            {step === 2 && '⏱️ Bạn tập bao lâu?'}
            {step === 3 && '💪 Cảm giác thế nào?'}
            {step === 4 && '📝 Ghi chú (tuỳ chọn)'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Workout Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {WORKOUT_TYPES.map((type) => (
                  <Card
                    key={type.value}
                    className={cn(
                      'cursor-pointer transition-all hover:scale-105',
                      workoutType === type.value &&
                        'ring-2 ring-primary bg-primary/5'
                    )}
                    onClick={() => setWorkoutType(type.value)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <span className="text-3xl mb-2">
                        {type.label.split(' ')[0]}
                      </span>
                      <span className="text-sm font-medium">
                        {type.label.split(' ').slice(1).join(' ')}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Custom workout type input when 'other' is selected */}
              {workoutType === 'other' && (
                <div className="space-y-2">
                  <Input
                    placeholder="Nhập loại bài tập (VD: Bơi lội, Cầu lông...)"
                    value={customWorkoutType}
                    onChange={(e) => setCustomWorkoutType(e.target.value)}
                    maxLength={100}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {customWorkoutType.length}/100 ký tự
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Duration */}
          {step === 2 && (
            <div className="grid grid-cols-3 gap-3">
              {DURATION_OPTIONS.map((opt) => (
                <Card
                  key={opt.value}
                  className={cn(
                    'cursor-pointer transition-all hover:scale-105',
                    duration === opt.value &&
                      'ring-2 ring-primary bg-primary/5'
                  )}
                  onClick={() => setDuration(opt.value)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <span className="text-xl font-bold">{opt.value}</span>
                    <span className="text-xs text-muted-foreground">phút</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 3: Feeling */}
          {step === 3 && (
            <div className="flex justify-center gap-4">
              {FEELING_OPTIONS.map((opt) => (
                <Card
                  key={opt.value}
                  className={cn(
                    'cursor-pointer transition-all hover:scale-110 flex-1',
                    feeling === opt.value &&
                      'ring-2 ring-primary bg-primary/5'
                  )}
                  onClick={() => setFeeling(opt.value)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <span className="text-5xl mb-2">{opt.emoji}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 4: Note */}
          {step === 4 && (
            <div className="space-y-4">
              <Input
                placeholder="VD: Hôm nay tập vai, cảm thấy khỏe..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-center">
                {note.length}/200 ký tự (không bắt buộc)
              </p>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                s === step
                  ? 'bg-primary'
                  : s < step
                  ? 'bg-primary/50'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Quay lại
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed() || createWorkout.isPending}
            className="flex-1"
          >
            {createWorkout.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : step === 4 ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Hoàn thành
              </>
            ) : (
              'Tiếp tục'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
