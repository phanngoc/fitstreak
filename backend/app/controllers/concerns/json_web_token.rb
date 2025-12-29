# frozen_string_literal: true

module JsonWebToken
  extend ActiveSupport::Concern
  
  SECRET_KEY = ENV.fetch("JWT_SECRET") { Rails.application.secret_key_base }

  def jwt_encode(payload, exp = 7.days.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  def jwt_decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, algorithm: "HS256")
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError => e
    raise JWT::DecodeError, e.message
  end
end
