# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication
      namespace :auth do
        post "register", to: "authentication#register"
        post "login", to: "authentication#login"
        delete "logout", to: "authentication#logout"
        get "me", to: "authentication#me"
      end

      # Workouts
      resources :workouts, only: [:index, :show, :create, :update, :destroy]

      # Stats
      namespace :stats do
        get "streak", to: "stats#streak"
        get "weekly", to: "stats#weekly"
        get "monthly", to: "stats#monthly"
        get "comparison", to: "stats#comparison"
      end
    end
  end

  # Health check
  get "health", to: "health#show"
end
