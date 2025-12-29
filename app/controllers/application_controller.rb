# frozen_string_literal: true

class ApplicationController < ActionController::API
  include JsonWebToken

  before_action :authenticate_request

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from JWT::DecodeError, with: :unauthorized

  private

  def authenticate_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header

    decoded = jwt_decode(token)
    @current_user = User.find(decoded[:user_id])
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError, NoMethodError
    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  attr_reader :current_user

  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: { 
      error: "Validation failed", 
      details: exception.record.errors.full_messages 
    }, status: :unprocessable_entity
  end

  def unauthorized
    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
