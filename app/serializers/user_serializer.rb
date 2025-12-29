# frozen_string_literal: true

class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :email, :name, :avatar_url, :created_at, :last_login_at

  attribute :member_since do |user|
    user.created_at.strftime("%B %Y")
  end
end
