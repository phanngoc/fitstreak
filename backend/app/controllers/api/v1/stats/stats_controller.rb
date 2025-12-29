# frozen_string_literal: true

module Api
  module V1
    module Stats
      class StatsController < ApplicationController
        # GET /api/v1/stats/streak
        def streak
          render json: {
            current_streak: current_user.current_streak,
            longest_streak: current_user.longest_streak,
            streak_message: streak_message(current_user.current_streak)
          }
        end

        # GET /api/v1/stats/weekly
        def weekly
          this_week = current_user.workouts.this_week
          last_week = current_user.workouts.last_week

          this_week_stats = calculate_week_stats(this_week)
          last_week_stats = calculate_week_stats(last_week)

          render json: {
            this_week: this_week_stats,
            last_week: last_week_stats,
            comparison: generate_comparison(this_week_stats, last_week_stats),
            days: generate_week_days(this_week)
          }
        end

        # GET /api/v1/stats/monthly
        def monthly
          month = params[:month] ? Date.parse("#{params[:month]}-01") : Date.current
          
          workouts = current_user.workouts
                                 .where(date: month.beginning_of_month..month.end_of_month)
                                 .group(:date)
                                 .select("date, COUNT(*) as workout_count, SUM(duration) as total_duration, AVG(feeling) as avg_feeling")

          calendar_data = workouts.map do |w|
            {
              date: w.date,
              workout_count: w.workout_count,
              total_duration: w.total_duration,
              avg_feeling: w.avg_feeling.round(1)
            }
          end

          render json: {
            month: month.strftime("%Y-%m"),
            calendar: calendar_data,
            summary: {
              total_workouts: current_user.workouts.where(date: month.beginning_of_month..month.end_of_month).count,
              total_duration: current_user.workouts.where(date: month.beginning_of_month..month.end_of_month).sum(:duration),
              workout_days: calendar_data.size,
              avg_feeling: current_user.workouts.where(date: month.beginning_of_month..month.end_of_month).average(:feeling)&.round(1) || 0
            }
          }
        end

        # GET /api/v1/stats/comparison
        def comparison
          this_week = current_user.workouts.this_week
          last_week = current_user.workouts.last_week

          this_week_duration = this_week.sum(:duration)
          last_week_duration = last_week.sum(:duration)

          if last_week_duration.zero?
            percentage_change = this_week_duration.positive? ? 100 : 0
          else
            percentage_change = ((this_week_duration - last_week_duration).to_f / last_week_duration * 100).round
          end

          render json: {
            this_week_duration: this_week_duration,
            last_week_duration: last_week_duration,
            percentage_change: percentage_change,
            message: comparison_message(percentage_change),
            insight: generate_insight(current_user)
          }
        end

        private

        def calculate_week_stats(workouts)
          {
            count: workouts.count,
            total_duration: workouts.sum(:duration),
            avg_duration: workouts.average(:duration)&.round || 0,
            avg_feeling: workouts.average(:feeling)&.round(1) || 0,
            types: workouts.group(:workout_type).count
          }
        end

        def generate_week_days(workouts)
          week_start = Date.current.beginning_of_week
          workout_dates = workouts.pluck(:date).uniq
          
          (0..6).map do |i|
            date = week_start + i.days
            {
              date: date,
              day_name: date.strftime("%a"),
              completed: workout_dates.include?(date),
              is_today: date == Date.current,
              is_future: date > Date.current
            }
          end
        end

        def generate_comparison(this_week, last_week)
          return "Tuần đầu tiên của bạn! Hãy tiếp tục! 🚀" if last_week[:count].zero?
          
          diff = this_week[:count] - last_week[:count]
          
          if diff.positive?
            "Tuần này bạn tập nhiều hơn #{diff} buổi so với tuần trước! 📈"
          elsif diff.negative?
            "Tuần này bạn tập ít hơn #{diff.abs} buổi so với tuần trước. Cố gắng lên! 💪"
          else
            "Bạn duy trì tốt số buổi tập như tuần trước! 👍"
          end
        end

        def streak_message(streak)
          case streak
          when 0
            "Hãy bắt đầu buổi tập đầu tiên hôm nay! 🎯"
          when 1..2
            "Khởi đầu tốt! Tiếp tục nhé! 🌱"
          when 3..6
            "Đang tiến bộ rõ rệt! 🔥"
          when 7..13
            "Một tuần liên tục! Tuyệt vời! 🏆"
          when 14..29
            "Wow! #{streak} ngày liên tục! Bạn là người kiên trì! 💪"
          else
            "#{streak} ngày! Bạn là huyền thoại! 🌟"
          end
        end

        def comparison_message(percentage)
          if percentage > 20
            "Hôm nay bạn tập tốt hơn #{percentage}% so với tuần trước! 🎉"
          elsif percentage > 0
            "Bạn đang tiến bộ #{percentage}% so với tuần trước 📈"
          elsif percentage == 0
            "Bạn duy trì phong độ ổn định 👍"
          elsif percentage > -20
            "Tuần này hơi chậm lại #{percentage.abs}%, nhưng không sao! 💪"
          else
            "Tuần này cần cố gắng hơn! Mọi bước nhỏ đều đáng giá 🌱"
          end
        end

        def generate_insight(user)
          workouts = user.workouts.where(date: 2.weeks.ago..Date.current)
          
          return nil if workouts.count < 3

          # Find best workout type
          best_type = workouts.group(:workout_type)
                              .average(:feeling)
                              .max_by { |_, v| v }

          if best_type
            type_label = Workout::TYPES.include?(best_type[0]) ? best_type[0] : "other"
            "Bạn có xu hướng cảm thấy tốt nhất khi tập #{type_label}! 💡"
          end
        end
      end
    end
  end
end
