# frozen_string_literal: true

class Workout < ApplicationRecord
  belongs_to :user

  # Workout types
  TYPES = %w[gym running yoga other].freeze
  
  # Duration options (in minutes)
  DURATIONS = [15, 30, 45, 60, 90, 120].freeze
  
  # Feeling scale
  FEELINGS = {
    1 => { emoji: "😫", label: "Exhausted" },
    2 => { emoji: "😐", label: "Normal" },
    3 => { emoji: "😄", label: "Great" }
  }.freeze

  validates :date, presence: true
  validates :workout_type, presence: true, inclusion: { in: TYPES }
  validates :duration, presence: true, inclusion: { in: DURATIONS }
  validates :feeling, presence: true, inclusion: { in: FEELINGS.keys }
  validates :note, length: { maximum: 500 }
  validates :custom_workout_type, presence: true, if: -> { workout_type == 'other' }
  validates :custom_workout_type, length: { maximum: 100 }

  scope :today, -> { where(date: Date.current) }
  scope :this_week, -> { where(date: Date.current.beginning_of_week..Date.current.end_of_week) }
  scope :last_week, -> { where(date: (Date.current - 1.week).beginning_of_week..(Date.current - 1.week).end_of_week) }
  scope :this_month, -> { where(date: Date.current.beginning_of_month..Date.current.end_of_month) }
  scope :by_type, ->(type) { where(workout_type: type) if type.present? }
  scope :recent, -> { order(date: :desc, created_at: :desc) }

  def feeling_emoji
    FEELINGS[feeling][:emoji]
  end

  def feeling_label
    FEELINGS[feeling][:label]
  end

  def workout_type_label
    case workout_type
    when "gym" then "🏋️ Gym"
    when "running" then "🏃 Running"
    when "yoga" then "🧘 Yoga"
    when "other" then custom_workout_type.present? ? "💪 #{custom_workout_type}" : "💪 Other"
    end
  end
end
