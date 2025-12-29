# frozen_string_literal: true

module Api
  module V1
    module Auth
      class AuthenticationController < ApplicationController
        skip_before_action :authenticate_request, only: [:register, :login]

        # POST /api/v1/auth/register
        def register
          user = User.new(user_params)
          
          if user.save
            token = jwt_encode(user_id: user.id)
            render json: {
              message: "Account created successfully",
              user: UserSerializer.new(user).serializable_hash[:data][:attributes],
              token: token
            }, status: :created
          else
            render json: { 
              error: "Registration failed", 
              details: user.errors.full_messages 
            }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/auth/login
        def login
          user = User.find_by(email: params[:email]&.downcase)

          if user&.authenticate(params[:password])
            user.update(last_login_at: Time.current)
            token = jwt_encode(user_id: user.id)
            
            render json: {
              message: "Login successful",
              user: UserSerializer.new(user).serializable_hash[:data][:attributes],
              token: token
            }
          else
            render json: { error: "Invalid email or password" }, status: :unauthorized
          end
        end

        # DELETE /api/v1/auth/logout
        def logout
          # In a real app, you might blacklist the token here
          render json: { message: "Logged out successfully" }
        end

        # GET /api/v1/auth/me
        def me
          render json: {
            user: UserSerializer.new(current_user).serializable_hash[:data][:attributes],
            stats: {
              current_streak: current_user.current_streak,
              longest_streak: current_user.longest_streak,
              total_workouts: current_user.workouts.count
            }
          }
        end

        private

        def user_params
          params.permit(:email, :name, :password, :password_confirmation)
        end
      end
    end
  end
end
