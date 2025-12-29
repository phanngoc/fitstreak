# frozen_string_literal: true

class CreateWorkouts < ActiveRecord::Migration[7.1]
  def change
    create_table :workouts do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.string :workout_type, null: false  # gym, running, yoga, other
      t.integer :duration, null: false     # minutes: 15, 30, 45, 60, 90, 120
      t.integer :feeling, null: false      # 1: exhausted, 2: normal, 3: great
      t.text :note

      t.timestamps
    end

    add_index :workouts, [:user_id, :date]
    add_index :workouts, :date
    add_index :workouts, :workout_type
  end
end
