# frozen_string_literal: true

class HealthController < ActionController::API
  def show
    render json: {
      status: "ok",
      timestamp: Time.current.iso8601,
      version: "0.1.0"
    }
  end
end
