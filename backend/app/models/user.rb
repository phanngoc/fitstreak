# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  has_many :workouts, dependent: :destroy

  validates :email, presence: true, 
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  before_save :downcase_email

  # Calculate current streak
  def current_streak
    dates = workouts.order(date: :desc).distinct.pluck(:date)
    return 0 if dates.empty?

    streak = 0
    current_date = Date.current

    # Check if worked out today or yesterday
    return 0 if dates.first < current_date - 1.day

    dates.each_with_index do |date, index|
      expected_date = current_date - index.days
      # Allow for today or starting from yesterday
      expected_date = current_date - 1.day - index.days if dates.first == current_date - 1.day

      break unless date == expected_date || (index == 0 && date >= current_date - 1.day)
      
      streak += 1
    end

    streak
  end

  # Calculate longest streak ever
  def longest_streak
    dates = workouts.order(date: :asc).distinct.pluck(:date)
    return 0 if dates.empty?

    max_streak = 1
    current_streak = 1

    dates.each_cons(2) do |prev_date, curr_date|
      if curr_date == prev_date + 1.day
        current_streak += 1
        max_streak = [max_streak, current_streak].max
      else
        current_streak = 1
      end
    end

    max_streak
  end

  private

  def downcase_email
    self.email = email.downcase
  end
end
