import { create } from 'zustand'

export interface Workout {
  id: number
  date: string
  workout_type: string
  duration: number
  feeling: number
  feeling_emoji: string
  feeling_label: string
  workout_type_label: string
  note?: string
  formatted_date: string
  day_name: string
}

interface WorkoutState {
  workouts: Workout[]
  isCheckingIn: boolean
  todayCompleted: boolean
  setWorkouts: (workouts: Workout[]) => void
  addWorkout: (workout: Workout) => void
  updateWorkout: (id: number, workout: Partial<Workout>) => void
  deleteWorkout: (id: number) => void
  setCheckingIn: (value: boolean) => void
  setTodayCompleted: (value: boolean) => void
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  isCheckingIn: false,
  todayCompleted: false,
  setWorkouts: (workouts) => set({ workouts }),
  addWorkout: (workout) =>
    set((state) => ({
      workouts: [workout, ...state.workouts],
      todayCompleted: true,
    })),
  updateWorkout: (id, workoutData) =>
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === id ? { ...w, ...workoutData } : w
      ),
    })),
  deleteWorkout: (id) =>
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    })),
  setCheckingIn: (value) => set({ isCheckingIn: value }),
  setTodayCompleted: (value) => set({ todayCompleted: value }),
}))

// Workout type options
export const WORKOUT_TYPES = [
  { value: 'gym', label: '🏋️ Gym', color: 'bg-blue-500' },
  { value: 'running', label: '🏃 Chạy bộ', color: 'bg-green-500' },
  { value: 'yoga', label: '🧘 Yoga', color: 'bg-purple-500' },
  { value: 'other', label: '💪 Khác', color: 'bg-orange-500' },
]

// Duration options (minutes)
export const DURATION_OPTIONS = [
  { value: 15, label: '15 phút' },
  { value: 30, label: '30 phút' },
  { value: 45, label: '45 phút' },
  { value: 60, label: '1 tiếng' },
  { value: 90, label: '1.5 tiếng' },
  { value: 120, label: '2 tiếng' },
]

// Feeling options
export const FEELING_OPTIONS = [
  { value: 1, emoji: '😫', label: 'Kiệt sức' },
  { value: 2, emoji: '😐', label: 'Bình thường' },
  { value: 3, emoji: '😄', label: 'Tuyệt vời!' },
]
