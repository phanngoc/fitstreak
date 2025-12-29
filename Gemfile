source "https://rubygems.org"

ruby "3.2.2"

# Rails 7.1
gem "rails", "~> 7.1.0"

# PostgreSQL adapter for Heroku production
gem "pg", "~> 1.5"

# MySQL adapter for local development
gem "mysql2", "~> 0.5", group: [:development, :test]

# Web server
gem "puma", ">= 5.0"

# JSON serialization
gem "jsonapi-serializer", "~> 2.2"

# Authentication
gem "bcrypt", "~> 3.1.7"
gem "jwt", "~> 2.7"

# CORS
gem "rack-cors"

# Timezone data
gem "tzinfo-data", platforms: %i[windows jruby]

# Performance
gem "bootsnap", require: false

group :development, :test do
  gem "debug", platforms: %i[mri windows]
  gem "rspec-rails", "~> 6.0"
  gem "factory_bot_rails"
  gem "faker"
end

group :development do
  gem "annotate"
  gem "rubocop-rails", require: false
end

group :test do
  gem "shoulda-matchers"
  gem "database_cleaner-active_record"
end
