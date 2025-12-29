# frozen_string_literal: true

class AddCustomWorkoutTypeToWorkouts < ActiveRecord::Migration[7.1]
  def change
    add_column :workouts, :custom_workout_type, :string, limit: 100
  end
end
