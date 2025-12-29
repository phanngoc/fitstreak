# frozen_string_literal: true

class WorkoutSerializer
  include JSONAPI::Serializer

  attributes :id, :date, :workout_type, :duration, :feeling, :note, :created_at

  attribute :feeling_emoji do |workout|
    workout.feeling_emoji
  end

  attribute :feeling_label do |workout|
    workout.feeling_label
  end

  attribute :workout_type_label do |workout|
    workout.workout_type_label
  end

  attribute :formatted_date do |workout|
    workout.date.strftime("%d/%m/%Y")
  end

  attribute :day_name do |workout|
    I18n.l(workout.date, format: "%A") rescue workout.date.strftime("%A")
  end
end
