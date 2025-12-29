# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.

puts "🌱 Seeding database..."

# Create demo user
demo_user = User.find_or_create_by!(email: "demo@fitstreak.app") do |user|
  user.name = "Demo User"
  user.password = "demo123456"
end

puts "✅ Created demo user: #{demo_user.email}"

# Create sample workouts for the last 30 days
workout_types = Workout::TYPES
durations = Workout::DURATIONS
feelings = Workout::FEELINGS.keys

# Generate realistic workout pattern (skip some days randomly)
30.downto(0) do |days_ago|
  date = Date.current - days_ago.days
  
  # Skip weekends sometimes (30% chance)
  next if date.saturday? && rand < 0.3
  next if date.sunday? && rand < 0.5
  
  # Skip some weekdays randomly (20% chance)
  next if rand < 0.2
  
  # Create workout
  Workout.find_or_create_by!(user: demo_user, date: date) do |workout|
    workout.workout_type = workout_types.sample
    workout.duration = durations.sample
    workout.feeling = feelings.sample
    workout.note = [
      "Hôm nay tập ok",
      "Mệt quá!",
      "Cảm thấy khỏe",
      "Chân hơi đau",
      "Tập với bạn, vui!",
      nil,
      nil
    ].sample
  end
end

puts "✅ Created #{demo_user.workouts.count} sample workouts"
puts "🔥 Current streak: #{demo_user.current_streak} days"
puts "🏆 Longest streak: #{demo_user.longest_streak} days"
puts ""
puts "📧 Demo login: demo@fitstreak.app / demo123456"
puts "🌱 Seeding completed!"
