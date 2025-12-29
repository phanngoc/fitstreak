# frozen_string_literal: true

module Api
  module V1
    class WorkoutsController < ApplicationController
      before_action :set_workout, only: [:show, :update, :destroy]

      # GET /api/v1/workouts
      def index
        workouts = current_user.workouts
                               .by_type(params[:type])
                               .recent

        # Date range filter
        if params[:start_date].present? && params[:end_date].present?
          workouts = workouts.where(date: params[:start_date]..params[:end_date])
        elsif params[:month].present?
          date = Date.parse("#{params[:month]}-01")
          workouts = workouts.where(date: date.beginning_of_month..date.end_of_month)
        end

        workouts = workouts.limit(params[:limit] || 50)

        render json: {
          workouts: WorkoutSerializer.new(workouts).serializable_hash[:data].map { |w| w[:attributes] },
          meta: {
            total: workouts.count,
            today_completed: current_user.workouts.today.exists?
          }
        }
      end

      # GET /api/v1/workouts/:id
      def show
        render json: {
          workout: WorkoutSerializer.new(@workout).serializable_hash[:data][:attributes]
        }
      end

      # POST /api/v1/workouts
      def create
        workout = current_user.workouts.new(workout_params)
        workout.date ||= Date.current

        if workout.save
          render json: {
            message: "Workout logged! 💪",
            workout: WorkoutSerializer.new(workout).serializable_hash[:data][:attributes],
            stats: {
              current_streak: current_user.current_streak,
              today_total: current_user.workouts.today.sum(:duration)
            }
          }, status: :created
        else
          render json: {
            error: "Failed to log workout",
            details: workout.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/workouts/:id
      def update
        if @workout.update(workout_params)
          render json: {
            message: "Workout updated",
            workout: WorkoutSerializer.new(@workout).serializable_hash[:data][:attributes]
          }
        else
          render json: {
            error: "Failed to update workout",
            details: @workout.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/workouts/:id
      def destroy
        @workout.destroy
        render json: { message: "Workout deleted" }
      end

      private

      def set_workout
        @workout = current_user.workouts.find(params[:id])
      end

      def workout_params
        params.permit(:date, :workout_type, :duration, :feeling, :note, :custom_workout_type)
      end
    end
  end
end
